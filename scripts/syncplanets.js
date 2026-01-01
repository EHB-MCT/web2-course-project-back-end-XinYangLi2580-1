import "dotenv/config";
import mongoose from "mongoose";
import Planet from "../models/planet.js"; // change if your model path differs

const EXO_API_BASE =
  process.env.EXO_API_BASE || "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";

function slugify(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function pcToLy(pc) {
  if (pc == null || Number.isNaN(pc)) return null;
  return pc * 3.26156;
}

function lyToMkm(ly) {
  // 1 ly ≈ 9.4607e12 km  => in million km (Mkm) is 9.4607e6
  if (ly == null || Number.isNaN(ly)) return null;
  return ly * 9_460_700;
}

function earthRadiiToKm(re) {
  // Earth radius ≈ 6371 km
  if (re == null || Number.isNaN(re)) return null;
  return re * 6371;
}

function earthMassToE24(me) {
  // Earth mass ≈ 5.972e24 kg => in "E24 kg" units, Earth = 5.972
  if (me == null || Number.isNaN(me)) return null;
  return me * 5.972;
}

async function fetchExoplanets() {
  // NASA Exoplanet Archive TAP sync
  // ps table columns: pl_name, hostname, sy_dist (pc), pl_rade (Earth radii),
  // pl_bmasse (Earth masses), disc_year, default_flag
  const query = `
    select top 2000
      pl_name, hostname, sy_dist, pl_rade, pl_bmasse, disc_year
    from ps
    where default_flag = 1 and sy_dist is not null
    order by sy_dist asc
  `.trim();

  const url = `${EXO_API_BASE}?query=${encodeURIComponent(query)}&format=json`;

  const resp = await fetch(url, {
    headers: {
      "Accept": "application/json",
    },
  });

  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    throw new Error(`NASA Exoplanet Archive fetch failed: ${resp.status} ${resp.statusText}\n${txt}`);
  }

  return resp.json();
}

async function sync() {
  const mongo = process.env.MONGODB_URI;
  if (!mongo) throw new Error("MONGODB_URI missing in .env");

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(mongo);
  console.log("✅ MongoDB connected");

  console.log("🪐 Fetching exoplanets from NASA Exoplanet Archive...");
  const rows = await fetchExoplanets();

  console.log(`📦 Received ${rows.length} rows. Upserting...`);

  let upserts = 0;

  for (const r of rows) {
    const name = r.pl_name;
    if (!name) continue;

    const key = slugify(name);
    const hostStar = r.hostname || "";

    const distancePc = r.sy_dist != null ? Number(r.sy_dist) : null;
    const distanceLy = distancePc != null ? pcToLy(distancePc) : null;
    const distanceMkm = distanceLy != null ? Math.round(lyToMkm(distanceLy)) : null;

    const radiusKm = r.pl_rade != null ? Math.round(earthRadiiToKm(Number(r.pl_rade))) : null;
    const massE24 = r.pl_bmasse != null ? Number(earthMassToE24(Number(r.pl_bmasse)).toFixed(3)) : null;

    const discoveryYear = r.disc_year != null ? Number(r.disc_year) : null;

    await Planet.updateOne(
      { key },
      {
        $set: {
          key,
          name,
          hostStar,
          discoveryYear,
          distancePc,
          distanceLy,
          distanceMkm,
          radiusKm,
          massE24,
          source: "nasa-exoplanet-archive",
        },
      },
      { upsert: true }
    );

    upserts++;
  }

  console.log(`✅ Done. Upserted ${upserts} planets into MongoDB.`);
  await mongoose.disconnect();
  console.log("👋 Disconnected.");
}

sync().catch((err) => {
  console.error("❌ Sync error:", err);
  process.exit(1);
});
