#!/usr/bin/env bash

env=$1
port=8702
if [ ${env} == "dev" ]; then
    port=8701
elif [ ${env} == "prod" ]; then
    port=8702
elif [ ${env} == "test" ]; then
    port=8703
fi

# build in docker ?
docker build -t zoe-optimus-mob-web-${env} .
docker stop zoe-optimus-mob-web-${env} 2> /dev/null
docker rm zoe-optimus-mob-web-${env} 2> /dev/null
docker run --name zoe-optimus-mob-web-${env} -d -p ${port}:3001 zoe-optimus-mob-web-${env} npm start

exit 0
