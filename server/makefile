DEV_ENV_FILE ?= .env.dev
DC_DEV ?= docker-compose --env-file $(DEV_ENV_FILE)

# LOCAL_ENV_FILE ?= .env.local-dev
# DC_LOCAL ?= docker-compose --env-file $(LOCAL_ENV_FILE)

# Start a full backend and database stack for front-end development
stack-up:
	$(DC_DEV) up -d

# Command for stop every thing
stack-down:
	$(DC_DEV) down

build-be:
	$(DC_DEV) build backend

# # Start only database for back-end development
# start-db:
# 	$(DC_LOCAL) up -d mysql
