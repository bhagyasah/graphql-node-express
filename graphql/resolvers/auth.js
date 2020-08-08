const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
  createUser: async args => {
    try {
      const findOneUserRes = await User.findOne({ email: args.userInput.email});
    if (findOneUserRes) {
      throw new Error('User Exists already.')
    }
    const hashPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashPassword
      });
    const res = await user.save();
    return { ...res._doc };
  } catch (e) {
    throw e;
  }
  },
  login: async({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist.");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is Incorrect !")
    }
   const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretekey', {
     expiresIn: '1h'
   });
   return { userId: user.id, token: token, tokenExpiration: 1 }
  }
}