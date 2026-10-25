StudyFlow – Student Assignment Tracker

StudyFlow is a web-based Student Assignment Tracker built using the MERN stack. It helps students organize assignments, manage deadlines, monitor completion status, and track academic progress in one place.

Features

- Dashboard with total, pending, completed, and overdue assignments
- Add assignments with title, subject, deadline, priority, and description
- View, edit, and delete assignments
- Mark assignments as completed
- Search assignments by title or subject
- Filter assignments by completion status
- Deadline notifications for overdue and upcoming assignments
- Analytics with completion percentages and subject-wise progress
- MongoDB Atlas database integration

Technologies Used

- MongoDB Atlas – database
- Express.js – backend API
- React.js – frontend interface
- Node.js – backend runtime
- CSS – styling
- Vite – frontend development server

Project Structure

StudyFlow-MERN/
├── client/
│   └── src/
│       ├── App.jsx
│       └── App.css
├── server/
│   ├── models/
│   │   └── Assignment.js
│   ├── server.js
│   └── .env
└── README.md

How to Run the Project

Prerequisites

Install Node.js and npm, and configure a MongoDB Atlas database.

1. Start the backend

Open a terminal in VS Code and run:

cd server
npm install

Create "server/.env" with your MongoDB connection string:

MONGO_URI=your_mongodb_connection_string
PORT=5000

Replace the placeholder with your actual connection string. Do not publish your database password or ".env" file.

Start the backend:

node server.js

2. Start the frontend

Open a second terminal:

cd client
npm install
npm run dev

Open the local URL printed by Vite, usually "http://localhost:5173".

API Endpoints

Method| Endpoint| Purpose
GET| "/api/health"| Check backend status
GET| "/api/assignments"| Retrieve assignments
POST| "/api/assignments"| Create an assignment
PUT| "/api/assignments/:id"| Update an assignment
DELETE| "/api/assignments/:id"| Delete an assignment

Future Enhancements

- Student login and authentication
- Calendar view
- Email or browser notifications
- Downloadable assignment reports

Author

Student project developed for learning full-stack web development.