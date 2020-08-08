const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: {$in: eventIds }});
    console.log('events before map', events);
    return events.map(event => {
       return transformEvent(event);
     });
  } catch (err) {
    throw err;
  }
}

const sigleEvent = async eventId => {
  const result = await Event.findById(eventId);
  return transformEvent(result);
}

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return { ...user._doc, createdEvents: events.bind(this, user.createdEvents)}
  } catch (e) {
    throw e;
  }
}

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator)
  };
}


const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: sigleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking.createdAt),
    updatedAt: dateToString(booking.updatedAt),
  }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
