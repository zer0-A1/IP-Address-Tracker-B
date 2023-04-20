// express
import express, { NextFunction } from "express";

// cors
import cors from "cors";

// rate-limit
import rateLimit from "express-rate-limit";

// configs
import {
  corsOptions,
  rateLimitOptions,
  rateLimitOptionsList,
} from "./config/middleware";
import { API_URL, API_PROVIDER } from "./config/api";

// types
import { Express, Request, Response } from "express";

// utility
import {
  validateIp,
  fetchIp,
  fetchDataFromApi,
  getIpInfoFromApiRes,
  getDomainFromUrl,
} from "./utility/utility";

// dotenv
import dotenv from "dotenv";
dotenv.config();

// initialization
const app: Express = express();
app.use(cors());
app.use(rateLimit());

const port = process.env.PORT || 443;

// my custom middleware for checking the token
// (token is just a pre-generated string and works like API Keys)

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.token || req.query.token !== process.env.TOKEN)
    return res
      .status(403)
      .json({ status: "fail", message: "access forbidden" });
  else next();
};

app.use(checkToken);

// return ip info for selected api and
// provided ip or domain or
// request ip if none of them are provided
app.all(
  "/",
  cors(corsOptions),
  rateLimit(rateLimitOptions),
  async (req: Request, res: Response, next: NextFunction) => {
    // alternate to using cors() middleware
    //   res.setHeader(
    //     "Access-Control-Allow-Origin",
    //     "https://rashidshamloo.github.io"
    //   );

    // if api doesn't exist return error
    if (!req.query.api || !API_URL[req.query.api as string]) {
      return res.status(400).json({ status: "fail", message: "bad request" });
    }
    // if ip and domain are not set, return ipInfo for request ip and api
    if (!req.query.ip && !req.query.domain) {
      // get ip from "x-forwarded-for" header on vercel
      const requestIP = req.headers["x-forwarded-for"];
      if (!validateIp(requestIP as string))
        return res
          .status(400)
          .json({ status: "fail", message: "wrong IP address" });
      let data;
      try {
        data = await fetchDataFromApi(
          res,
          requestIP as string,
          req.query.api as string
        );
      } catch (error: any) {
        return res
          .status(error.status || 500)
          .json({ status: "fail", message: error.message });
      }
      return res.json(getIpInfoFromApiRes(res, data, req.query.api as string));
    }
    // if ip and api are set, return ipInfo for ip and api
    else if (req.query.ip) {
      // if ip is not valid return error
      if (!validateIp(req.query.ip as string))
        return res
          .status(400)
          .json({ status: "fail", message: "wrong IP address" });
      let data;
      try {
        data = await fetchDataFromApi(
          res,
          req.query.ip as string,
          req.query.api as string
        );
      } catch (error: any) {
        return res
          .status(error.status || 500)
          .json({ status: "fail", message: error.message });
      }
      return res.json(getIpInfoFromApiRes(res, data, req.query.api as string));
    }
    // if domain and api are set, get domain ip then return ipInfo for ip and api
    else if (req.query.domain) {
      let ip;
      try {
        ip = await fetchIp(res, req.query.domain as string);
      } catch (error: any) {
        return res
          .status(error.status || 500)
          .json({ status: "fail", message: error.message });
      }
      // if ip is not valid return error
      if (!validateIp(ip))
        return res
          .status(400)
          .json({ status: "fail", message: "wrong IP address" });
      let data;
      try {
        data = await fetchDataFromApi(res, ip, req.query.api as string);
      } catch (error: any) {
        return res
          .status(error.status || 500)
          .json({ status: "fail", message: error.message });
      }
      const ipInfo = getIpInfoFromApiRes(res, data, req.query.api as string);
      return res.json(ipInfo);
    }
    // if domain and ip are not set, return error
    else
      return res.status(400).json({ status: "fail", message: "bad request" });
  }
);

// return api list
// higher rate limit because we're not calling any external APIs
app.all(
  "/list",
  cors(corsOptions),
  rateLimit(rateLimitOptionsList),
  (req: Request, res: Response) => {
    const apiList = Object.keys(API_PROVIDER).map((api) => {
      return { [api]: getDomainFromUrl(API_PROVIDER[api]) };
    });
    return res.json(apiList);
  }
);

app.listen(port, () => {
  console.log(`🎉 Server is running at port: ${port}`);
});

export default app;
