// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const AWS = require('aws-sdk'); 
const cors = require('cors');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Inventory Item Schema
const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
});

const Item = mongoose.model('Item', itemSchema);

// AWS DynamoDB Configuration
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'inventorydbsecondary'; // DynamoDB Table Name for backup
const ARCHIVE_TABLE_NAME = 'archivedb'; // DynamoDB Table Name for archive


// CRUD Routes

//GET : fetch items from the database
app.get('/api/inventory/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching items.' });
    }
});

//POST: add item to the database
app.post('/api/inventory/add', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();

        try {
            const dynamoParams = {
                TableName: TABLE_NAME,
                Item: {
                    id: newItem._id.toString(),
                    name: newItem.name,
                    quantity: newItem.quantity,
                    price: newItem.price
                }
            };
            await dynamoDB.put(dynamoParams).promise();
        } catch (dynamoError) {
            console.error('Error adding item to DynamoDB:', dynamoError);
            await Item.findByIdAndDelete(newItem._id);
            alert("Database issue please re-enter your entry");
            
        }

        res.json(newItem);
    } catch (error) {
        console.error('Error adding item to MongoDB:', error);
        res.status(500).json({ error: 'An error occurred while adding the item.' });
    }
});

//PUT: Update the item if item exisits in database
app.put('/api/inventory/update/:id', async (req, res) => {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });

    try {
        const dynamoParams = {
            TableName: TABLE_NAME,
            Key: {
                id: req.params.id,
            },
            UpdateExpression: 'set #name = :name, #quantity = :quantity, #price = :price',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#quantity': 'quantity',
                '#price': 'price',
            },
            ExpressionAttributeValues: {
                ':name': updatedItem.name,
                ':quantity': updatedItem.quantity,
                ':price': updatedItem.price,
            },
            ReturnValues: 'UPDATED_NEW',
        };
        await dynamoDB.update(dynamoParams).promise();
    } catch (dynamoError) {
        console.error('Error updating item in DynamoDB:', dynamoError);
        await Item.findByIdAndUpdate(req.params.id, originalItem, { new: true });
        return res.status(500).json({ error: 'Failed to update item in DynamoDB, rolled back MongoDB.' });
    }

    res.json(updatedItem);
});

//Delete: Deletes entry from the database
app.delete('/api/inventory/delete/:id', async (req, res) => {

    const itemId = req.params.id;
    try {
    const itemToDelete = await Item.findById(itemId);
        if (!itemToDelete) {
            return res.status(404).json({ error: 'Item not found in MongoDB' });
        }
    
    await Item.findByIdAndDelete(req.params.id);

    try {
        const dynamoParams = {
            TableName: TABLE_NAME,
            Key: {
                id: req.params.id,
            },
        };
        await dynamoDB.delete(dynamoParams).promise();
    } catch (dynamoError) {
        console.error('Error deleting item from DynamoDB:', dynamoError);
        await new Item(itemToDelete).save();
        return res.status(500).json({ error: 'Failed to delete item from DynamoDB, rolled back MongoDB.' });
    }

    res.json({ message: 'Item deleted' });
    }catch (mongoError) {
        console.error('Error deleting item from MongoDB:', mongoError);
        res.status(500).json({ error: 'Failed to delete item from MongoDB' });
    }
});

app.post('/api/inventory/archive/:id', async (req, res) => {
    try {
        // Find the item in MongoDB
        const itemToArchive = await Item.findById(req.params.id);
        if (!itemToArchive) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Copy the item to DynamoDB archive table
        const archiveParams = {
            TableName: ARCHIVE_TABLE_NAME, // DynamoDB Archive Table Name
            Item: {
                id: itemToArchive._id.toString(),
                name: itemToArchive.name,
                quantity: itemToArchive.quantity,
                price: itemToArchive.price,
                archivedAt: new Date().toISOString(), // Optional: Store when the item was archived
            },
        };

        await dynamoDB.put(archiveParams).promise(); // Insert into archive table

        // Delete the item from the active DynamoDB table
        const deleteParams = {
            TableName: TABLE_NAME,
            Key: {
                id: itemToArchive._id.toString(),
            },
        };

        await dynamoDB.delete(deleteParams).promise(); // Remove from active table

        // Optionally delete the item from MongoDB if no longer needed
        await Item.findByIdAndDelete(req.params.id);

        res.json({ message: 'Item archived successfully' });
    } catch (error) {
        console.error('Error archiving item:', error);
        res.status(500).json({ error: 'Failed to archive item' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} hello`);
});
