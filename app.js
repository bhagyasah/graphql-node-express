const express = require('express');
const bodyParsor = require('body-parser');

const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema');
const graphQlResolver = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth');

const app = express();
app.use(bodyParsor.json());

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
  schema: graphQlSchema,
  rootValue: graphQlResolver,
  graphiql: true,
})
)

mongoose.connect(`mongodb+srv://bhagya:bhegr0MmWUp2Ulo6@cluster0.xjuf9.mongodb.net/test?retryWrites=true&w=majority`)
.then((res) => {
  app.listen(3000);
}).catch((err) => {
  console.error('Error on Mongoose', err);
});
