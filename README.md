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

- Node.js
- Typescript
- Webpack

## Deploy

###### Node 12.16.1

Add [node](https://github.com/asdf-vm/asdf-nodejs) plugin to asdf, or install 12.16.1 with NVM. You can check current nodejs version with `node --version`. 

###### The server

```bash
git clone https://github.com/salierri/geltarapp.git
cd geltarapp/server
npm install
npm run build
npm start
```

The HTTP server is listening on :3001, and the websocket server on :4000 to incoming connections by default.

This can be configured in the HTTP_PORT and WS_PORT env variable (or in `server/.env`) respectively.

The server address must be set in a REACT_APP_URL env variable or in `client/.env`

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

###### Proxying

If you are running the app behind a proxy (Nginx for example), you need to set the `x-real-ip` header in order to see client IP addresses.

## Development

Running the backend in development mode is no different from production: `npm run build && npm start` after editing.

The react frontend supports `npm run` which serves as a development react server, and autocompiles on every edit.

You sould __not__ edit the server definitions client side, instead, edit the definitions in the server code, then run `npm run build` to automatically rebuild and copy those definitions to the client.
