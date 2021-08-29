const express = require('express');

//bring in mongoose
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const blogRouter = require('./routes/blogs');
const Blog = require('./models/Blog');
const app = express();

//connect to mongoose
mongoose.connect('mongodb+srv://sean:1234@likelion.z9gnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

//set template engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));



//route for the index
app.get('/', async (req, res) => { // 가져온 이후에 정렬
  let blogs = await Blog.find().sort({timeCreated: 'desc'}) // []
  res.render('index', { blogs: blogs });
});

app.use(express.static('public'));
app.use('/blogs', blogRouter);

//listen port
const port = 5000;
app.listen(process.env.PORT || port, () => {
  console.log(`Server is learning on http://localhost:${port}`)
});