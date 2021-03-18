# Adafri app

Adafri angular/firebase front end application

## Get started

### Requirements

Nodejs v12.19.0



### Clone the repo

```shell
git clone https://gitlab.com/adafri-dev/adafri-gba-sprint.git //using http
git clone git@gitlab.com:adafri-dev/adafri-gba-sprint.git //using ssh
cd adafri-gba-sprint.git
```


### Install npm packages

Install the `npm` packages described in the `package.json` and verify that it works:

```shell
npm install
```


### Fix crypto (Important)

Fix crypto package by editing `node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js' and changed the lines in that regex:
```shell
// old:
node: false,
// new:
node: { crypto: true, stream: true },
```


### Fix js-video-url-parser (Important)

Comment inside node_modules/js-video-url-parser/lib/index.d.ts
```shell
//Comment this line
export * from './provider/template';
```


# Start the app

```shell
npm start
```
The `npm start` command run `angular-app` on port `4200`.

Shut it down manually with `Ctrl-C`.



The `npm run build` command builds (compiles TypeScript and copies assets) the application into `dist/`, watches for changes to the source files.

