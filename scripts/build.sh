#!/bin/sh

# Exit immediately if any sub-command fails
set -e

npm install

# Compile the TypeScript files
npm run compile