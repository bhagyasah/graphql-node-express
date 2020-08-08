const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date');
const { transformEvent } = require('./merge');


module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      })
    } catch (e) {
      throw e;
    }
  },

  createEvent: async (args) => {
    console.log('args in create Event', args);
    try {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5f2e404b20a32535a6e1b4b7"
    })
    let createdEvent;
   const result = await event.save();
     createdEvent = {...result._doc};
   const user = await User.findById('5f2e404b20a32535a6e1b4b7');
       if (!user) {
         throw new Error('User Not found')
       }
       user.createdEvents.push(event);
       await user.save();
       return createdEvent;
      } catch (e) {
        throw e;
      }
  }
}