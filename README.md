# H2R API

This is an API built with **Express** and **TypeScript** using **TypeORM** for database management.

## Table of Contents

- [Prerequisites](#prerequisites)

- [Setup](#setup)

- [Environment Variables](#environment-variables)

- [Running the Project](#running-the-project)

- [Project Structure](#project-structure)

- [Technologies Used](#technologies-used)

- [API Documentation](#api-documentation)

- [Socket.IO Integration](#socketio-integration)

- [Testing](#testing)

- [Contributing](#contributing)

- [License](#license)

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



# JWT configuration

JWT_SECRET=your_jwt_secret_key

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

## Environment Variables

Ensure you have configured the `.env` file with the necessary environment variables as shown above.

## Running the Project

- **Development Mode**:

```bash

# Start the server in development mode

npm run dev

```

- **Build for Production**:

```bash

# Compile TypeScript and prepare for production

npm run build

```

- **Start Production Server**:

```bash

# Start the server using the compiled JavaScript files

npm start

```

- **Using Docker**:

```bash

# Run the application using Docker Compose

docker-compose up -d

```

## Project Structure

```

/src

/controllers # Business logic for the application

/middleware # Express middleware functions

/routes # API route definitions

/schemas # TypeORM entities

app.ts # Main application entry point

data-source.ts # Database connection configuration

```

## Technologies Used

- **[Express](https://expressjs.com/)**: Web framework for building server-side applications.

- **[TypeScript](https://www.typescriptlang.org/)**: Provides type safety and advanced tooling for JavaScript.

- **[TypeORM](https://typeorm.io/)**: ORM for managing database interactions in TypeScript/JavaScript.

- **[MySQL](https://dev.mysql.com/doc/)**: Relational database management system.

- **[Docker](https://docs.docker.com/)**: Containerization platform to package and run applications.

- **[Socket.IO](https://socket.io/)**: Real-time, bidirectional and event-based communication.

## API Documentation

The API provides endpoints for user management, leave requests, notifications, and timesheets. Below is a brief overview:

- **User Management**

- `POST /user/create`: Create a new user.

- `GET /user/`: Retrieve all users (Admin only).

- **Leave Management**

- `POST /leave/create`: Create a new leave request.

- `GET /leave/`: Retrieve all leave requests (HR/Admin only).

## Socket.IO Integration

The application uses Socket.IO for real-time communication. It supports events such as:

- **join**: User joins the socket connection.

- **leaveApproved**: Notification for leave approval.

- **leaveRejected**: Notification for leave rejection.

- **timesheetApproved**: Notification for timesheet approval.

## Testing

To run the tests, execute:

```bash

npm test

```

Ensure that you have the necessary test environment variables set up in your `.env` file.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.

## License

This project is licensed under the ISC License. See the `LICENSE` file for more details.
