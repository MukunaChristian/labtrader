Install node:
cd ~
sudo apt update
sudo apt upgrade
sudo apt install curl software-properties-common
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs

Verify Installation:
node -v
npm -v

Install packages:
npm install

Run:
npm run dev
