FROM node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

# Skip TypeScript checking and just build
RUN npm run build

FROM nginx:alpine

# Create nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

COPY --from=builder /app/dist /usr/share/nginx/html

# Expose both ports 80 and 3000
EXPOSE 80 3000

CMD ["nginx", "-g", "daemon off;"]
