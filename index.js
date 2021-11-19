const express =require('express');
const { MongoClient } = require('mongodb');
const ObjectId =require('mongodb').ObjectId;
const cors =require('cors');
require('dotenv').config()
const app =express();
const port=process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.01vip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("hawargariDB");
      const productDetails = database.collection("product");
      // get api 
      app.get('/product',async(req,res)=>{
        const cursor = productDetails.find({});
        const product =await cursor.toArray()
        res.send(product);
      } );
      // get single service 
      app.get('/product/:id',async(req,res)=>{
        const id =req.params.id;
        const query ={_id:ObjectId(id)};
        const product =await productDetails .findOne(query);
        res.json(product);
      })
      // post api
      app.post('/product', async (req,res)=>{
        const product =req.body;
        console.log('hitting',product)
  
        const result =await productDetails.insertOne(product);
        console.log(result)
        res.json(result)
      })
      //review server
      await client.connect();
      const reviewDB = client.db("usersReviewDB");
      const cycle = reviewDB.collection("review");
      // get api 
      app.get('/review',async(req,res)=>{
        const cursor = cycle.find({});
        const review =await cursor.toArray()
        res.send(review);
      } );
      // get single service 
      app.get('/review/:id',async(req,res)=>{
        const id =req.params.id;
        const query ={_id:ObjectId(id)};
        const review =await cycle .findOne(query);
        res.json(review);
      })
      // post api
      app.post('/review', async (req,res)=>{
        const review =req.body;
        console.log('hitting',review)
  
        const result =await cycle.insertOne(review);
        console.log(result)
        res.json(result)
      })
      // Delete api 
      app. delete('/product/:id',async(req,res)=>{
        const id =req.params.id;
        const query={_id:ObjectId(id)};
        const result =await productDetails.deleteOne(query);
        res.json(result);
      })
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);
  
  app.get('/',(req,res)=>{
      res.send('Hawar Gari  server is running')
  });
  app.listen(port,()=>{
      console.log('Hawar Gari server is  running at port',port);
  });