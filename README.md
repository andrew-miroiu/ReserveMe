# ReserveMe

ReserveMe is a full-stack web application for reserving spaces such as gym rooms and study rooms. It consists of a React frontend built with Vite and a Spring Boot backend API that integrates with Supabase for data storage and authentication.

## Features

- User authentication (login/signup) via Supabase
- View available spaces (gym rooms, study rooms)
- Create and manage space reservations
- View personal reservations
- Admin functionality to create and delete spaces

## Tech Stack

### Frontend
- React 18
- Vite (build tool)
- Supabase JS client for authentication and data

### Backend
- Spring Boot 3.2.0
- Java 17
- Maven (build tool)
- Supabase integration for database operations

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (version 16 or higher) - for the frontend
- **Java 17** - for the backend
- **Maven** (version 3.6 or higher) - for building the backend
- **Git** - for cloning the repository

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/andrew-miroiu/ReserveMe.git
   cd ReserveMe
   ```

2. Set up the backend:
   ```bash
   cd server
   # The dependencies are already configured in pom.xml
   ```

3. Set up the frontend:
   ```bash
   cd ../client
   npm install
   cd ..
   ```

## Configuration

The backend uses Supabase for data storage. The configuration is in `server/src/main/resources/application.properties`:

- `supabase.url`: Your Supabase project URL
- `supabase.service-key`: Service role key for server-side operations
- `supabase.anon-key`: Anonymous key for client-side operations

**Note:** The keys are already configured in the repository. In a production environment, use environment variables or secure key management.

## Running the Application

### Backend (Spring Boot Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Run the application:
   ```bash
   mvn spring-boot:run
   ```

   The server will start on `http://localhost:8080` by default.

### Frontend (React Client)

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   The client will be available at `http://localhost:5173` (default Vite port).

## API Endpoints

The backend provides the following REST API endpoints:

### Spaces

- **GET** `/api/spaces` - Retrieve all spaces
- **POST** `/api/spaces/create` - Create a new space
  - Request body: `CreateSpaceRequest` (name, type, capacity, location)
- **DELETE** `/api/spaces/{id}` - Delete a space by ID

### Reservations

- **POST** `/api/reservations/create` - Create a new reservation
  - Request body: `CreateReservationRequest` (userId, spaceId, startTime, endTime)
- **GET** `/api/reservations/by-date` - Get reservations for a specific space and date
  - Query parameters: `spaceId` (UUID), `date` (yyyy-MM-dd)
- **GET** `/api/reservations/my-reservations` - Get future reservations for a user
  - Query parameter: `userId` (UUID)

## Usage

1. Open the frontend at `http://localhost:5173`
2. Sign up or log in using Supabase authentication
3. Browse available spaces (Gym Rooms, Study Rooms)
4. Create reservations for desired time slots
5. View your reservations in the "My Reservations" section
6. Admins can create new spaces via the "Create Space" form

## Project Structure

```
ReserveMe/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── lib/            # Supabase client configuration
│   │   └── main.jsx        # Application entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Spring Boot backend
│   ├── src/main/java/com/example/demo/
│   │   ├── spaces/         # Space-related controllers and services
│   │   ├── reservation/    # Reservation-related controllers and services
│   │   └── config/         # Configuration classes
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── README.md
```

## Testing

The backend includes unit tests for services:

- `ReservationServiceTest.java`
- `ReservationsByDateRequestTest.java`

Run tests with:
```bash
cd server
mvn test
```

## Building for Production

### Frontend
```bash
cd client
npm run build
```

### Backend
```bash
cd server
mvn clean package
```

The built JAR will be in `server/target/`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on the GitHub repository.