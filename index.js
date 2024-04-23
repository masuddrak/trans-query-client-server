const express = require('express')
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = 5000
// medilware
app.use(cors())
app.use(express.json())

// mongodb information

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.MD_USER}:${process.env.MD_PASS}@cluster0.kaocfbi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const transQueryCollection = client.db("TransQueryDB").collection("comments");
    // comment delete
    app.delete("/comments/:id",async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result = await transQueryCollection.deleteOne(query);
      res.send(result)
    })
    // read comments
    app.get("/comments",async(req,res)=>{
      const cursor = transQueryCollection.find();
      const result=await cursor.toArray()
      res.send(result)

    })

    // create comment
    app.post("/comments",async(req,res)=>{
      const comment=req.body
      const result = await transQueryCollection.insertOne(comment);
      res.send(result)
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})