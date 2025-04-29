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

let userCollection;

async function connectDB() {
  try {
    await client.connect();
    const database = client.db('fundchain');
    userCollection = database.collection('users');
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
      return res.status(400).json({ message: 'email already exists' });
    }
    const newUser = { name, email, password };
    const result = await userCollection.insertOne(newUser);
    res.status(201).json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
