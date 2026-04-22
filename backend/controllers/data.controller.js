import axios from "axios";
import weatherModel from "../models/weather.model.js";
import villageModel from "../models/village.model.js";
import Form from "../models/form.model.js";
import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import config from "../Config/app.config.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeText = (value) => String(value ?? "").trim();

const buildCaseInsensitiveRegex = (value) => new RegExp(`^${escapeRegex(value)}$`, "i");

const findLocation = (villageDoc, district, state) =>
  villageDoc?.locations.find(
    (location) =>
      location.dist_name.toLowerCase() === district.toLowerCase() &&
      location.state_name.toLowerCase() === state.toLowerCase()
  );

const selectVillageMatch = (villages, district, state) => {
  if (!Array.isArray(villages)) {
    return null;
  }

  const exactMatch = villages.find((village) => {
    const villageDistrict = normalizeText(village.district_name || village.district);
    const villageState = normalizeText(village.state_name || village.state);

    return (
      villageDistrict.toLowerCase() === district.toLowerCase() &&
      villageState.toLowerCase() === state.toLowerCase()
    );
  });

  if (exactMatch) {
    return exactMatch;
  }

  return villages.find((village) => {
    const villageState = normalizeText(village.state_name || village.state);
    return villageState.toLowerCase() === state.toLowerCase();
  });
};

const fetchVillageDataFromBhuvan = async (villageName) => {
  if (!config.bhuvanApiKey) {
    throw new ApiError(503, "BHUVAN_API_KEY is not configured.");
  }

  const bhuvanApiUrl = `https://bhuvan-app1.nrsc.gov.in/api/api_proximity/curl_village_geocode.php?village=${encodeURIComponent(
    villageName
  )}&token=${config.bhuvanApiKey}`;

  const response = await axios.get(bhuvanApiUrl, { timeout: 10000 });
  return Array.isArray(response.data) ? response.data : [];
};

const saveVillageLocation = async (villageName, district, state, latitude, longitude) => {
  let villageDoc = await villageModel.findOne({
    name: buildCaseInsensitiveRegex(villageName),
  });

  if (!villageDoc) {
    villageDoc = await villageModel.create({
      name: villageName,
      locations: [
        {
          dist_name: district,
          state_name: state,
          latitude,
          longitude,
        },
      ],
    });

    return villageDoc;
  }

  const existingLocation = findLocation(villageDoc, district, state);

  if (!existingLocation) {
    villageDoc.locations.push({
      dist_name: district,
      state_name: state,
      latitude,
      longitude,
    });

    await villageDoc.save();
  }

  return villageDoc;
};

const resolveVillageLocation = async (villageName, district, state) => {
  const normalizedVillage = normalizeText(villageName);
  const normalizedDistrict = normalizeText(district);
  const normalizedState = normalizeText(state);

  let villageDoc = await villageModel.findOne({
    name: buildCaseInsensitiveRegex(normalizedVillage),
  });

  let location = findLocation(villageDoc, normalizedDistrict, normalizedState);

  if (location) {
    return { villageDoc, location };
  }

  const bhuvanResponse = await fetchVillageDataFromBhuvan(normalizedVillage);
  const matchedVillage = selectVillageMatch(bhuvanResponse, normalizedDistrict, normalizedState);

  if (!matchedVillage) {
    throw new ApiError(404, "Village not found for the given district and state.");
  }

  const latitude = Number(matchedVillage.latitude ?? matchedVillage.lat);
  const longitude = Number(matchedVillage.longitude ?? matchedVillage.lng ?? matchedVillage.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new ApiError(404, "Coordinates were not available for this village.");
  }

  villageDoc = await saveVillageLocation(
    normalizedVillage,
    normalizedDistrict,
    normalizedState,
    latitude,
    longitude
  );

  location = findLocation(villageDoc, normalizedDistrict, normalizedState);

  if (!location) {
    throw new ApiError(500, "Village location could not be saved.");
  }

  return { villageDoc, location };
};

const isRecentWeather = (weatherDocument) => {
  if (!weatherDocument?.createdAt) {
    return false;
  }

  const ageInMilliseconds = Date.now() - new Date(weatherDocument.createdAt).getTime();
  return ageInMilliseconds <= config.weatherCacheMinutes * 60 * 1000;
};

const coordinatesMatch = (weatherDocument, latitude, longitude) => {
  const cachedLat = Number(weatherDocument?.coord?.lat);
  const cachedLon = Number(weatherDocument?.coord?.lon);

  if (!Number.isFinite(cachedLat) || !Number.isFinite(cachedLon)) {
    return false;
  }

  return Math.abs(cachedLat - latitude) < 0.01 && Math.abs(cachedLon - longitude) < 0.01;
};

const serializeWeatherDocument = (weatherDocument) => ({
  coord: weatherDocument.coord,
  weather: weatherDocument.weather,
  main: weatherDocument.main,
  visibility: weatherDocument.visibility,
  wind: weatherDocument.wind,
  rain: weatherDocument.rain,
  clouds: weatherDocument.clouds,
  dt: weatherDocument.dt,
  sys: weatherDocument.sys,
  timezone: weatherDocument.timezone,
  name: weatherDocument.name,
  cod: weatherDocument.cod,
  createdAt: weatherDocument.createdAt,
});

const fetchAndSaveWeatherData = async (villageId, latitude, longitude) => {
  if (!config.weatherApiKey) {
    throw new ApiError(503, "WEATHER_API_KEY is not configured.");
  }

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${config.weatherApiKey}&units=metric`;
  const weatherResponse = await axios.get(weatherUrl, { timeout: 10000 });
  const weatherData = weatherResponse.data;

  await weatherModel.create({
    village: villageId,
    coord: weatherData.coord,
    weather: weatherData.weather,
    main: weatherData.main,
    visibility: weatherData.visibility,
    wind: weatherData.wind,
    rain: weatherData.rain || {},
    clouds: weatherData.clouds,
    dt: weatherData.dt,
    sys: weatherData.sys,
    timezone: weatherData.timezone,
    name: weatherData.name,
    cod: weatherData.cod,
  });

  return weatherData;
};

export const listVillages = asyncHandler(async (req, res) => {
  const villages = await Form.find()
    .select("name dist_name state_name createdAt")
    .sort({ name: 1, dist_name: 1, state_name: 1 })
    .lean();

  res.status(200).json(villages);
});

export const addVillage = asyncHandler(async (req, res) => {
  const name = normalizeText(req.body.name);
  const dist_name = normalizeText(req.body.dist_name);
  const state_name = normalizeText(req.body.state_name);

  if (!name || !dist_name || !state_name) {
    throw new ApiError(400, "name, dist_name, and state_name are required.");
  }

  const existingVillage = await Form.findOne({ name, dist_name, state_name }).lean();

  if (existingVillage) {
    throw new ApiError(409, "This village entry already exists.");
  }

  const newVillage = await Form.create({ name, dist_name, state_name });
  let locationSynced = false;

  try {
    await resolveVillageLocation(name, dist_name, state_name);
    locationSynced = true;
  } catch (error) {
    locationSynced = false;
  }

  res.status(201).json({
    message: "Village added successfully.",
    village: newVillage,
    locationSynced,
  });
});

export const getVillageData = asyncHandler(async (req, res) => {
  const village = normalizeText(req.query.village || req.query.name);

  if (!village) {
    throw new ApiError(400, "Village name is required.");
  }

  const data = await fetchVillageDataFromBhuvan(village);

  res.status(200).json({
    message: "Village data fetched successfully.",
    data,
  });
});

export const getWeatherData = asyncHandler(async (req, res) => {
  const village = normalizeText(req.query.village);
  const dist_name = normalizeText(req.query.dist_name);
  const state_name = normalizeText(req.query.state_name);

  if (!village || !dist_name || !state_name) {
    throw new ApiError(
      400,
      "Village name, district name, and state name are required."
    );
  }

  const { villageDoc, location } = await resolveVillageLocation(village, dist_name, state_name);
  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);

  const recentWeatherEntries = await weatherModel
    .find({ village: villageDoc._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const cachedWeather = recentWeatherEntries.find(
    (weatherEntry) =>
      isRecentWeather(weatherEntry) && coordinatesMatch(weatherEntry, latitude, longitude)
  );

  const weather = cachedWeather
    ? serializeWeatherDocument(cachedWeather)
    : await fetchAndSaveWeatherData(villageDoc._id, latitude, longitude);

  res.status(200).json({
    message: cachedWeather
      ? "Weather data fetched successfully from cache."
      : "Weather data fetched successfully.",
    village,
    district: dist_name,
    state: state_name,
    latitude,
    longitude,
    weather,
  });
});
