FROM oven/bun:1 AS base

FROM base AS builder

WORKDIR /app

RUN bun add turbo --global

COPY . .

RUN turbo prune web-app --docker

FROM base AS installer

WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN bun install --force

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN bun turbo build

FROM base AS runner
WORKDIR /app

COPY --from=installer /app .

RUN bun i -g serve

EXPOSE 4173

CMD ["serve", "-s", "/app/apps/web-app/dist", "-p", "4173"]
