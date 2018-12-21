const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const FakeDb = require('./fake-db');
const path = require('path');

const rentalRoutes = require('./routes/rentals'),
      userRoutes = require('./routes/users'),
      bookingRoutes = require('./routes/bookings');

mongoose.connect(config.DB_URI, { useNewUrlParser: true }).then(() => {
  const fakeDb = new FakeDb();
  // fakeDb.seedDb();
});

mongoose.set('useCreateIndex', true);

const app = express();

app.use(bodyParser.json())

app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);

const appPath = path.join(__dirname, '..', 'dist');
app.use(express.static(appPath));

app.get('*', function(req,res) {
  res.sendFile(path.resolve(appPath, 'index.html'))
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, function() {
  console.log('Server is running');
});