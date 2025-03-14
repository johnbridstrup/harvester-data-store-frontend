echo "" && echo "Installing Docker"
sudo apt update -y
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    prometheus

if [ ! -f "/usr/share/keyrings/docker-archive-keyring.gpg" ]
then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
        sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo \
    "deb [arch=$(dpkg --print-architecture) \
        signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
        https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt update -y
fi

sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo groupadd docker || true
sudo usermod -aG docker $USER