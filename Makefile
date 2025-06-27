install:
	npm install

lint:
	npm run lint

format:
	npm run format

test:
	npm test

test-cov:
	npm run test:cov

build:
	npm run build

start:
	npm run start

start-dev:
	npm run start:dev

migration-generate:
	npx ts-node ./node_modules/typeorm/cli.js migration:generate ./migrations/Init$$(date +%s) -d data-source.ts

migration-run:
	npx ts-node ./node_modules/typeorm/cli.js migration:run -d data-source.ts

migration-revert:
	npx ts-node ./node_modules/typeorm/cli.js migration:revert -d data-source.ts

docker-up:
	docker-compose up -d --build

docker-down:
	docker-compose down

openapi-export:
	npx nestjs/swagger-cli generate -o docs/openapi.json src/main.ts 