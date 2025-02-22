const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000 ;
require('dotenv').config()

// middleware

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fr9le.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const TaskCollection = client.db("Job-Task").collection("alltasks");


app.post('/tasks', async(req,res) => {
  const data = req.body;
  const result = await TaskCollection.insertOne(data);
  res.send(result);
})

// get related apis
app.get('/tasks',async(req,res) => {
  const result = await TaskCollection.find().toArray();
  res.send(result);
})


// update related apis
app.patch('/task/update/:id', async(req,res) => {
  const id = req.params.id ;
  const data = req.body ;
  const filter = {_id: new ObjectId(id)}
	const updatedDoc = {
	  $set: {
      title:data.title,
      description:data.description,
      category:data.category
	  }
	}
	const result = await TaskCollection.updateOne(filter,updatedDoc)
	res.send(result)
})


// delete related api













async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) => {
	res.send('server is running................')
})

app.listen(port,() => {
	console.log('server running..')
})

