// express
import express from 'express';

// types
import { Express, Request, Response } from 'express';

// middleware

// cors
import cors from 'cors';

// rate-limit-flexible
import rateLimitFlexible from './middleware/rateLimitFlexible';

// my custom middleware to add {author: "github.com/rashidshamloo"} and timestamp to all json responses
import addToJson from './middleware/addToJson';

const fieldsToAdd = {
  author: 'github.com/rashidshamloo',
  date: () => new Date().toJSON(),
};

// my custom middleware for checking the token
import checkToken from './middleware/checkToken';

// my custom middleware to add 'X-Powered-By' header
import poweredBy from './middleware/poweredBy';

// configs
import {
  corsOptions,
  rateLimitFlexibleOptions,
  rateLimitFlexibleOptionsList,
} from './config/middleware';

// API data
import { API_URL, API_PROVIDER } from './config/api';

// utility
import {
  validateIp,
  fetchIp,
  fetchDataFromApi,
  getIpInfoFromApiRes,
  getDomainFromUrl,
} from './utility/utility';

// initialization
const app: Express = express();
const port = process.env.PORT || 443;

/*
  the reason i've not added these middlewares to the app globally
  is because i want the rate limit headers to be present on all responses
  and since i'm using different rate-limit options for "/" and "/list" handlers
  i can't add it to the app globally. so for these middleware to be in the chain
  after the rateLimitFlexible, i'v added them to the handler instead.

app.use(cors(corsOptions));
app.use(checkToken);
*/

app.use(poweredBy);
app.use(addToJson(fieldsToAdd));

// return ip info for selected api and
// provided ip or domain or
// request ip if none of them are provided
app.get(
  '/',
  rateLimitFlexible(rateLimitFlexibleOptions),
  cors(corsOptions),
  checkToken,
  async (req: Request, res: Response) => {
    // alternate to using cors() middleware
    //   res.setHeader(
    //     "Access-Control-Allow-Origin",
    //     "https://rashidshamloo.github.io"
    //   );

    // if api doesn't exist return error
    if (!req.query.api || !API_URL[req.query.api.toString()]) {
      return res.status(400).json({ status: 'fail', message: 'bad request' });
    }
    let ip;
    // if ip and domain are not set, set ip to request ip
    // used undefined instead of ! to show error if domain is empty
    if (req.query.ip === undefined && req.query.domain === undefined) {
      // get ip from "x-forwarded-for" header on vercel
      // and return error if can't get it
      if (!(ip = req.headers['x-forwarded-for']?.toString())) ip = '4.2.2.4';
      // return res.status(400).json({
      //   status: 'fail',
      //   message: "no ip is provided and can't get request ip.",
      // });
    }
    // if ip is set, set ip to it
    else if (req.query.ip) {
      ip = req.query.ip.toString();
    }
    // if no ip is set but domain is set,
    // get the ip of the domain
    else if (req.query.domain) {
      try {
        ip = await fetchIp(req.query.domain.toString());
      } catch (error: any) {
        return res.status(error.status || 500).json({
          status: 'fail',
          message:
            error.name === 'AbortError'
              ? 'selected api took too long to respond.'
              : error.message,
        });
      }
    }
    // validate the ip and return error if it fails
    if (!validateIp(ip))
      return res
        .status(400)
        .json({ status: 'fail', message: 'wrong IP address' });

    // get the data from api
    let data;
    try {
      data = await fetchDataFromApi(res, ip, req.query.api.toString());
    } catch (error: any) {
      // return error message and if the error was because of time out,
      // show a better message instead of just "aborted"
      return res.status(error.status || 500).json({
        status: 'fail',
        message:
          error.name === 'AbortError'
            ? 'selected api took too long to respond.'
            : error.message,
      });
    }
    // return json of the formatted data
    return res.json(getIpInfoFromApiRes(res, data, req.query.api.toString()));
  }
);

// return api list
// higher rate limit because we're not calling any external APIs
app.get(
  '/list',
  rateLimitFlexible(rateLimitFlexibleOptionsList),
  cors(corsOptions),
  checkToken,
  (_: Request, res: Response) => {
    const apiList = Object.keys(API_PROVIDER).map((api) => {
      return { name: api, domain: getDomainFromUrl(API_PROVIDER[api]) };
    });
    return res.json(apiList);
  }
);

app.listen(port, () => {
  console.log(`🎉 Server is running at port: ${port}`);
});

export default app;
