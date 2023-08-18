DIR=$(shell pwd)
HDS_PORT := 8085

.PHONY: help

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

help:
	@echo Use these commands for setting up docker environment outside of python virtual environment
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'