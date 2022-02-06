const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


// 
app.use(cors());
app.use(express.json());
require('dotenv').config();



// 
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ogqtm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// 
async function run() {
    try {
        console.log('from function')
        await client.connect();
//
        // declear database and collection
        const database = client.db("tourBd");
        const tourPlaces = database.collection("places");
        const orderedTours = database.collection('orders');

        // // GET API
        app.get('/places', async (req, res) => {
            const cursor = tourPlaces.find({});
            const places = await cursor.toArray();
            res.send(places);
        })

        // // for orders
        // GET API
        app.get('/orders', async (req, res) => {
            const cursor = orderedTours.find({});
            const orders = await cursor.toArray();
            console.log("showing from orders", orders)
            res.send(orders);
        })

        // // GET A SINGEL API
        app.get('/placeDetails/:id', async (req, res) => {
            const id = req.params.id;
            console.log('id', id);
            const query = { _id: ObjectId(id) };
            const place = await tourPlaces.findOne(query);
            res.json(place)
        })

        // // POST API
        app.post('/places', async (req, res) => {
            const place = req.body;
            console.log('hit', place)
            const result = await tourPlaces.insertOne(place);
            console.log(result)
            res.json(result)
        })

        // // for order
        // // POST API
        
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            console.log('got it', orders)
            const result = await orderedTours.insertOne(orders);
            res.json(result)
        })
        // // for order
        // //DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await orderedTours.deleteOne(query);
            res.json(result)
        })
        
 


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




// 
app.get('/', (req, res) => {
    console.log('connected from get')
    res.send('Hello World! from endgame')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port} endgame`)
})