build.config:
	cd setup && node index.js

build:
	docker compose build

start:
	docker compose -f docker-compose.yml up -d

stop:
	docker compose down
