//inport Dependecies
import React, { useEffect, useState } from 'react';
import '../styles/style.css'
import axios from 'axios';
import { BsArrowLeft, BsArrowRight, BsBagPlus, BsBarChart, BsBodyText, BsList, BsMenuButton, BsPencilSquare, BsTrash2, BsTrash3, } from "react-icons/bs";
import { Bar, Pie, Line, Doughnut, Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    RadialLinearScale,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement, // Register ArcElement for Pie chart
    PointElement, // Register PointElement for Line chart
    LineElement, // Register LineElement for Line chart
    RadialLinearScale,
);

function InventoryManagement() {
    // UseStates 
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [total, setTotal] = useState(0);
    const [editingItemId, setEditingItemId] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    useEffect(() => {
        
        fetchItems();
   
    }, []);

  
    // Fetch Items : GET call
    const fetchItems = async () => {
        try {
            console.log("Inside ftech");
           
            const response = await axios.get(`https://invent-backend-ytde.onrender.com/api/inventory/items`);
            console.log(response);
            setItems(response.data);
            console.log("Items set")
            alert("Displayed all items")
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    // add Item : POST call
    const addItem = async () => {
        console.log("Inside addItem");
        try {
            if (quantity === '' || price === '') {
                alert('Please fill in all fields.');
                return;
            }

    
            const newItem = {
                name: itemName,
                quantity,
                price,
                total: price*quantity
            };
    
            if (itemName) {
                // Check if an item with the same name already exists
                const existingItemResponse = await axios.get(`https://invent-backend-ytde.onrender.com/api/inventory/items`);
                const existingItem = existingItemResponse.data.find(item => item.name === itemName);
               
                if (existingItem) {
                    // If editing, update based on conditions for negative or positive quantity
                    if (editingItemId) {
                        existingItem.price=price;
                        if (parseInt(existingItem.quantity)+ parseInt(quantity) < 0) {
                            // Only allow subtraction if current stock is greater than input value
                            if (parseInt(existingItem.quantity)+parseInt(quantity) >= 0) {
                                existingItem.quantity=parseInt(existingItem.quantity)+parseInt(quantity);
                            } else {
                                alert('Cannot subtract more than the current stock.');
                                return;
                            }
                        } else {
                            // Add the positive quantity to the existing stock
                            existingItem.quantity = parseInt(existingItem.quantity)+parseInt(quantity);
                        }
                        // Update the item
                        const response = await axios.put(`https://invent-backend-ytde.onrender.com/api/inventory/update/${existingItem._id}`, existingItem);
                        setItems(items.map(item => (item._id === existingItem._id ? response.data : item)));
                        setEditingItemId(null);
                    } else {
                        // If not editing but item already exists, show alert
                        alert('Item already exists. Updating the existing item.');
                        existingItem.quantity = parseInt(existingItem.quantity)+parseInt(quantity);
                        const response = await axios.put(`https://invent-backend-ytde.onrender.com/api/inventory/update/${existingItem._id}`, existingItem);
                        setItems(items.map(item => (item._id === existingItem._id ? response.data : item)));
                    }
                } else {
                    if (quantity < 0 || price < 0) {
                        alert('Quantity and price must be non-negative.');
                        return;
                    }
                    // If item doesn't exist, add new item
                    try {
                        const response = await axios.post('https://invent-backend-ytde.onrender.com/api/inventory/add', newItem);
                    
                        // Check if response status is 200 (indicating success)
                        if (response.status === 200) {
                            alert("Database added successfully");
                            setItems([...items, response.data]);
                            fetchItems();
                        } else {
                            // If response is not 200, handle it as an error (though this case is rare)
                            alert("Error in adding data");
                        }
                    } catch (error) {
                        // Handle error responses from the server (e.g., 4xx, 5xx)
                        alert("Error in adding item");
                        console.error("Error in adding item:", error);
                        
                        // Use error.response to access the status code
                        if (error.response) {
                            alert(`Error in adding data: ${error.response.status} - ${error.response.data.error || "Unknown Error"}`);
                        } else {
                            // Handle network errors or issues that prevented the request from completing
                            alert("Network error: Unable to add item. Please check your connection.");
                        }
                    }                    
                    
                }
            }
    
            // Clear form fields
            setItemName("");
            setQuantity(0);
            setPrice(0);
        } catch (error) {
            alert("Error adding/updating item");
            console.error("Error adding/updating item:", error);
        }
    };

    //delete item : DELETE call
    const deleteItem = async (id) => {
        try {
            await axios.delete(`https://invent-backend-ytde.onrender.com/api/inventory/delete/${id}`);
            setItems(items.filter(item => item._id !== id));
            alert("Item deleted successfully")
        } catch (error) {
             alert("Error deleting item");
            console.error("Error deleting item:", error);
        }
    };

    // archive item : POST, DELETE call
    const archieveItem=async(id) => {
        try{
            await axios.post(`http://localhost:5000/api/inventory/archive/${id}`);
            await axios.delete(`http://localhost:5000/api/inventory/delete/${id}`);
            setItems(items.filter(item => item._id !== id));
            alert("Item has been archived successfully");
            console.log('Item archived and deleted successfully');
        }catch(error){
             alert("Error in archiving data");
            console.error("Error archiving item:", error);
        }
    };

    // State Updates on Data change
    const editItem = (item) => {
        setItemName(item.name);
        setQuantity(item.quantity);
        setPrice(item.price);
        setEditingItemId(item._id);
    };

    // Prepare data for the Chart
    const chartData = {
        labels: items.map(item => item.name),
        datasets: [
            {
                label: 'Quantity',
                data: items.map(item => item.quantity),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const valueChartData = {
        labels: items.map(item => item.name),
        datasets: [
            {
                label: 'Total Value ($)',
                data: items.map(item => item.quantity * item.price),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const categoryDistributionData = {
        labels: items.map(item => item.name),
        datasets: [
            {
                label: 'Inventory Distribution',
                data: items.map(item => item.quantity),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const distributionChartData = {
        labels: items.map(item => item.name),
        datasets: [
            {
                label: 'Inventory Distribution',
                data: items.map(item => item.quantity),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const doughnutChartData = {
        ...distributionChartData,
    };

    // Radar Chart: Comparison by Item Type
    const radarChartData = {
        labels: items.map(item => item.name),
        datasets: [
            {
                label: 'Quantity by Item Type',
                data: items.map(item => item.quantity),
                backgroundColor: 'rgba(255, 99, 132, 0.4)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const showTab = (tabName) => {
        setActiveTab(tabName);
        if (isSidebarOpen) {
            setIsSidebarOpen(false); // Close sidebar when switching tabs on smaller screens
        }
    };

    return (
        <div className="container-fluid">


            {/* Burger Icon for Mobile and Tablet */}
            <div className="burger-icon" onClick={toggleSidebar}>
                <BsList />
            </div>

            {/* <div className="row"> */}
                {/* Sidebar Navbar */}
                <div className={`sidebar ${isSidebarOpen ? 'open' : ''} col-md-2 bg-dark text-white p-3`}>
                    <h3>Inventory System</h3>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <BsBarChart style={{ width: '1em' }} /><button className="nav-link btn btn-link text-white" onClick={() => showTab('dashboard')}>Dashboard</button>
                        </li>
                        <li className="nav-item">
                            <BsBagPlus style={{ width: '1em' }} /><button className="nav-link btn btn-link text-white" onClick={() => showTab('inventory')}>Inventory</button>
                        </li>
                        <li className="nav-item">
                             <BsBodyText style={{ width: '1em' }} /><button className="nav-link btn btn-link text-white" onClick={() => showTab('instructions')}>Instructions</button>
                        </li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="col-md-10 main-content p-4">
                    {activeTab === 'dashboard' && (
                        <div className="dashboard">
                            <h2 className="text-center">Dashboard</h2>
                            <div className="chart-container mb-5">
                                <Bar data={chartData} />
                            </div>
                            <div className="chart-container mb-5">
                                <Line data={valueChartData} />
                            </div>
                            <div className="chart-container mb-5">
                                <Pie data={categoryDistributionData} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div className="inventory container">
                            <h2 className="text-center">{editingItemId ? "Edit Item" : "Add New Item"}</h2>
                            <div className="mb-4">
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={itemName}
                                            onChange={(e) => setItemName(e.target.value)}
                                            placeholder="Item Name"
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            placeholder="Quantity"
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="Price"
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <button className={`btn ${editingItemId ? ' btn-warning' : 'btn btn-success'} w-100`} onClick={addItem}>
                                            {editingItemId ? "Update Item" : "Add Item"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <h4 className="mb-3 text-center">Inventory Items</h4>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-hover">
                                    <thead className="table-primary">
                                        <tr>
                                            <th>Item Name</th>
                                            <th>Quantity</th>
                                            <th>Price ($)</th>
                                            <th>Total ($)</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map(item => (
                                            <tr key={item._id}>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.price.toFixed(2)}</td>
                                                <td>{(item.quantity * item.price).toFixed(2)}</td>
                                                 <td style={{ display: "flex" }}>
                                                    <button className="btn btn-warning btn-sm me-2" onClick={() => editItem(item)}>
                                                        Edit
                                                    </button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item._id)}>
                                                        Delete
                                                    </button>
                                                     <button className="btn btn-success btn-sm" onClick={() => archieveItem(item._id)}>
                                                        Archive
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'instructions' && (
                        <div className="instructions">
                            <h2 className="text-center">Instructions</h2>
                            <p>Welcome to the Inventory Management System! Here’s how to use it:</p>
                            <ul>
                                <li>Navigate to the Dashboard tab to view inventory visualizations.</li>
                                <li>Go to the Inventory tab to add new items or view/edit existing items.</li>
                                <li>Use the instructions to learn how to operate the system effectively.</li>
                            </ul>
                        </div>
                    )}
                </div>
            {/* </div> */}
        </div>
    );
}

export default InventoryManagement;



