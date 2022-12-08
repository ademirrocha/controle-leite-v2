FROM node:14.17.0-alpine
WORKDIR /usr
COPY backend/package.json ./
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN ls -a
RUN npm install
RUN npm run build
COPY . .
## this is stage two , where the app actually runs
FROM node:14.17.0-alpine
WORKDIR /usr
COPY backend/package.json ./
RUN npm install --only=production
COPY --from=build /usr/src/app/dist ./dist
RUN npm install pm2 -g
EXPOSE 3333
CMD ["pm2-runtime","app.js"]