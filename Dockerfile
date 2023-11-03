FROM node:18-alpine
WORKDIR /app

# add package json only. to cache the layer
ADD package.json package.json

# install dependencies
RUN npm install

# add all other files
ADD . .

# build the app
RUN npm run build

# clean dev dependencies
RUN npm prune --production

# run
CMD ["node", "./dist/src/main.js"]
