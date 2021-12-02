require('dotenv').config()
const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer } = require("apollo-server");
const neo4j = require("neo4j-driver");

// (You may need to replace your connection details, username and password)
const { AURA_ENDPOINT, AURA_USER, AURA_PASS } = process.env

// Create Neo4j driver instance
const driver = neo4j.driver(AURA_ENDPOINT, neo4j.auth.basic(AURA_USER, AURA_PASS));

const typeDefs = `
  type Person {
    name: String
    knows: [Person] @relationship(type: "KNOWS", direction: OUT)
    friendCount: Int @cypher(statement:"RETURN SIZE((this)-[:KNOWS]->(:Person))")
  }
`;

// Create instance that contains executable GraphQL schema from GraphQL type definitions
const neoSchema = new Neo4jGraphQL({
  typeDefs,
  driver
});

// Create ApolloServer instance to serve GraphQL schema
const server = new ApolloServer({
  schema: neoSchema.schema
});

// Start ApolloServer
server.listen().then(({ url }) => {
  console.log(`GraphQL server ready at ${url}`);
});
