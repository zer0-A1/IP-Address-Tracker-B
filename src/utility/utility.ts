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
  author: string;
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
  try {
    const fetchRes = await fetch(url);
    if (!fetchRes.ok)
      return res
        .status(fetchRes.status)
        .json({ status: "fail", message: fetchRes.statusText });
    return await fetchRes.json();
  } catch (error: any) {
    res.status(500).json({ status: "fail", message: error.message });
  }
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
      location = `${resJson.country_code}, ${resJson.region}, ${resJson.city} ${resJson.postal}`;
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
    author: "https://github.com/rashidshamloo",
  };
  return ipinfo;
};

// fetch IP of domain
export const fetchIp = async (res: Response, domain: string) => {
  const url = "https://api.ipify.org/?format=json&domain=" + domain;
  try {
    const fetchRes = await fetch(url);
    if (!fetchRes.ok)
      return res
        .status(fetchRes.status)
        .json({ status: "fail", message: fetchRes.statusText });
    const jsonData = await fetchRes.json();
    return jsonData.query;
  } catch (error: any) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
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
