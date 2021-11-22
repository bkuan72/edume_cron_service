# Stage 1
FROM node:14 as build-step
RUN mkdir -p /app/src
WORKDIR /app/src

COPY package.json /app/src
RUN npm install
COPY . /app/src
RUN npm run build

#stage 2
FROM node:14
RUN mkdir -p /app/edume_cron
WORKDIR /app/edume_cron
COPY --from=build-step /app/src/build /app/edume_cron
COPY package*.json /app/edume_cron
RUN npm install && npm i -g nodemon
CMD [ "npm", "run", "run-build" ]
EXPOSE 33005

