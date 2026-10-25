StudyFlow – Student Assignment Tracker

StudyFlow is a MERN-stack web application that helps students organize assignments, manage deadlines, and track academic progress.

Features

- Dashboard with assignment statistics
- Add assignments with subject, deadline, priority, and description
- Edit and delete assignments
- Mark assignments as completed
- Search and filter assignments
- Deadline notifications for overdue and upcoming work
- Analytics with subject-wise completion progress

Tech Stack

- MongoDB Atlas – Database
- Express.js – Backend API
- React.js – Frontend
- Node.js – Server
- CSS – Styling
- Vite – Frontend development tool

Project Structure

- "client/" – React frontend
- "server/" – Express backend and MongoDB model
- "README.md" – Project documentation

Run Locally

1. Start the backend

Open a terminal:

cd server
npm install

Create a "server/.env" file containing your own configuration:

MONGO_URI=your_mongodb_connection_string
PORT=5000

Replace the placeholder with your MongoDB Atlas connection string. Never upload your real ".env" file.

Start the backend:

node server.js

2. Start the frontend

Open a second terminal:

cd client
npm install
npm run dev

Open the local URL shown in the terminal, usually "http://localhost:5173".

API Endpoints

Method| Endpoint| Purpose
GET| "/api/assignments"| Get assignments
POST| "/api/assignments"| Create an assignment
PUT| "/api/assignments/:id"| Update an assignment
DELETE| "/api/assignments/:id"| Delete an assignment

Future Improvements

- User authentication
- Personalized student dashboards
- Improved reminders and reporting

---

Created as a student project to practice full-stack web development using the MERN stack.