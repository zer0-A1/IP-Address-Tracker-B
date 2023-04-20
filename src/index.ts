// express
import express from "express";

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

// initialization

const app: Express = express();
app.use(cors());
app.use(rateLimit());
const port = process.env.PORT || 443;

// return ip info for selected api and
// provided ip or domain or
// request ip if none of them are provided
app.get(
  "/",
  cors(corsOptions),
  rateLimit(rateLimitOptions),
  async (req: Request, res: Response) => {
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
      const data = await fetchDataFromApi(
        res,
        requestIP as string,
        req.query.api as string
      );
      if (data)
        return res.json(
          getIpInfoFromApiRes(res, data, req.query.api as string)
        );
    }
    // if ip and api are set, return ipInfo for ip and api
    else if (req.query.ip) {
      // if ip is not valid return error
      if (!validateIp(req.query.ip as string))
        return res
          .status(400)
          .json({ status: "fail", message: "wrong IP address" });
      const data = await fetchDataFromApi(
        res,
        req.query.ip as string,
        req.query.api as string
      );
      return res.json(getIpInfoFromApiRes(res, data, req.query.api as string));
    }
    // if domain and api are set, get domain ip then return ipInfo for ip and api
    else if (req.query.domain) {
      const ip = await fetchIp(res, req.query.domain as string);
      // if ip is not valid return error
      if (!validateIp(ip))
        return res
          .status(400)
          .json({ status: "fail", message: "wrong IP address" });
      const ipInfo = await fetchDataFromApi(res, ip, req.query.api as string);
      return res.json(ipInfo);
    }
    // if domain and ip are not set, return error
    else
      return res.status(400).json({ status: "fail", message: "bad request" });
  }
);

// return api list
// higher rate limit because we're not calling any external APIs
app.get(
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
