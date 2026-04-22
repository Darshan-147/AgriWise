import mongoose from "mongoose";

const VillageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    locations: [
      {
        dist_name: { type: String, required: true, trim: true },
        state_name: { type: String, required: true, trim: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

VillageSchema.index({ name: 1, "locations.dist_name": 1, "locations.state_name": 1 });

export default mongoose.model("Village", VillageSchema);
