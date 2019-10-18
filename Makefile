.PHONY: test lint serve build up down destroy

up:
	docker-compose up -d

down:
	docker-compose down

destroy:
	docker-compose down
	docker rmi corsproxy
	docker rmi rtug

build:
	docker-compose build

test:
	npm run test:unit

lint:
	npm run lint

serve:
	npm run serve
