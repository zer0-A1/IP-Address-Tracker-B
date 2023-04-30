# Front End Mentor - Project 033 - IP Address Tracker - Backend

This is the back-end API for [IP Address Tracker](https://github.com/rashidshamloo/fem_033_ip-address-tracker) written in Node.js/Express.js

## Table of contents

- [Overview](#overview)
  - [Features](#features)
- [My process](#my-process)
  - [Built with](#built-with)
- [Author](#author)

## Overview

### Features

- CORS (using `cors()` middleware - { 'https://rashidshamloo.github.io', methods: 'GET' })
- Rate limiting per IP address (using `rate-limiter-flexible` - 100 for '/' end point and 1000 for '/list')
- Token authentication (using custom middleware - random key checked for each request)
- Added custom JSON fields for all requests (using custom middleware - author and date timestamp)
- Timeout for fetch requests from public APIs
- Public API keys stored in .env file and set in Vercel environment variables
- Coded with TypeScript

### Sample returned JSON

```json
{
  "ip": "8.8.8.8",
  "isp": "Google LLC",
  "location": "United States, Virginia, Ashburn 20149",
  "timezone": "America/New_York",
  "lat": 39.03,
  "lng": -77.5,
  "provider": "http://ip-api.com",
  "author": "github.com/rashidshamloo",
  "date": "2023-04-30T06:03:28.898Z"
}
```

## My process

### Built with

- Node.js
- Express.js
- TypeScript

## Author

- Portfolio - [rashidshamloo.ir](https://www.rashidshamloo.ir)
- Linkedin - [rashid-shamloo](https://www.linkedin.com/in/rashid-shamloo/)
- Frontend Mentor - [@rashidshamloo](https://www.frontendmentor.io/profile/rashidshamloo)
- Twitter - [@rashidshamloo](https://www.twitter.com/rashidshamloo)
- Dev.to - [@rashidshamloo](https://dev.to/rashidshamloo)
