#!/bin/sh

# Exit immediately if any sub-command fails
set -e

# Only include the JS packages required to run the app in the deployment package
rm -rf node_modules
npm install --production

# Create the deployment package
zip -rq ri-web-services * -x ".git/*" -x ".idea/*" -x "coverage/*" -x "scripts/*"  -x "*.ts" -x "*.js.map" -x "**/*.ts" -x "**/*.js.map"