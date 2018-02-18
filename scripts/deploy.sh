#!/bin/sh

# Exit immediately if any sub-command fails
set -e

# Get the name of the server to which the deployment should occur.
server="$1"
if [ -z "$server" ]
then
   echo "Server name is required to run this script."
   exit 0
fi

# Get the release of the application to deploy.
release="$2"
if [ -z "${release}" ]
then
   release=""
   releaseFolder=""
else
   releaseFolder="${release}/"
fi


ssh  -i "/home/local/DCI/ch-ci-admin/.ssh/id_rsa" "dci\ch-ci-admin@${server}" "rm -rf /ri/${releaseFolder}ri-web-services/*"
rsync -e "ssh -i /home/local/DCI/ch-ci-admin/.ssh/id_rsa" -avz "./ri-web-services.zip"  "dci\ch-ci-admin@${server}:/ri/${releaseFolder}ri-web-services"
ssh  -i "/home/local/DCI/ch-ci-admin/.ssh/id_rsa" "dci\ch-ci-admin@${server}" "cd /ri/${releaseFolder}ri-web-services; unzip -o ri-web-services.zip; pm2 restart ri-web-services${release}"