# This file is a template, and might need editing before it works on your project.
FROM nginx:1.16-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html