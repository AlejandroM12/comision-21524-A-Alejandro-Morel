require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./config/database');

const categoriesController = require('./controllers/CategoriesController');
const articlesController = require('./controllers/ArticlesController');
const usersController = require('./controllers/UsersController');

const Article = require('./models/Articles');
const Category = require('./models/Category');
const User = require('./models/User');

// view engine
app.set('view engine', 'ejs');

// Sessions
app.use(
  session({
    secret: 'cualquierocosa',
    cookie: { maxAge: 30000000 },
  })
);

// static
app.use(express.static('public'));

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// database
connection
  .authenticate()
  .then(() => {
    console.log('Conexión realizada con éxito!');
  })
  .catch((error) => {
    console.log(error);
  });

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

app.get('/', (req, res) => {
  Article.findAll({
    order: [['id', 'DESC']],
    limit: 4,
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render('index', { articles: articles, categories: categories });
    });
  });
});

app.get('/:slug', (req, res) => {
  var slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug,
    },
  })
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render('article', { article: article, categories: categories });
        });
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => {
      res.redirect('/');
    });
});

app.get('/category/:slug', (req, res) => {
  var slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        Category.findAll().then((categories) => {
          res.render('index', {
            articles: category.articles,
            categories: categories,
          });
        });
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => {
      res.redirect('/');
    });
});

app.listen(8080, () => {
  console.log('El servidor está funcionandoo!');
});
