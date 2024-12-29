#!/bin/sh
# server/docker-entrypoint.sh

echo "Running Prisma migrations..."
npx prisma db push

echo "Starting the application..."
exec "$@"