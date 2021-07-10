const express = require('express');
const app = express();
// const MongoClient = require('mongodb').MongoClient;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n5sag.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('error message', err);
  const blogsCollection = client.db("blog-app").collection("blogs");
  console.log('database connected successfully');

  app.post('/addBlog', (req, res) => {
    const newBlog = req.body;
    console.log('adding new blog', newBlog);

    blogsCollection.insertOne(newBlog)
    .then(result => {
      console.log('inserted count', result);
      res.send(result.insertedCount > 0)
    })
  });

  app.get('/allBlogs', (req, res) => {
    blogsCollection.find({})
    .toArray((err, blogs) => {
      // console.log(err);
      res.send(blogs)
    })
  });

  app.delete('/deleteBlog/:id', (req, res) => {
    const id = ObjectId(req.params.id);
    blogsCollection.findOneAndDelete({_id: id})
    .then(blog => res.send(blog.value))
  });

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})