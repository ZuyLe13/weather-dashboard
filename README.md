# Weather Dashboard

## Introduction

A weather forecast that allows users to get the current weather conditions and the three-day forecast. In addition, there is a city search history saved, the user can review it. The user can register and unsubscribe to receive daily weather forecast information via email address.

## Demo Link

https://weather-dashboard-dile.netlify.app/

## Technical

- Frontend: ReactJS, TailwindCSS
- Backend: ExpressJS
- Database: MongoDB
- API: https://www.weatherapi.com/
- Send email: nodemailer
- Deployment:
- Other tools: fetch API, node-cron, mongoose

## Features

- Weather Forecast Summary: View summarized weather forecast including: date, time, temperature, wind, humidity.
- Search for a city or country and display weather information.
- Save temporary location history and allow display again during the day.
- Register and unsubscribe to receive daily weather forecast information via email address.

## Installation

1. Get a free API key at https://www.weatherapi.com/
2. Create MongoDB Atlas at https://www.mongodb.com/products/platform/atlas-database
3. Clone the repo

```sh
git clone https://github.com/ZuyLe13/weather-dashboard.git
```

4. Install NPM packages

```sh
npm install
```

5. Sign in with app passwords to use nodemailer
   For more information, please refer to the [Document](https://support.google.com/accounts/answer/185833?visit_id=638630268530892967-3715124080&p=InvalidSecondFactor&rd=1)

6. Enter DB_USERNAME, DB_PASSWORD in MongoDB Atlas project, API_KEY, your EMAIL and PASSWORD that generated at Sign in with app passwords.

```sh
DB_USERNAME=
DB_PASSWORD=
API_KEY=
EMAIL=
PASSWORD=
```

7. Run Project

```sh
npm run dev # Frontend
npm start # Backend
```

## Contact

My Name - Lê Anh Duy - duyle131103@gmail.com
<br/>Project Link: https://github.com/ZuyLe13/weather-dashboard
