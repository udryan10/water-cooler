#!/bin/bash

docker pull udryan10/water-cooler
docker kill water-cooler
docker rm water-cooler
docker run -d --name "water-cooler" -p 8058:80 udryan10/water-cooler
