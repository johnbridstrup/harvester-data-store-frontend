set -eo pipefail

# Install Terraform
./scripts/install-terraform.sh

pushd terraform

if [ -n "$_AFT_DEPLOY_TAG"]; then
    export TF_VAR_deploy_tag=$(git rev-parse --short HEAD)
else
    export TF_VAR_deploy_tag=$_AFT_DEPLOY_TAG
fi

terraform init -upgrade
terraform plan -out apply.tfplan
