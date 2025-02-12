const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 4000
const app = express()

app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eko35.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = 'mongodb://localhost:27017'

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
        // await client.connect();

        const campCollection = client.db('a10-fundingDB').collection('campaigns')
        const donarCollection = client.db('a10-fundingDB').collection('Donars')

        //here get(), for display stored data
        app.get('/campaigns', async (req, res) => {
            const cursor = campCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        //display single data by id
        app.get('/campaigns/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await campCollection.findOne(query)
            res.send(result)
        })
        // using post, for sending data to mongoDB
        app.post('/campaigns', async (req, res) => {
            const data = req.body;
            const result = await campCollection.insertOne(data)
            res.send(result)
        })

        app.patch('/campaigns/:id', async(req,res)=>{
            const id = req.params.id
            const data = req.body;
            const query = {_id: new ObjectId(id)}
            const {title, description,type,amount,date,image} = data
            const updateDoc ={
                $set: {
                    title: title,
                    description:description,
                    type:type,
                    amount:amount,
                    date:date,
                    image:image
                }
            }
            const result = await campCollection.updateOne(query,updateDoc)
            res.send(result)
        })

        app.delete('/campaigns/:id', async(req,res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await campCollection.deleteOne(query)
            res.send(result)
        })

        // Donars apis
        app.get('/donars', async (req, res) => {
            const cursor = donarCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/donars', async (req, res) => {
            const data = req.body
            const result = await donarCollection.insertOne(data)
            res.send(result)
        })

      
    
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('crowd fuding server here')
})

app.listen(port, () => {
    console.log(`connected port on ${port}`)
})