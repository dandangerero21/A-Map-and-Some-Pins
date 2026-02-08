# Map Practice

### WORK IN PROGRESS

A full-stack web application in development that aims to combine user authentication with an interactive map interface. Users will be able to create accounts, log in, and place pins on a map with custom titles and descriptions.

## Project Goal

The goal of this project is to eventually create a website that enables users to:
- **Sign up and log in** securely
- **Place pins on a map** with custom information
- **Attach metadata to pins** including title, description, and images
- **Manage their own pins** with full CRUD operations

## Current Status

This project is still in early development. Below is what's currently being worked on:

### Implemented
- Backend API structure with Spring Boot
- User model, controller, and basic endpoints (WIP)
- Pin model and controller (recently fixed)
- DTO layer for data transfer
- User authentication and login flow
- Pin creation and management UI
- Frontend map interface integration
- Pin CRUD operations refinement
- Image upload functionality
- Comment feature

### In Progress / To Do
- Testing and bug fixes
- Enhancement of implemented features

## Tech Stack

### Backend
- **Spring Boot** - Java backend framework
- **Spring Data JPA** - Database ORM
- **MySQL** - Database (Currently in H2 Database, but can modified easily into MySQL)
- **Maven** - Build tool

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** (or your styling solution)

## Project Structure

```
Map Practice/
├── backend/          # Spring Boot REST API
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/         # React + TypeScript application
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- npm or yarn
- MySQL

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure your database in `application.properties`

3. Build and run:
   ```bash
   mvn spring-boot:run
   ```

The API will be available at `http://localhost:8080`

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## API Endpoints

### Users
- `POST /users/signup` - Create a new user
- `POST /users/login` - Authenticate user
- `GET /users/{id}` - Get user details
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Pins
- `POST /pins/create` - Create a new pin
- `GET /pins` - Get all pins
- `GET /pins/{id}` - Get pin by ID
- `GET /pins/user/{userId}` - Get all pins for a user
- `PUT /pins/{id}` - Update a pin
- `DELETE /pins/{id}` - Delete a pin

## Future Enhancements

- [ ] Real-time collaboration features
- [ ] Pin categories and filtering
- [ ] User profile customization
- [ ] Advanced map features (clustering, heatmaps)

## Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

## License

This project is open source and available under the MIT License.
