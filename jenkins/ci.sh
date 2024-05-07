#!/bin/bash

echo ""
echo "Spinning up build container"
sudo docker compose -f docker-compose.base.yaml up -d --build --force-recreate
sleep 10 # Ensure spin-up before curl

echo ""
echo "Confirm hosted on localhost:3000"
echo ""
curl localhost:3000 > /dev/null
res1=$?
if test "$res1" != "0"; then
    echo "curl failed with: $res1"
    sudo docker compose -f docker-compose.base.yaml down --remove-orphans
    exit 1
fi
echo "curl successful"

echo ""
echo "Tear down"
sudo docker compose -f docker-compose.base.yaml down --remove-orphans
