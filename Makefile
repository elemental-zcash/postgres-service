build.config:
	bash setup.sh

init:
	make build.config

build:
	docker compose build

start:
	docker compose -f docker-compose.yml up -d

stop:
	docker compose down
