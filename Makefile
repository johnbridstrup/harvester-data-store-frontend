DIR=$(shell pwd)
HDS_PORT := 8085
SHA = $(shell git rev-parse --short HEAD)
AWS_ACCOUNT_ID = 838860823423
AWS_REGION = us-west-1
HDS_URL = "https://hdsapi.cloud.advanced.farm"
FRONTEND_URL = "https://hds.cloud.advanced.farm"
NODE_ENV = "production"

_AFT_DEPLOY_TAG ?= $(SHA)

.PHONY: help jenkins

jenkins: login-ecr build-ecr push-ecr ## Build image and push to ECR

install-docker: ## Install docker and docker compose
	${DIR}/scripts/install_docker.sh

local: ## Run server against a local HDS build
	docker compose up -d --build

prod: ## Run server against production API and database
	docker compose -f docker-compose.production.yaml up -d --build

all-local: install-docker local ## Install docker and run against local HDS

all-prod: install-docker prod ## Install docker and run against prod

stop: ## Shut down the server
	docker compose down --remove-orphans

login-ecr: ## Login to ECR repository
	aws ecr get-login-password --region $(AWS_REGION) | sudo docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com

build-ecr: ## Build and tag image for push to ECR
	sudo docker build --build-arg HDS_URL=$(HDS_URL) \
	--build-arg FRONTEND_URL=$(FRONTEND_URL) \
	--build-arg NODE_ENV=$(NODE_ENV) \
	-t $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/hds:hds-frontend-$(_AFT_DEPLOY_TAG) .

push-ecr:
	sudo docker push $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/hds:hds-frontend-$(_AFT_DEPLOY_TAG)

help:
	@echo Use these commands for setting up docker environment outside of python virtual environment
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'