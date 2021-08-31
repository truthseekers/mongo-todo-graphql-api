const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const express = require("express");
const { resolvers } = require("./resolvers");
const { typeDefs } = require("./typeDefs");
const { GraphQLLocalStrategy, buildContext } = require("graphql-passport");
const passport = require("passport");
const session = require("express-session");
const SESSION_SECRET = "24jl234haosdih00v8e";
const { v4: uuidv4 } = require("uuid");
const { User } = require("./models/User");
const bcrypt = require("bcryptjs");

require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({
    _id: id,
  });

  done(null, user);
});

passport.use(
  new GraphQLLocalStrategy(async (email, password, done) => {
    console.log("Login two");
    console.log("param used: email: ", email);
    const matchingUser = await User.findOne({
      email: email,
    });
    console.log("matchingUser: ", matchingUser);

    let error = matchingUser ? "" : new Error("User not found!");

    if (matchingUser) {
      const valid = await bcrypt.compare(password, matchingUser.password);

      error = valid ? "" : new Error("Invalid password");
    }

    console.log("login three");
    done(error, matchingUser);
  })
);

const app = express();

app.use(
  session({
    genid: (req) => uuidv4(),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const corsOptions = { credentials: true, origin: process.env.ORIGIN };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    return buildContext({ req });
  },
});

server.applyMiddleware({ app, cors: corsOptions });

const startServer = async () => {
  await mongoose.connect(
    `mongodb+srv://john:${process.env.MONGO_PASS}@cluster0.hzpez.mongodb.net/todographqludemy?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
    }
  );

  // the api server url/port
  app.listen({ port: process.env.PORT }, () =>
    console.log(
      `graphql server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    )
  );
};

startServer();
