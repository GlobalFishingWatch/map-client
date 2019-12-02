#!/bin/bash
VARS='$BASIC_AUTH:$PORT'
envsubst "$VARS" < /etc/nginx/nginx.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'
