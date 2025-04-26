const express = require('express');
const { engine } = require('express-handlebars');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Handlebars setup
app.engine('handlebars', engine({
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/todos', require('./routes/todoRoutes'));

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { error: 'Something broke!' });
});

module.exports = app; 