const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@geniouscarmechanics.uz2bo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
       await client.connect();
        // console.log('connected')
        const database = client.db("TravelSiteAssignment");
        const PlansCollection = database.collection("plans");

        //Get API
        app.get('/plans', async(req, res) => {
            const cursor = PlansCollection.find({});
            const plan = await cursor.toArray();
            res.send(plan);
        });
        //GET Single API 
        app.get('/plans/:id', async(req, res) => {
            const id = req.params.id;
            const query ={_id: objectId(id)};
            console.log("🚀 ~ file: index.js ~ line 36 ~ app.get ~ id", id)
            const singlePlan = await PlansCollection.findOne(query);
             res.json(singlePlan);
        });
        //Post API
        app.post('/plans', async(req, res) => {
            const plans = req.body;
            console.log("🚀 ~ file: index.js ~ line 29 ~ app.post ~ plans", plans)
                console.log('hit api');


                 const result = await PlansCollection.insertOne(plans);
                 console.log("🚀 ~ file: index.js ~ line 34 ~ app.post ~ result", result);
                 
                 res.json(result);
        });

        //Delete Single API 
        app.delete('/plans/:id', async(req, res) => {
            const id = req.params.id;
            const query ={_id: objectId(id)};
            const result = await PlansCollection.deleteOne(query);
             res.json(result);

        });

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Server Set Up root derectory');
});

app.listen(port, () => {
    console.log(`Server Listening`);
});