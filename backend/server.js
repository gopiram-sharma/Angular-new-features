const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const corsOptions = {
  'origin': '*',
  'methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'allowedHeaders': 'Content-Type,Authorization',
};
app.use(cors(corsOptions));
app.options(/^\/.*$/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/taskdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.on('connected', () => console.log('Mongoose connected'));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
mongoose.set('debug', function (collectionName, method, query, doc) {
  console.log(`Mongoose: ${collectionName}.${method}`, JSON.stringify(query), doc || '');
});

// Task Schema and Model
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const mongoClient = mongoose.model('Task', TaskSchema);

// Routes

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  console.log('api called.');
  try {
    const tasks = await mongoClient.find();
    console.log('api called - 1');
    res.json(tasks);
    console.log('api called - 2');
  } catch (err) {
    console.error('api called - error', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  console.log('single get api called.');
  try {
    const task = await mongoClient.findById(req.params.id);
    console.log('get api called - 1');
    res.json(task);
    console.log('get api called - 2');
  } catch (err) {
    console.error('get api called - error', err);
    res.status(500).json({ error: 'Failed to fetch task: ' + req.params.id });
  }
});

// POST create new task
app.post('/api/tasks', async (req, res) => {
  console.log('create api called');
  try {
    const newTask = await mongoClient.create(req.body);
  console.log('create api called - 1');
    res.status(201).json(newTask);
  console.log('create api called - 2');
  } catch (err) {
  console.log('create api called - error', err);
    res.status(400).json({ error: 'Failed to create task' });
  }
});

// PUT update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updated = await mongoClient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update task' });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deleted = await mongoClient.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete task' });
  }
});

// Catch-all for unknown API routes
app.use((req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Start server
app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
