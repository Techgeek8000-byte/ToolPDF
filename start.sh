#!/bin/bash
cd /home/z/my-project
bun run dev &
while ! curl -s http://localhost:3000 > /dev/null 2>&1; do sleep 2; done
echo "Server is ready!"

