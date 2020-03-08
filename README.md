# Geltara

**A [watch2gether](https://www.watch2gether.com/) alternative with a bit different featureset to fit DnD sessions**

## Features

- Music and ambient video playing at the same time
- One DJ and unlimited players
- Master volume and player volumes working multiplicatively
- Pauses / Resume / Seek ahead
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
git clone https://github.com/salierri/geltara.git
cd geltara/server
npm install
npm run build
npm start
```

The server is listening on :4000 to incoming websockets by default

The server address must be set in a REACT_APP_URL env variable or in `client/.env`

###### The client

In a new terminal:

```bash
cd ../client
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

###### Development

You sould __not__ edit the server definitions client side, instead, edit the definitions in the server code, then run `npm run build` to automatically copy those definitions to the client.

The react frontend supports `npm run` which serves as a development react server, and autocompiles on every edit.
