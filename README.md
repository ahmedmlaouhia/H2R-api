# H2R API

This is an API built with **Express** and **TypeScript** using **TypeORM** for database management.

## Prerequisites

- Node.js v20+
- Docker

## Setup

1. Clone the repository and navigate into the project directory.

```bash
# Run this command to clone the repository and navigate into it
git clone <repository-url>
cd <repository-directory>
```

2. Install dependencies:

```bash
# Run this command to install the required dependencies
npm install
```

3. Create a `.env` file with the following content:

```env
# Server port configuration
PORT=3000

# Database connection details
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=h2r@123456
DB_NAME=h2r
```

4. Run Docker for MySQL with this command:

```bash
# Use this command to start MySQL using Docker
docker-compose --project-name mysql up -d
```

5. Start the development server:

```bash
# Run this command to start the server in development mode
npm run dev
```

6. Build the project:

```bash
# Run this command to compile the TypeScript code to JavaScript
npm run build
```

## Scripts

- `dev`: Starts the server in development mode with `ts-node`.
- `build`: Compiles the TypeScript code to JavaScript.
- `start`: Runs the compiled JavaScript in production.

## Technologies Used

- **Express**: Web framework
- **TypeScript**: Type safety
- **TypeORM**: ORM for database management
- **MySQL**: Database
- **Docker**: Containerization
