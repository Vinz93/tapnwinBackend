# tapnwin-backend

## Getting Started

You need to have installed preferably [Node.js](https://github.com/creationix/nvm) `v4.4.5` and [Mongo](https://docs.mongodb.com/v2.4/tutorial/install-mongodb-on-ubuntu/) `v2.4.9`.

We recommend to install [Grunt-CLI](http://gruntjs.com/) globally:

```bash
npm install -g grunt-cli
```

Clone the repository:
```sh
git clone https://user@bitbucket.org/ludopia/tapnwin-backend.git
cd tapnwin-backend
```

Install dependencies:
```sh
npm install
```

Start development server:
```sh
npm start
# or
grunt serve
```

You can run all seeds in `json` format located inside `config/seeds` as follows:
```sh
npm run seeds
```

Execute tests:
```sh
npm test
# or
grunt mocha
```

## Style guide
JavaScript code linting is done using [ESLint](http://eslint.org/), which is a pluggable linter tool for identifying and reporting on patterns. Uses ESLint with `eslint-config-airbnb`, which tries to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript). You must follow that guide strictly and this common conventions:

* The file and directory names are in `snake_case`
* Code documentation is in [Swagger jsdoc](https://www.npmjs.com/package/swagger-jsdoc)

## Deployment

Compile to ES5:
```sh
npm run build
# or
grunt build
```

Upload `dist/` to your server:
```sh
scp -rp dist/ user@dest:/path
```

Install production dependencies only:
```sh
npm i --production
```

Use any process manager to start your services:
```sh
pm2 start dist/index.js
```

In production you need to make sure your server is always up so you should ideally use any of the process manager recommended [here](http://expressjs.com/en/advanced/pm.html).
We recommend [pm2](http://pm2.keymetrics.io/) as it has several useful features like it can be configured to auto-start your services if system is rebooted.
