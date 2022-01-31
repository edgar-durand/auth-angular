# Leyes Front

## Description

[Leyes Front](https://github.com/geraldosalazar16/leyes-front.git) is an application to view the content of laws and
their modifications. It also allows the user to study them (highlighting texts, writing comments).

## Installation

### Configuration

Fill the configuration options in the `enviroments.ts` and `enviroments.prod.ts` files

`apiBaseUrl` Url where the API is published

### Install dependencies

```bash
$ npm install
```

## Run app

```bash
# development
$ npm run start

```

## Build app

The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build

```bash
$ npm run build
```

## Build Bundles application report
Recommended to visit [Bundle Phobia](https://bundlephobia.com/) for bundles details

Report will be stored in `dist/app-name/stats.json`

```bash
$ npm run build:stats
```
Launch bundles report from `dist/app-name/stats.json`

```bash
$ npm run explorer
```

To build and run report at once

```bash
$ npm run explorer:build
```

## Unit tests

```bash
$ npm run test
```

## End-to-end tests

```bash
$ npm run e2e
```

## Support

The Insolitapps company is responsible for the maintenance of this app.

## License

Leyes API is privately licensed.
