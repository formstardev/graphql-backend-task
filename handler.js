const { GraphQLServerLambda } = require("graphql-yoga");
var fs = require("fs");
const typeDefs = fs.readFileSync("./schema.gql").toString("utf-8");

const resolvers = {
  Query: {
    message: () => require("./resolver/Query/hello_world").func(),
    get_commits: (_, b, ctx) =>
      require("./resolver/Query/get_commits").func(_, b, ctx),
  },
  Mutation: {
    generate_api_key: require("./resolver/Mutation/generateApiKey").func,
  },
};

const lambda = new GraphQLServerLambda({
  typeDefs,
  resolvers,
  context: (req) => ({ ...req }),
});

exports.server = lambda.graphqlHandler;
exports.playground = lambda.playgroundHandler;
