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
//   const [items, setItems] = useState([]);
//     const [itemName, setItemName] = useState("");
//     const [quantity, setQuantity] = useState(0);
//     const [price, setPrice] = useState(0);

//     useEffect(() => {
//         axios.get('/api/inventory/items')
//             .then(response => setItems(response.data))
//             .catch(error => console.error("Error fetching data:", error));
//     }, []);

//     const addItem = () => {
//         axios.post('/api/inventory/add', { itemName, quantity, price })
//             .then(response => {
//                 setItems([...items, response.data]);
//                 setItemName('');
//                 setQuantity(0);
//                 setPrice(0);
//             });
//     };

    return (
        // <div>
        //     <h2>Inventory Items</h2>
        //     <ul>
        //         {items.map(item => (
        //             <li key={item.id}>{item.itemName} - Quantity: {item.quantity}</li>
        //         ))}
        //     </ul>
        //     <div>
        //         <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Item Name" />
        //         <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" />
        //         <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
        //         <button onClick={addItem}>Add Item</button>
        //     </div>
        // </div>
    //     <div className="App">
    //   <Navbar title="IMS" about="About"></Navbar>

    //   <Router>
    //     <Routes>
    //       <Route exact path="/" element={<Home />} />
    //       <Route path="/products" element={<Products />} />
    //       <Route path="/insertproduct" element={<InsertProduct />} />
    //       <Route path="/updateproduct/:id" element={<UpdateProduct />} />
    //       {/* <Route path="/about" element={<About />} /> */}

    //     </Routes>

    //   </Router>


    // </div>
    
        // <div className="App">
        //     <header className="App-header" style={{ height: '120px' }}>
        //         <h1>Inventory Management System</h1>
        //     </header>
        //     <InventoryManagement />
        // </div>

    //     <AuthProvider>
    //   <Router>
    //     <div>
    //       {/* Header or Navigation Bar (Optional) */}
    //       <Routes>
    //         {/* Public Routes */}
    //         <Route path="/signup" element={<SignUp />} />
    //         <Route path="/login" element={<LogIn />} />

    //         {/* Protected Route for Inventory Management */}
    //         <Route
    //           path="/inventory"
    //           element={
    //             <ProtectedRoute>
    //               <InventoryManagement />
    //             </ProtectedRoute>
    //           }
    //         />

    //         {/* LogOut Button */}
    //         <Route path="/logout" element={<LogOut />} />

    //         {/* Default Route */}
    //         <Route path="*" element={<Navigate to="/login" />} />
    //       </Routes>
    //     </div>
    //   </Router>
    // </AuthProvider>

    <Router>
      <div className="App">
        {/* <div className="auth-wrapper"> */}
          {/* <div className="auth-inner"> */}
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/register" /> : <Login />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              {/* <Route path="/profile" element={<Profile />} /> */}
              <Route path="/inventory" element={<InventoryManagement />} />
              
            </Routes>
            <ToastContainer />
          {/* </div> */}
        {/* </div> */}
      </div>
    </Router>
    
        
    );
}

export default App;
