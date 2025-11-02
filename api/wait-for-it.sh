#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

echo "Waiting for $host:$port..."

while ! nc -z "$host" "$port"; do
  sleep 1
done

echo "$host:$port is available, executing command..."
exec $cmd
