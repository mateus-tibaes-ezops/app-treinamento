# Training App - Frontend & Backend

A simple CRUD application with a CDN-ready frontend and a Node.js/Express backend with MySQL database.

## Project Structure

```
app-treinamento/
├── frontend/          # Static frontend files (CDN-ready)
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── backend/           # Node.js backend server
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   ├── .dockerignore
│   └── env.template
├── docker-compose.yml # Docker Compose configuration
└── README.md
```

## Features

- **Frontend**: Pure HTML/CSS/JavaScript that can be served from any CDN
- **Backend**: RESTful API with Express.js
- **Database**: MySQL with automatic table creation
- **CRUD Operations**: Create, Read, Update, Delete records

## Prerequisites

### Option 1: Docker (Recommended)
- Docker Desktop or Docker Engine
- Docker Compose

### Option 2: Manual Setup
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

## Setup Instructions

### Quick Start with Docker Compose (Recommended)

1. Make sure Docker and Docker Compose are installed and running

2. Start all services:
   ```bash
   docker-compose up -d
   ```

3. View logs:
   ```bash
   docker-compose logs -f
   ```

4. Stop services:
   ```bash
   docker-compose down
   ```

5. Stop and remove volumes (clears database):
   ```bash
   docker-compose down -v
   ```

All services will be available at:
- **Frontend**: `http://localhost` (port 80)
- **Backend API**: `http://localhost:3000`
- **MySQL**: `localhost:3306`

**Default Docker credentials:**
- MySQL Root Password: `rootpassword`
- Database: `training_app`

### Manual Setup

#### 1. Database Setup

1. Install and start MySQL server
2. Create a database user (or use root)
3. Note your MySQL credentials (host, user, password)

#### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=training_app
   PORT=3000
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000`

### 3. Frontend Setup

When using Docker Compose, the frontend is automatically included and served on port 80.

#### Option A: Using Docker (Recommended)

The frontend is automatically served when you run `docker-compose up`. Just open `http://localhost` in your browser.

#### Option B: Standalone Development

1. Open `frontend/index.html` in a web browser
2. Or use a simple HTTP server:
   ```bash
   # Using Python
   cd frontend
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server frontend -p 8000
   ```

3. The frontend will automatically detect the backend URL

#### Option C: Deploy to CDN

1. Upload the `frontend/` folder contents to your CDN (e.g., Cloudflare, AWS CloudFront, etc.)
2. Update `API_BASE_URL` in `frontend/app.js` to point to your backend API URL
3. Access your app via the CDN URL

## API Endpoints

- `GET /api/records` - Get all records
- `GET /api/records/:id` - Get a single record
- `POST /api/records` - Create a new record
- `PUT /api/records/:id` - Update a record
- `DELETE /api/records/:id` - Delete a record
- `GET /api/health` - Health check

## Usage

1. Start the backend server
2. Open the frontend in a browser
3. Add records using the form
4. Edit or delete records using the buttons on each record card

## Database Schema

The application automatically creates a `records` table with the following structure:

- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR(255), NOT NULL)
- `email` (VARCHAR(255), NOT NULL)
- `description` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Troubleshooting

- **Connection Error**: Make sure MySQL is running and credentials in `.env` are correct
- **CORS Error**: The backend includes CORS middleware, but ensure the frontend URL matches
- **Port Already in Use**: Change the PORT in `.env` file

## License

ISC

test new PR
# app-treinamento
