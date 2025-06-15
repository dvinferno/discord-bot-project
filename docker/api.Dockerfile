FROM oven/bun
WORKDIR /app
COPY apps/api /app
RUN bun install
CMD ["bun", "index.ts"]