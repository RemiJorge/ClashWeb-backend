const express = require('express');
const userRoutes = require('./routes/user');
const cocTokenRoutes = require('./routes/cocToken');
const roleRoutes = require('./routes/role');
const annoncePlayerRoutes = require('./routes/annoncePlayer');
const messageAnnonceRoutes = require('./routes/messageAnnonce');
const annonceClanRoutes = require('./routes/annonceClan');
const messageClanRoutes = require('./routes/messageClan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

var corsOptions = {
  origin: '*',
  credentials: true
};

app.use(cors(corsOptions));

const dbUrl = process.env.DATABASE_URL;
mongoose.connect(dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use('/api/auth', userRoutes);
app.use('/api/coc', cocTokenRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/annonceplayer', annoncePlayerRoutes);
app.use('/api/messageannonce', messageAnnonceRoutes);
app.use('/api/annonceclan', annonceClanRoutes);
app.use('/api/messageclan', messageClanRoutes);


module.exports = app;
