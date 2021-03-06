const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');
const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const UserCtrl = require('../controllers/user');

router.get('/secret', UserCtrl.authMiddleware, function(req, res) {
  res.json({ "secret": true })
});

router.get('/manage', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;

  Rental
    .where({user})
    .populate('bookings')
    .exec(function(err, foundRentals){
      if (err) {
        return res.status(422).send({ errors: [{ title: 'Rental error!', detail: 'Could not find Rental!' }] });
      }
      return res.json(foundRentals);
  });
});

router.get('/:id', function(req, res) {
  const rentalId = req.params.id;

  Rental
    .findById(rentalId)
    .populate('user', 'username -_id')
    .populate('bookings', 'startAt endAt -_id')
    .exec(function(err, foundRental){
      if (err) {
        return res.status(422).send({ errors: [{ title: 'Rental error!', detail: 'Could not find Rental!' }] });
      }
      return res.json(foundRental);
    });
});

router.delete('/:id', UserCtrl.authMiddleware, function(req, res) {
  const user = res.locals.user;
  const rentalId = req.params.id;

    Rental
      .findById(rentalId)
      .populate('user', '_id')
      .populate({
        path: 'bookings',
        select: 'startAt',
        match: { startAt: { $gt: new Date() } }
      })
      .exec(function(err, foundRental){
        if (err) {
          return res.status(422).send({ errors: normalizeErrors(err.errors) })   
        }
        if (user.id !== foundRental.user.id) {
          return res.status(403).send({ errors: [{ title: 'Invalid user!', detail: 'Rentals can only be deleted by their owners!' }] }); 
        }
        if (foundRental.bookings.length > 0) {
          return res.status(403).send({ errors: [{ title: 'Active bookings were found!', detail: 'Rentals cannot be deleted with active bookings!' }] }); 
        }
        foundRental.remove(function(err) {
          if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) })   
          }
          return res.json ({'status': 'deleted'})        
      });
    });
});

router.get('', function(req, res) {
  const city = req.query.city;
  const query = city ? { city: city.toLowerCase() } : {};

  Rental
    .find(query)
    .select('-bookings')
    .exec(function(err, foundRentals){
      if (err) {
        return res.status(422).send({ errors: normalizeErrors(err.errors) })
      }
      if(city && foundRentals.length === 0) {
        return res.status(422).send({ errors: [{ title: 'No rentals!', detail: `No rentals were found for ${city} :(` }] });
      }
      return res.json(foundRentals);
    });
});

router.post('', UserCtrl.authMiddleware, function(req, res) {
  const { title, city, street, category, image, bedrooms, shared, description, dailyRate } = req.body;
  const user = res.locals.user;
  const rental = new Rental({ title, city, street, category, image, bedrooms, shared, description, dailyRate });
  rental.user = user;

  Rental.create(rental, function(err, newRental) {
    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) })   
    }
    User.updateOne({ _id: user.id }, { $push: { rentals: newRental } }, function(){} );
    return res.json(newRental);
  });
});

module.exports = router;
