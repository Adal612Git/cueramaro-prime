# Minimal Dockerfile for Vite React app
FROM node:18-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN if [ -f package.json ]; then npm ci || npm install; fi

COPY . ./

RUN if [ -f package.json ]; then npm run build || npx vite build || true; fi

ENV PORT=5173
EXPOSE 5173

CMD ["sh", "-c", "npx vite preview --host 0.0.0.0 --port ${PORT:-5173}"]

