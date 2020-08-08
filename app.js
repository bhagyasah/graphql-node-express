const express = require('express');
const bodyParsor = require('body-parser');
const bcrypt = require('bcryptjs');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');
const User = require('./models/user');

const app = express();
app.use(bodyParsor.json());

const user = userId => {
  return User.findById(userId)
  .then(user => {
    return { ...user._doc, _di: user.id}
  })
  .catch(err => {
    throw err;
  })
}

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
  type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
  }

  input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  input UserInput {
    email: String!
    password: String!
  }

  type RootQuery {
    events: [Event!]!
  }

  type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
  `),
  rootValue:{
    events: () => {
    return  Event
    .find()
    .populate('creator')
    .then((events) => {
      console.log('Event List', events);
      return events;
      }).catch(e => {
        throw e
      })
    },
    createEvent: (args) => {
      console.log('args in create Event', args);
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "5f2ce3a9872cd03555a5f447"
      })
      let createdEvent;
     return event
     .save()
     .then((result) => {
       createdEvent = {...result._doc};
       User.findById('5f2ce3a9872cd03555a5f447')
       .then(user => {
         if (!user) {
           throw new Error('User Not found')
         }
         user.createdEvents.push(event);
         return user.save();
       })
       .then(result => {
         return createdEvent;
       })
        console.log('result of save mon', result);
        return{...result._doc};
      }).catch((err) => {
        console.log(err);
        throw err;
      });
    },
    createUser: args => {
    return  User.findOne({ email: args.userInput.email}).then(user => {
      if (user) {
        throw new Error('User Exists already.')
      }
      return bcrypt.hash(args.userInput.password, 12);
    })
    .then((hashPassword) => {
        const user = new User({
          email: args.userInput.email,
          password: hashPassword
        });
      return  user
        .save()
        .then(res =>{
          return { ...res._doc }
        })
        .catch(err => console.log(err));
      }).catch(err => {
        console.log(err);
        throw err;
      })
    }
  },
  graphiql: true,
})
)


mongoose.connect(`mongodb+srv://bhagya:bhegr0MmWUp2Ulo6@cluster0.xjuf9.mongodb.net/test?retryWrites=true&w=majority`)
.then((res) => {
  app.listen(3000);
}).catch((err) => {
  console.error('Error on Mongoose', err);
});
