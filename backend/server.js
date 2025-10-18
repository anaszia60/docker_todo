const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (for demonstration)
let todos = [];
let nextId = 1;

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Todo App Backend API', version: '1.0.0' });
});

// Get all todos
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

// Get single todo
app.get('/api/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
});

// Create todo
app.post('/api/todos', (req, res) => {
    const { text, completed = false } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }
    
    const newTodo = {
        id: nextId++,
        text,
        completed,
        createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// Update todo
app.put('/api/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    const { text, completed } = req.body;
    
    if (text !== undefined) todo.text = text;
    if (completed !== undefined) todo.completed = completed;
    todo.updatedAt = new Date().toISOString();
    
    res.json(todo);
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
    const index = todos.findIndex(t => t.id === parseInt(req.params.id));
    
    if (index === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    todos.splice(index, 1);
    res.status(204).send();
});

// Clear completed todos
app.delete('/api/todos/completed/clear', (req, res) => {
    const initialLength = todos.length;
    todos = todos.filter(todo => !todo.completed);
    const deletedCount = initialLength - todos.length;
    res.json({ message: `Deleted ${deletedCount} completed todos` });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', uptime: process.uptime() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend API running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

