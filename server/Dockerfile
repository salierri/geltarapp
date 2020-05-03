FROM mhart/alpine-node
WORKDIR /server
COPY package*.json /server/
RUN npm install
COPY . /server/
RUN npm run build
EXPOSE 3001 4000
CMD ["npm", "start"]
