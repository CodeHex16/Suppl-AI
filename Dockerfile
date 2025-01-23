
FROM node:20


WORKDIR /app


COPY package*.json ./
RUN npm install


COPY . .



# uncomment the following lines if you want to build the app
# RUN npm run build

# in production use Apache or Nginx to serve the app
# CMD ["npm", "run", "preview"]
