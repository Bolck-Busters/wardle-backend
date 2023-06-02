FROM node:18.15.0
RUN mkdir -p /app
WORKDIR /app
COPY package*.json /app/
ADD . /app
RUN npm install
COPY .env .env
COPY . .
EXPOSE 3000
CMD [ "node", "index.js" ]