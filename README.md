# QT21-Scorecard

You can use the live demo: https://mqm-scorecard.herokuapp.com

## Installation Instructions

The installation instructions are targeted to users who know how to install a Node application on a webserver. We assume that you have already installed

* A webserver with Node (v16.x) and PostgreSQL(v9.x)
* A PostgreSQL server configured with a database
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
APP_ENV=production
EMAIL_PROVIDER<Provider associated with email account>
EMAIL_ADDRESS=<Address associated with email account>
EMAIL_PASSWORD=<Password associated with email account>

```

Nodemailer is used to proxy requests to the associated email account for email verification and password reset emails. If you are using Gmail as the email provider, you will need to configure your account to "Allow less secure apps".

### 3. Seed Database

Assuming you have all environment variables setup, the following command can be run to create the neccessary schemas for the scorecard app: 

```
node server/seed.js

```
NOTE: This script will destory and re-create all tables. 

### 4. Deploy Express/React Application

The QT21 Scorecard exists as an Express and React monorepo. In order to deploy the app, you will need to first install NPM dependencies. This is usually done automatically by hosting providers, but the following command is available to do so manually if need be:

```
npm ci

```

Next, a production build of the React portion will need to be created like so: 

```
npm run build

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

## MQM Scoring Model

The following formula is used within the express server to compute the OQS: 

_APT: absolute penality total_<br/>
_ONPT: overall normed penalty score_<br/>
_OQF: overall quality fraction_<br/>
_MSV: maximum score value, which is set to 100_<br/>
_OQS: overall quality score_<br/>
_sourceWordCount: total count of words in the source, where the text is parsed into words by using a **single whitespace as a delimiter**_<br/>
_targetWordCount: total count of words in the target, where the text is parsed into words by using a **single whitespace as a delimiter**_<br/>

**Severity Weights** 
- Netural: 0
- Minor: 1
- Major: 5
- Critical: 25

```
MSV = 100
APT = Total severity weights of all errors (both target and source)
ONPT = (APT * sourceWordCount) / targetWordCount
OQF = 1 - (ONPT / sourceWordCount)
OQS = (OQF * MSV)

```

NOTE: The final value of OQS is rounded to two decimals before being returned from the server.

## Project JSON Output 

The JSON output for a project is structured as defined below: 

```
{
    projectName: string,
    key: {
        [key: string]: string        
    }, // Map of segment IDs to segment numbers
    errors: {
        segment: string,
        target: string,
        name: string,
        severity: string,
        issueReportId: string,
        issueId: string,
        note: string,
        highlighting: {
            startIndex: number,
            endIndex: number
        }
    }[],
    metric: {
        parent: string | null,
        name: string,
        description: string,
        notes: string,
        examples: string,
        issueId: string
    }[],
    scores: {
        compositeScore: string
    },
    segments: {
        source: string[],
        target: string[],
    }
}

```

Example

```


{
  "projectName": "Testing-123",
  "key": {
    "57": "1",
    "58": "2",
    "59": "3",
  },
  "errors": [
    {
      "segment": "57",
      "target": "target",
      "name": "inconsistent use of terminology",
      "severity": "minor",
      "issueReportId": "4",
      "issueId": "term-inconsistency",
      "note": "||major; language register; R; 2",
      "highlighting": {
        "startIndex": 168,
        "endIndex": 172
      }
    },
    {
      "segment": "57",
      "target": "target",
      "name": "multiple terms in translation",
      "severity": "minor",
      "issueReportId": "5",
      "issueId": "multiple-translations-of-term",
      "note": "||in which; function words; G; 1",
      "highlighting": {
        "startIndex": 180,
        "endIndex": 187
      }
    },
    {
      "segment": "58",
      "target": "target",
      "name": "Terminology",
      "severity": "minor",
      "issueReportId": "6",
      "issueId": "terminology",
      "note": "||somebody had to doubt it; unidiomatic style; U; 2",
      "highlighting": {
        "startIndex": 14,
        "endIndex": 37
      }
    },
  ],
  "metric": [
    {
      "parent": null,
      "name": "Terminology",
      "description": "A term (domain-specific word) is translated with a term other than the one expected for the domain or otherwise specified.",
      "notes": "All errors specifically related to use of domain- or organization-specific terminology are included in this error and its children.\r\n\r\nDo not use this error if a text is simply mistranslated, i.e., if the translation would be a valid translation of the source but simply does not use the particular mandated terminology. For example, if a text translates [river] bank into Spanish as banco (a financial institution) instead of orilla (a river bank), this would be a mistranslation because banco would never be a valid term for the concept of a river bank. However, if a termbase specified that orilla should be used and the translation uses ribera instead, this would be a Terminology error because ribera is a valid term for the concept, but not the specified one.",
      "examples": "A French text translates English \"email\" as \"e-mail\" but terminology guidelines mandated that \"courriel\" be used.\n\nThe English musicological term dog is translated (literally) into German as Hund instead of as Schnarre, as specified in a terminology database.",
      "issueId": "terminology"
    },
    {
      "parent": "terminology",
      "name": "inconsistent use of terminology",
      "description": "A single concept is expressed with multiple terms.",
      "notes": "This error is used only to address inconsistent use of terminology in the target text. In cases where terminology is incorrect for the domain or termbase, wrong term or termbase should be used instead. If the inconsistent term use can be traced back to inconsist term use in the source text, the error type stays the same, but this special case should be annotated with an inconsistent source term root cause.",
      "examples": "A German source text uses one term for a component of a vehicle, but the target text uses “brake release lever”, “brake disengagement lever”, “manual brake release”, and “manual disengagement release” for this term in English.",
      "issueId": "term-inconsistency"
    },
    {
      "parent": "term-inconsistency",
      "name": "multiple terms in translation",
      "description": "A single source term is translated in multiple inconsistent ways.",
      "notes": "Applies to target text only since it refers to cases where one term has multiple translations. As with term-inconsistency, termbase or one of its children should be used instead if a termbase contains a specified term for a concept and the text does not use that particular term.",
      "examples": "A German source text uses one term for a component of a vehicle, but the target text uses “brake release lever”, “brake disengagement lever”, “manual brake release”, and “manual disengagement release” for this term in English.",
      "issueId": "multiple-translations-of-term"
    },
  ],
  "scores": {
    "compositeScore": "98.48"
  },
  "segments": {
    "source": [
      "Foi no penúltimo domingo de Janeiro de 1645, quando o conde Peter van Heest conclamou o povo do Recife — a \"grande e florescente\" capital do Brasil holandês — a comparecer a uma grande festa na qual, garantiu, um cavalo iria voar. ",
      "Houve logo quem duvidasse, é claro. ",
      "Mas até os mais céticos devem ter hesitado antes de rir na cara do conde. ",
    ],
    "target": [
      " Count Peter van Heest, on the next to the last Sunday of January, 1645, summoned the people of Recife — the \"great and thriving\" capital of Dutch Brazil — to attend a major party in which he guaranteed that a horse was going to fly.",
      " Immediately, somebody had to doubt it, of course.",
      " However, even the most skeptical ones must have hesitated before laughing at the count.",
  }
}

```

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

