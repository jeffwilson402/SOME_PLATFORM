# Dockerfile for Frontend

# Build react client
FROM node:16-alpine AS ui-builder

# Working directory be app
WORKDIR /usr/src/app

COPY package*.json ./

###  Installing dependencies

RUN npm install --silent
# RUN npm install -g serve


# copy local files to app folder
COPY . .
RUN npm run build
# FROM node:16-alpine
# COPY --from=ui-builder /usr/src/app/build /usr/src/app/build
FROM nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=ui-builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80

# CMD ["npm","run","deploy"]