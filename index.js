const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const OrdersCollection = database.collection("orders");
        const UsersCollection = database.collection("users");

        //Get API
        app.get('/plans', async(req, res) => {
            const cursor = PlansCollection.find({});
            const plan = await cursor.toArray();
            res.send(plan);
        });
        //GET Single API 
        app.get('/addorder/:id', async(req, res) => {
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
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
        //Add odders
        app.post("/addorder", async (req, res) => {
            console.log(req.body);
            const result = await OrdersCollection.insertOne(req.body);
            console.log("🚀 ~ file: index.js ~ line 55 ~ app.post ~ result", result)
            res.send(result);
          });

            
        // Get Order
        app.get("/orders", async (req, res) => {
            const result = await OrdersCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });
        // Delete order
        app.delete("/deleteOrder/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await OrdersCollection.deleteOne({
              _id: ObjectId(req.params.id),
            });
            res.send(result);
          });
          //Get my Order
          app.get("/myorder/:email", async (req, res) => {
            const result = await OrdersCollection.find({
              email: req.params.email,
            }).toArray();
            console.log(result)
            res.send(result);
          });
          //Update Order Status
          app.put('/updateOrder/:id', async (req, res) => {
            const order = req.body;
            const options = { upsert: true };
            const updatedOrder = {
                $set: { status: order.status }
            };
            const updateStatus = await OrdersCollection.updateOne({ _id: ObjectId(req.params.id) }, updatedOrder, options);

            res.json(updateStatus);
        });

          //Add Users
        app.post("/adduser", async (req, res) => {
            console.log(req.body);
            const result = await UsersCollection.insertOne(req.body);
            console.log("🚀 ~ file: index.js ~ line 55 ~ app.post ~ result", result)
            res.send(result);
          });

            
        // Get Users
        app.get("/users", async (req, res) => {
            const result = await UsersCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });
        // Delete Users
        app.delete("/deleteusers/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await UsersCollection.deleteOne({
              _id: ObjectId(req.params.id),
            });
            res.send(result);
          });

          

        //Delete Single API 
        app.delete('/plans/:id', async(req, res) => {
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
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
    res.send(' Running Server Root derectory');
});

app.listen(port, () => {
    console.log(`Server Listening`);
});