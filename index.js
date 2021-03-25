const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const password = 'organicUserPassword';
const uri = "mongodb+srv://organicUser:organicUserPassword@cluster0.8hqot.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req, res) =>{
    // res.send('Hello, I am working');
    res.sendFile(__dirname +  '/index.html')
})



client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");
  //const product = { name: "Honey", price:220, quantity:20};

  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray((err,  documents) =>{
        res.send(documents);
    })
  })

  app.get('/product/:id', (req, res)=> {
      productCollection.find({_id: ObjectId(req.params.id)})
      .toArray((err, documents)=>{
          res.send(documents[0]);
      })
  })

  app.post("/addProduct", (req, res) =>{
    const product = req.body;
    // console.log(product)
    productCollection.insertOne(product)
    .then(result =>{
        console.log("data added successfully")
        // res.send('Success')
        res.redirect('/');
    })
  })

  app.patch('/update/:id', (req, res) => {
      console.log(req.body.price);
      productCollection.updateOne({_id: ObjectId(req.params.id)},
      {
        $set: {price: req.body.price, quantity: req.body.quantity}
      })
      .then(result => {
        //   console.log(result)
        res.send( result.modifiedCount > 0)
      })
  })

  app.delete('/delete/:id',(req, res)=>{
    //   console.log(req.params.id)
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) => {
        // console.log(result);
        res.send(result.deletedCount > 0);
    } )
  })
//   collection.insertOne(product)
//   .then(result => {
//       console.log("One Product Added")
//   })
//   console.log("dabase connected!")

  // perform actions on the collection object



//   client.close();
});


app.listen(3000);