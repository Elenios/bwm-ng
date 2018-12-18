const Booking = require('../models/booking');
const Rental = require('../models/rental');
const { normalizeErrors } = require('../helpers/mongoose');


exports.createBooking = function(req, res) {
  const { startAt, endAt, totalPrice, guest, days, rental } = req.body;
  const user = res.locals.user;
  const booking = new Booking({ startAt, endAt, totalPrice, guest, days, rental });

  Rental.findById(rental._id)
        .populate('bookings')
        .populate('user')
        .exec(function(err, foundRental) {

    if (err) {
      return res.status(422).send({ errors: normalizeErrors(err.errors) });
    }
    if (foundRental.user.id === user.id) {
      return res.status(422).send({ errors: [{ title: 'Invalid user!', detail: 'Users cannot book their own rentals!' }] });
    }

    return res.json({ booking, foundRental })
  });
}