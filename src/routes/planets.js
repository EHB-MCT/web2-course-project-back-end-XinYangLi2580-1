import express from "express";
import Planet from "../models/planet.js";

const router = express.Router();

/**
 * GET /api/planets
 * Returns all planets (optionally limited)
 *  - ?limit=200
 */
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 0), 5000); // safety cap
    const q = Planet.find().sort({ distancePc: 1 });
    if (limit > 0) q.limit(limit);
    const planets = await q;
    res.json(planets);
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to fetch planets", error: String(err) });
  }
});

/**
 * GET /api/planets/recommended?count=8
 * Random planets for homepage
 */
router.get("/recommended", async (req, res) => {
  try {
    const count = Math.max(1, Math.min(Number(req.query.count || 8), 20));
    const planets = await Planet.aggregate([{ $sample: { size: count } }]);
    res.json(planets);
  } catch (err) {
    res.status(500).json({ ok: false, message: "Failed to fetch recommended planets", error: String(err) });
  }
});

// GET single planet by key
router.get('/:key', async (req, res) => {
  try {
    const planet = await Planet.findOne({ key: req.params.key })
    if (!planet) return res.status(404).json({ ok:false, message:'Planet not found' })
    res.json(planet)
  } catch (e) {
    res.status(500).json({ ok:false, message: e.message })
  }
})


/**
 * GET /api/planets/search
 * Search + filters + sort (for your Search page)
 *
 * Query:
 *  - q=earth (matches name/hostStar)
 *  - maxPrice (later when you compute price server-side, optional)
 *  - maxDistanceMkm
 *  - sort = cheapest | expensive | shortest | longest | az | za
 *
 * For now: we sort using distanceMkm (since price is computed in frontend currently).
 */
router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const maxDistanceMkm = Number(req.query.maxDistanceMkm || 0);
    const sort = (req.query.sort || "shortest").toLowerCase();
    const limit = Math.max(1, Math.min(Number(req.query.limit || 200), 500));

    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { hostStar: { $regex: q, $options: "i" } },
      ];
    }
    if (maxDistanceMkm > 0) {
      filter.distanceMkm = { $lte: maxDistanceMkm };
    }

    let sortObj = { distanceMkm: 1 };
    if (sort === "longest") sortObj = { distanceMkm: -1 };
    if (sort === "az") sortObj = { name: 1 };
    if (sort === "za") sortObj = { name: -1 };

    // cheapest/expensive: keep placeholders (your frontend calculates price now)
    if (sort === "cheapest") sortObj = { distanceMkm: 1 };
    if (sort === "expensive") sortObj = { distanceMkm: -1 };

    const planets = await Planet.find(filter).sort(sortObj).limit(limit);
    res.json(planets);
  } catch (err) {
    res.status(500).json({ ok: false, message: "Search failed", error: String(err) });
  }
});

export default router;
