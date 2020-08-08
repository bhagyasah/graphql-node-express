const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
  bookings: async (args) => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      })
    } catch(e) {
      throw e;
    }
  },
  bookEvent: async args => {
    try {
      const fetchedEvent = await Event.findOne({_id: args.eventId});
      const book = new Booking({
        user: '5f2e404b20a32535a6e1b4b7',
        event: fetchedEvent
      })
      const result = await book.save();
      return transformBooking(result);
    } catch(e) {
      throw e;
    }
  },
  cancelBooking: async args => {
    const booking = await Booking.findById(args.bookingId).populate('event');
    const event = transformEvent(booking.event)
    await Booking.deleteOne({_id: args.bookingId });
    return event;
  }
}