FROM node:20-alpine
COPY apps/web /app
RUN npm install
RUN npm run build
EXPOSE 4321
CMD ["npm", "run", "dev"]