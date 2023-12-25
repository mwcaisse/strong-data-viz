FROM node:18 as build

WORKDIR /build/src

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build-only

FROM nginx:latest as runtime

COPY --from=build /build/src/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf