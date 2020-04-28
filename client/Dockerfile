FROM mhart/alpine-node
WORKDIR /client
COPY package*.json /client/
# We need to copy files before npm install to ensure patch-package is working
COPY . /client/
RUN npm install --unsafe-perm
EXPOSE 3000
CMD ["npm", "start"]
