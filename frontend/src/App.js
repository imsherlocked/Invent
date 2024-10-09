import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import InventoryManagement from './components/InventoryManagement'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./components/login";
import SignUp from "./components/register";
import {ToastContainer} from "react-toastify"
import { auth } from "./components/firebaseConfig";


function App() {
    const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });

    return (
    <Router>
      <div className="App">
       
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/login" /> : <Login />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/inventory" element={<InventoryManagement />} />
              
            </Routes>
            <ToastContainer />
         
      </div>
    </Router>
    
        
    );
}

export default App;
