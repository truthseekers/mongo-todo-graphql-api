const { Mutation } = require("./mutations");
const { Query } = require("./queries");

const resolvers = {
  Query,
  Mutation,
};

module.exports = {
  resolvers,
};
