#!/bin/bash
cd /var/www/code/escrow-microservice
poetry run python manage.py runserver 0.0.0.0:8007

