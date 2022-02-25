# Geltarapp

**A [watch2gether](https://www.watch2gether.com/) alternative with a bit different featureset to fit DnD sessions**

## Features

- Music and ambient video playing at the same time
- One DJ and unlimited players
- Master volume and player volumes working multiplicatively
- Pauses / Resume / Seek ahead
- Automatic video looping
- Basic feedback options from the players to the DJ

## Tech stack

### Client

- React
- Typescript
- [Create-react-app](https://github.com/facebook/create-react-app)

### Server

- MongoDB
- Node.js
- Typescript
- Webpack

## Deploying / Getting started

###### Node 12.16.1

Add [node](https://github.com/asdf-vm/asdf-nodejs) plugin to asdf, or install 12.16.1 with NVM. You can check current nodejs version with `node --version`. 

###### MongoDB

Install [MongoDb](https://docs.mongodb.com/manual/installation/), with a version of at least v2.6.10.

Configure the MongoDB URL for the server in `server/config/default.json`, or in an env variable as described [here](https://github.com/node-config/node-config/wiki/Environment-Variables).

###### The server

```bash
git clone https://github.com/salierri/geltarapp.git
cd geltarapp/server
npm install
npm run build
npm start
```

The HTTP server is listening on :3001, and the websocket server on :4000 to incoming connections by default.

This can be configured in `server/config/`.

The server addresses must be set in the REACT_APP_WS_URL and REACT_APP_HTTP_URL env variables or in `client/.env`

###### The client

In a new terminal:

```bash
cd geltarapp/client
npm install
npm run build
```

Then serve the static files for example by `serve`:

```bash
npm install -g serve
serve -s build
```

The serve process is listening on :5000 by default

## Development

Running the backend in development mode is no different from production: `npm run build && npm start` after editing.

The react frontend supports `npm run` which serves as a development react server, and autocompiles on every edit.

You sould __not__ edit the server definitions client side, instead, edit the definitions in the server code, then run `npm run build` to automatically rebuild and copy those definitions to the client.
