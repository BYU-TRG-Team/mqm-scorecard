# QT21-Scorecard

You can use the live demo: https://mqm-scorecard.herokuapp.com

## Installation Instructions

The installation instructions are targeted to users who know how to install a Node application on a webserver. We assume that you have already installed

* A webserver with Node and PostgreSQL support
* A PostgreSQL server with one database
* Git

The example command line calls are written for Linux / Mac users. The process can be easily adapted to Windows systems.

### 1. Download sourcecode

```
git clone https://github.com/BYU-TRG-Team/js-qt21-scorecard.git

```

### 2. Setup environment variables and SendGrid API Support

The following environment variables need to be set in order to deploy the scorecard application: 

```
AUTH_SECRET=<Random Secret for generating JWT tokens>
DATABASE_URL=<URL for the corresponding PostgreSQL db>
SENDGRID_API_KEY=<API Key retrieved from SendGrid>
APP_ENV=production
SENDGRID_EMAIL_ADDRESS=<Email address to send requests from>

```

SendGrid is used for account verification and password reset emails. In order to enable this, you will need to create an account with SendGrid and retrieve an API key. Additionally, a legitimate email will need to be specified with the *SENDGRID_EMAIL_ADDRESS* variable that will serve as the sender address. 

### 3. Seed Database

Assuming you have all environment variables setup, the following command can be run to create the neccessary schemas for the scorecard app: 

```
node server/seed.js

```
NOTE: This script will destory and re-create all tables. 

### 4. Deploy Express/React Application

The QT21 Scorecard exists as an Express and React monorepo. In order to deploy the app, you will first want to run a production build of the React portion like so: 

```
npm run build

```

Next, all NPM dependencies will need to be installed. This is usually done automatically by hosting providers, but the following command is available to do so manually if need be: 

```
npm ci

```

From there, the following command will need to be run in order to start the express server:

```
npm run start

```

## Local Development

For local development, you will want to set the environment variable *APP_ENV*=*development*. To run the application locally, express and react can be run in parallel by running the following commands in different tabs:

```
npm run dev:server
npm run dev:react

```

Seeding a local database should follow the same steps for seeding in production.

## License

```
Copyright 2015 Deutsches Forschungszentrum für Künstliche Intelligenz

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

This project uses 3rd party tools. You can find the list of 3rd party tools including their authors and licenses [here](https://github.com/BYU-TRG-Team/js-qt21-scorecard/blob/main/LICENSE-3RD-PARTY.txt)

