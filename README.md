
Inventory Management System

### Demo Link: https://invent-frontend.onrender.com


### Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Architecture Overview](#architecture-overview)
- [Docker Setup](#docker-setup-optional)
- [Contribution Guidelines](#contribution-guidelines)

---

### Introduction

The Inventory Management System is a full-stack web application that allows users to manage inventory items. It provides CRUD operations (Create, Read, Update, Delete) for items, using a **Node.js/Express backend** and a **React frontend**.

### Features

- Add, update, delete inventory items.
- View inventory items with pagination.
- Connects to a MongoDB database as primary datavase and dynamoDB as secondary database for data storage.
- RESTful API with a frontend client.

### Project Structure

```bash 
/your-project-root
│
├── /backend
│   ├── server.js               # Entry point for the backend server
│   ├── package.json            # Backend dependencies
│
├── /frontend
│   ├── /src
│   │   ├── index.js            # Entry point for React app
│   │   ├── App.js              # Main React component
│   │   ├── /components         # Individual UI components
│   │   ├── /utils              # Utility functions (API integration)
│   ├── package.json            # Frontend dependencies 
│
├── docker-compose.yml          # Docker Compose file to run both frontend and backend
├── README.md                   # Documentation
└── .gitignore                  # Ignored files and folders

```

#### Prerequisites
- **Node.js** (v14 or higher)
- **npm** 
- **MongoDB** (local or cloud instance)
- **AWS** 
- **Firebase** 
- **Git**

**Cloning the Repository**

``` bash
git clone https://github.com/imsherlocked/Invent.git
```

**Backend Setup**
Navigate to the Backend Folder:

```bash
cd backend
```
### Installation

**Install Dependencies:**
```
npm install
```

**Set Up Environment Variables:**
```
PORT=5000
DATABASE_UR (Local)=mongodb://localhost:27017/inventory


DATABASE_URL (Cloud) = mongodb+srv://yourUsername:yourPassword@cluster0.mongodb.net/yourDatabase?retryWrites=true


```

**Start the Backend Server:**
```
node server.js
The backend server should now be running on http://localhost:5000.
```

**Frontend Setup**
Navigate to the Frontend Folder:
```
cd ../frontend
```

Install Dependencies:
```
npm install
REACT_APP_API_URL=http://localhost:5000/api
```

**Start the Frontend Development Server:**
```
npm start
The frontend should now be running on http://localhost:3000.
```

### Running the Application
```
Backend: http://localhost:5000
Frontend: http://localhost:3000
Navigate to http://localhost:3000 in your browser to start using the inventory management system.
```

### API Documentation

**Base URL**
```
http://localhost:5000/api/inventory
```

**Endpoints**

Add Item
POST /add
```
Description: Adds a new inventory item.
Request Body:
json
Copy code
{
  "name": "Item Name",
  "quantity": 10,
  "price": 20.5
}
Response: Returns the created item.
```

Get Items
GET /items
```
Description: Fetches inventory items with pagination.
Response: Returns a list of inventory items.
```

Update Item
PUT /update/:id
```
Description: Updates an existing inventory item.
Request Params: id of the item to be updated.
Request Body:
json
Copy code
{
  "name": "Updated Item Name",
  "quantity": 15,
  "price": 25.0
}
Response: Returns the updated item.
```

Delete Item
DELETE /delete/:id
```
Description: Deletes an inventory item by its ID.
Request Params: id of the item to be deleted.
Response: Confirmation message of item deletion.

```

### Architecture Overview
```
Frontend:

Built using React.
Handles user interactions and communicates with the backend using REST API calls.
Pages are built using individual components such as inventory tables, forms, and buttons.
Backend:

Developed with Node.js and Express.
Contains routes to handle incoming HTTP requests and controllers to process business logic.
Uses MongoDB as the database to store inventory information. The connection is configured in the backend/config folder.
Database:

MongoDB is used for data persistence.
Mongoose ORM is used to model the data structure and interact with MongoDB.
API Communication:

The frontend communicates with the backend using RESTful APIs.
Backend serves the data requested by the frontend and processes CRUD operations on the MongoDB database.
```

### Docker Setup (Optional)
If you have Docker installed, you can use docker-compose to run both frontend and backend services easily.

Build and Run Services:
```
docker-compose up --build
```
Frontend will run on http://localhost:3000.
Backend will run on http://localhost:5000.

**Contribution Guidelines**
If you would like to contribute, please:

### Fork the repository.
```
Create a new branch (git checkout -b feature-branch).
Commit your changes (git commit -m "Add a feature").
Push to the branch (git push origin feature-branch).
Open a pull request.
```
