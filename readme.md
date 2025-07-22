# Natours API

This is a backend RESTful API project built using Node.js, Express.js, and MongoDB. It provides complete tour-related operations including user authentication, tour management, booking system, and role-based access control.

## Getting Started

### Installation

1. Clone the repository

git clone https://github.com/saileshmuvvala/Natours.git

2. Install dependencies  

npm install


3. Create a `.env` file and add required environment variables like:

- DATABASE=<your_mongo_connection_string>
- JWT_SECRET=your_jwt_secret
- JWT_EXPIRES_IN=90d


4. Run the app  

npm start


The server will start on `http://localhost:3000` or your configured port.

### Available Scripts

- `npm run start` – Runs the server in production mode  
- `npm run dev` – Runs the server in development mode using nodemon

## Features

- Tour CRUD APIs  
- User Signup, Login, Password Reset  
- Role-based Access Control (Admin, Guide, User)  
- MongoDB for data storage  
- Advanced filtering, sorting, pagination  
- Image uploading and processing using Multer & Sharp  

## Tech Stack

- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JavaScript  

---

