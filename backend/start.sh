#!/bin/bash
cd /var/www/code/trustwork-backend
uvicorn core.asgi:application --host 0.0.0.0 --port 8008
