import mongoose from "mongoose";

const PlanetSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true }, // slug-like unique id
    name: { type: String, required: true, index: true },

    // Exoplanet fields (NASA)
    hostStar: { type: String, default: "" },
    discoveryYear: { type: Number, default: null },

    // Distance
    distancePc: { type: Number, default: null }, // parsecs from NASA
    distanceLy: { type: Number, default: null }, // converted
    distanceMkm: { type: Number, default: null }, // converted "million km" for your UI joke-scale

    // Size / mass (keep your existing naming style)
    radiusKm: { type: Number, default: null },
    massE24: { type: Number, default: null }, // keep this field name to stay compatible with your frontend style

    // Metadata
    source: { type: String, default: "nasa-exoplanet-archive" },
  },
  { timestamps: true }
);

export default mongoose.model("Planet", PlanetSchema);
