# Challenge

## Description

This app allows users to register and login with a username and password. Once logged in, users have access to their dashboard at `/[username]` where they can create new documents or view/edit documents they have access to. Users can add collaborators to documents. Document and user-specific routes are protected using JWTs and `next-auth` for session management. The database is a Dockerized PostgresQL instance. `prisma` is being used for schemas and database access.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

### Clone the Repository

```sh
git clone https://github.com/zacharyarney/stealth_2024.git
cd stealth_2024
```

### Build and run the docker container
```sh
docker compose up
```

The app should be available at `http://localhost:3000`
