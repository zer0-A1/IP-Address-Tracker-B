// API config
import { API_PROVIDER, API_URL } from "../config/api";

// types
import { Response } from "express";

// interfaces
interface ipInfo {
  ip: string;
  location: string;
  timezone: string;
  isp: string;
  lat: number;
  lng: number;
  provider: string;
}

// functions

// fetch data from API url
export const fetchDataFromApi = async (
  res: Response,
  ipAddress: string,
  api: string
) => {
  let url = "";
  if (api === "ipdata") url = API_URL[api].replace("query", ipAddress);
  else url = API_URL[api] + ipAddress;
  const fetchRes = await fetchTimeout(url);
  if (fetchRes.ok) {
    const data = await fetchRes.json();
    if (isValidApiResponse(api, data)) return data;
    else
      res.status(500).json({
        status: "fail",
        message:
          "selected api is not working. it may be down or may have reached the max request limit.",
      });
  } else Promise.reject(fetchRes);
};

// convert API data to the desired ipInfo format
export const getIpInfoFromApiRes = (
  res: Response,
  resJson: any,
  api: string
) => {
  let [ip, isp, location, timezone] = Array(4).fill("");
  let [lat, lng] = Array(2).fill(0);
  switch (api) {
    case "ipify":
      ip = resJson.ip;
      isp = resJson.isp;
      location = `${resJson.location.country}, ${resJson.location.region}, ${resJson.location.city} ${resJson.location.postalCode}`;
      timezone = "UTC" + resJson.location.timezone;
      lat = Number(resJson.location.lat);
      lng = Number(resJson.location.lng);
      break;
    case "ip-api":
      ip = resJson.query;
      isp = resJson.isp;
      location = `${resJson.country}, ${resJson.regionName}, ${resJson.city} ${resJson.zip}`;
      timezone = resJson.timezone;
      lat = Number(resJson.lat);
      lng = Number(resJson.lon);
      break;
    case "ipgeolocation":
      ip = resJson.ip;
      isp = resJson.isp;
      location = `${resJson.country_code2}, ${resJson.state_prov}, ${resJson.city} ${resJson.zipcode}`;
      timezone =
        resJson.time_zone.name +
        "\n" +
        "UTC" +
        (resJson.time_zone.offset > 0 && "+") +
        resJson.time_zone.offset;
      lat = Number(resJson.latitude);
      lng = Number(resJson.longitude);
      break;
    case "ipwho":
      ip = resJson.ip;
      isp = resJson.connection.isp;
      location = `${resJson.country_code}, ${resJson.region}, ${resJson.city} ${resJson.postal}`;
      timezone = resJson.timezone.id + "\nUTC" + resJson.timezone.utc;
      lat = Number(resJson.latitude);
      lng = Number(resJson.longitude);
      break;
    case "ip2location":
      ip = resJson.ip;
      isp = resJson.as;
      location = `${resJson.country_code}, ${resJson.region_name}, ${resJson.city_name} ${resJson.zip_code}`;
      timezone = "UTC" + resJson.time_zone;
      lat = Number(resJson.latitude);
      lng = Number(resJson.longitude);
      break;
    case "ipdata":
      ip = resJson.ip;
      isp = resJson.asn.name;
      location = `${resJson.country_code}${
        resJson.region && ", " + resJson.region
      }${resJson.city && ", " + resJson.city}${
        resJson.postal && " " + resJson.postal
      }`;
      timezone = resJson.time_zone.name + "\nUTC" + resJson.time_zone.offset;
      lat = Number(resJson.latitude);
      lng = Number(resJson.longitude);
      break;
    default:
      return res
        .status(500)
        .json({ status: "fail", message: "no API provided" });
  }
  const ipinfo: ipInfo = {
    ip: ip,
    isp: isp,
    location: location,
    timezone: timezone,
    lat: lat,
    lng: lng,
    provider: API_PROVIDER[api],
  };
  return ipinfo;
};

// fetch IP of domain
export const fetchIp = async (domain: string) => {
  const url = "http://ip-api.com/json/" + domain;
  const fetchRes = await fetchTimeout(url);
  if (fetchRes.ok) {
    const jsonData = await fetchRes.json();
    return jsonData.query;
  } else Promise.reject(fetchRes);
};

// validate IP address
// regex from "https://uibakery.io/regex-library/ip-address"
const ipv4Regex =
  /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const ipv6Regex =
  /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

export const validateIp = (ip: string) => {
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// validate api response
const isValidApiResponse = (api: string, data: any) => {
  if (!data) return false;
  let isValid = false;
  switch (api) {
    case "ip-api":
      if (data.query) isValid = true;
      break;
    case "ipgeolocation":
    case "ipwho":
    case "ip2location":
    case "ipdata":
    default:
      if (data.ip) isValid = true;
      break;
  }
  return isValid;
};

// get domain.tld from url
export const getDomainFromUrl = (url: string) => {
  return new URL(url).hostname.replace("www.", "");
};

// adding timeout to fetch requests to fix vercel's
// "This Serverless Function has timed out." error
const fetchTimeout = async (
  res: RequestInfo | URL,
  options: RequestInit | undefined = {}
) => {
  // 6 seconds limit
  const limit = 6000;

  const controller = new AbortController();
  const timououtId = setTimeout(() => controller.abort(), limit);
  const fetchRes = await fetch(res, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(timououtId);
  return fetchRes;
};
