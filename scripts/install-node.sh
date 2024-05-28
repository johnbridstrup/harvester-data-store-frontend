#!/bin/bash

set -euo pipefail

INSTALL_NODE_VER=20.11.1
INSTALL_NVM_VER=0.39.7

echo "==> Ensuring .bashrc exists and is writable"
touch ~/.bashrc

echo "==> Installing Node Version Manager (NVM). Version $INSTALL_NVM_VER"
rm -rf ~/.nvm

if ! command -v curl &> /dev/null; then
	echo "Curl is not installed. Please install curl"
	exit 1
fi

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v$INSTALL_NVM_VER/install.sh | bash

# To use it, you must first source your .bashrc file
. ~/.bashrc

# Make nvm command available to terminal
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
source "$NVM_DIR/bash_completion"

echo "==> Installing Node.js version $INSTALL_NODE_VER"
nvm install $INSTALL_NODE_VER

echo "==> Setting Node.js version $NVM_DIR as default"
nvm use $INSTALL_NODE_VER

echo "==> Checking for versions"
nvm --version
node --version
npm --version

echo "==> Print binary paths"
which npm
which node

echo "==> List installed Node.js versions"
nvm ls

echo "==> Now you're all setup and ready for development."