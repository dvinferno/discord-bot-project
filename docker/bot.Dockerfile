FROM oven/bun

WORKDIR /app
COPY apps/bot /app
RUN bun install

CMD ["bun", "bot.ts"]