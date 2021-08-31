const { Todo } = require("../models/Todo");
const { User } = require("../models/User");
const { Stripe } = require("stripe");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const stripe = new Stripe(process.env.SECRET_KEY);

const Mutation = {
  signup: async (parent, args, context, info) => {
    const customer = await stripe.customers.create({
      name: args.firstName,
      payment_method: args.paymentMethod,
      invoice_settings: {
        default_payment_method: args.paymentMethod,
      },
    });

    console.log("stripe customer mongo; ", customer);

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.FANCY_BIZ_TOOL }],
      default_payment_method: args.paymentMethod,
    });

    if (subscription.status === "incomplete") {
      console.log("problem!");
      throw new Error("There was a problem with your card");
    }

    console.log("made it past subscription mongo");

    const password = await bcrypt.hash(args.password, 10);

    const newUser = new User({
      firstName: args.firstName,
      email: args.email,
      age: args.age,
      password,
    });
    await newUser.save();

    console.log("newUser mongo");

    const { user } = await context.authenticate("graphql-local", {
      email: args.email,
      password: args.password,
    });

    console.log("authenticated. mongo. user: ", user);

    context.login(user);
    console.log("logged in. mongo.");
    console.log("Saved. mongo.");
    return user;
  },
  login: async (parent, { email, password }, context, info) => {
    console.log("login one");

    const { user } = await context.authenticate("graphql-local", {
      email,
      password,
    });

    console.log("in resolver: ", user);
    context.login(user);

    return user;
  },
  logout: (parent, args, context, info) => {
    console.log(context);
    context.logout();
  },
  createTodo: async (parent, { name, isComplete, userId }, context, info) => {
    const todo = new Todo({ name, isComplete, userId });

    return todo.save();
  },
  deleteTodo: async (parent, args, context, info) => {
    const todo = await Todo.findByIdAndRemove(args.todoId);
    return todo;
  },
  updateTodo: async (parent, args, context, info) => {
    console.log("update: name: ", args.name, "isComplete: ", args.isComplete);

    const currentTodo = await Todo.findOne({ _id: args.todoId });
    console.log("currentTodo: ", currentTodo);
    currentTodo.name = args.name;
    currentTodo.isComplete = args.isComplete;

    return currentTodo.save();
  },
  deleteTodo: async (parent, args, context, info) => {
    const todo = await Todo.findByIdAndRemove(args.todoId);
    return todo;
  },
  deleteTodos: async (parent, args, context, info) => {
    const todosToDelete = await Todo.deleteMany({ _id: { $in: args.todoIds } });
    console.log("todosToDelete: ", todosToDelete);
    return { count: todosToDelete.n };
  },
};

module.exports = { Mutation };
