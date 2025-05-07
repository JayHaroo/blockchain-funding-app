require('dotenv').config()
const express = require('express')
const app = express()
const port = 3001
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI)

let userCollection, postCollection;

async function connectDB() {
  try {
    await client.connect();
    const database = client.db('fundchain');
    userCollection = database.collection('users');
    postCollection = database.collection('posts');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}
connectDB();

app.get('/', (req, res) => {
  res.send('FundChain Hello!')
})

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const newUser = { name, email, password };
    const result = await userCollection.insertOne(newUser);
    res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userCollection.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Assuming you're using the userId in the session or token:
    // For now, just return the userId as a placeholder for session management
    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/createPost', async (req, res) => {
  const { title, content, userId, category, location, goal, deadline } = req.body;
  try {
    const newPost = { title, content, userId, category, location, goal, deadline };
    const result = await postCollection.insertOne(newPost);
    res.status(201).json({ message: 'Post created successfully', postId: result.insertedId });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await postCollection.find().toArray();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Exclude the password before sending back the user data
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// New endpoint for getting the current user
app.get('/api/currentUser', async (req, res) => {
  const userId = req.headers['user-id']; // or get it from session/token (example, using headers here for simplicity)
  
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Exclude the password before sending back the user data
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
