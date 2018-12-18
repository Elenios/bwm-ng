const Booking = require('../models/booking');
const Rental = require('../models/rental');
const { normalizeErrors } = require('../helpers/mongoose');
const moment = require('moment');


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
    if (isValidBooking(booking, foundRental)){
      booking.save();
      return res.json({ 'created': true })
    } else {
      return res.status(422).send({ errors: [{ title: 'Invalid booking!', detail: 'Selected date is already booked.' }] });
    }
  });

  function isValidBooking(proposedBooking, rental) {
    if (rental.bookings && rental.bookings.length > 0) {
      rental.bookings.every(function(booking) {
        const proposedStart = moment(proposedBooking.startAt);
        const proposedEnd = moment(proposedBooking.endAt);
        const actualStart = moment(booking.startAt);
        const actualEnd = moment(booking.endAt);

        return ((actualStart < proposedStart && actualEnd < proposedStart)
        || (proposedEnd < actualStart && proposedEnd < actualEnd) )
      });
    }
    return true;
  } 


}