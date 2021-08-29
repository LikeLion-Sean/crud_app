//blog routes
const express = require('express');
const multer = require('multer');
const Blog = require('../models/Blog');
const router = express.Router();


// Multer
const storageMulter = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now()+ file.originalname);
  }
});

const upload = multer({ // middleware
  storage: storageMulter,
  limits: {
    fileSize: 10000000
  }
})

router.get('/new', (req, res) => {
  res.render('new');
});
// 시험지 받고 // GET (CRUD) Create Read Update Delete
// 시험지 풀고 // GET(작성)
// 시험지 채점 // POST
// 성적표 전달 받기 // GET

//view route
router.get('/:slug', async (req, res) => { // blogs/:slug
  let blog = await Blog.findOne({slug: req.params.slug });
  if(blog){ // have
    res.render('show', {blog: blog});
  } else {
    res.redirect('/')
  }
});
//route that handles new post
router.post('/', upload.single('image'), async (req, res) => { // /blogs
  console.log(req.file);
  let blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    img: req.file.filename
  });

  try {
    blog = await blog.save();

    res.redirect(`/blogs/${blog.slug}`);
  } catch (error) {
    console.log(error);
  }
});

// Edit
router.get('/edit/:id', async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  res.render('edit', {blog: blog})
})

router.put('/:id', async (req, res) => {
  req.blog = await Blog.findById(req.params.id);
  let blog = req.blog;
  blog.title = req.body.title;
  blog.author =req.body.author;
  blog.description = req.body.description;

  try {
    blog = await blog.save();
    res.redirect(`/blogs/${blog.slug}`);
  } catch(err){
    console.log(err);
    res.redirect(`/blogs/edit/${blog.id}`, {blog: blog});
  }
});

router.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect('/');
});
 
module.exports = router;

// data:image/png;base64,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
// Create = POST
// Read = GET
// Update = PUT
// Delete = Delte

// // req = {
//     head {

//     }
//     body {
//       우리가 실제로 적은 데이터
//     }
// // }