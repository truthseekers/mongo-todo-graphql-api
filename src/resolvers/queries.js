const { Todo } = require("../models/Todo");
const { User } = require("../models/User");

const Query = {
  hello: () => "hello",
  todos: async (parent, args, context, info) => {
    if (!context.isAuthenticated()) {
      throw new AuthenticationError("Must be logged in to view todos");
    }

    const user = await context.getUser();

    // create filter
    let isComplete = args.takeStatus == "complete" ? true : false;
    let filter = {
      userId: user.id,
      isComplete: isComplete,
      name: { $regex: args.filter || "" },
    };

    let allTodos = Todo.find(filter).setOptions({
      skip: args.skip,
      limit: args.take,
    });
    let allTodosCount = Todo.find(filter).count();
    return {
      todoItems: allTodos,
      count: allTodosCount,
    };
  },
  users: async (parent, args, context, info) => {
    return User.find();
  },
  me: (parent, args, context, info) => {
    if (context.getUser()) {
      return context.getUser();
    }
  },
};

module.exports = { Query };
