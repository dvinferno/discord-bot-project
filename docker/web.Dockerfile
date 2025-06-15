FROM oven/bun

WORKDIR /apps
COPY ./apps/web ./
RUN bun install
RUN bun run build

EXPOSE 4173
CMD ["bun", "run", "preview", "--host"]