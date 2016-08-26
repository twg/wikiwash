echo "Starting box provision"

#update the system 1st
apt-get update
apt-get -y upgrade

#essential tools gcc, make,etc
apt-get install -y build-essential
apt-get install -y git

#install node JS
apt-get -y install nodejs
apt-get -y install npm

#required to run wikiwash
# move to shared folder as we need the package.json
cd /vagrant
npm install
bower install

echo 'done w/provision!'
