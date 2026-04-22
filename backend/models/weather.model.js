import mongoose from "mongoose";

const WeatherSchema = new mongoose.Schema(
  {
    village: { type: mongoose.Schema.Types.ObjectId, ref: "Village", required: true, index: true },
    coord: {
      lon: Number,
      lat: Number,
    },
    weather: [
      {
        id: Number,
        main: String,
        description: String,
        icon: String,
      },
    ],
    main: {
      temp: Number,
      feels_like: Number,
      temp_min: Number,
      temp_max: Number,
      pressure: Number,
      humidity: Number,
      sea_level: Number,
      grnd_level: Number,
    },
    visibility: Number,
    wind: {
      speed: Number,
      deg: Number,
      gust: Number,
    },
    rain: {
      "1h": { type: Number, required: false },
    },
    clouds: {
      all: Number,
    },
    dt: Number,
    sys: {
      type: { type: Number },
      id: Number,
      country: String,
      sunrise: Number,
      sunset: Number,
    },
    timezone: Number,
    name: String,
    cod: Number,
  },
  { timestamps: true }
);

WeatherSchema.index({ village: 1, createdAt: -1 });

export default mongoose.model("Weather", WeatherSchema);
