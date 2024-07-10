APP = axe-backend

.PHONY: dev
dev:
	air

.PHONY: build
build:
	go build -ldflags "-X main.Environment=production" -o ./bin/$(APP) ./cmd
