set -eo pipefail

# Install necessary packages
sudo apt update -y; sudo apt install build-essential awscli -y

# Build
make jenkins