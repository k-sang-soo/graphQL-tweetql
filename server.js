import { ApolloServer } from "@apollo/server";
import { gql } from 'graphql-tag';
import {startStandaloneServer} from "@apollo/server/standalone";

const typeDefs = gql`
   # 우리만의 타입을 정의해서 사용할 수 있음 (allTweets의 타입)
   type User {
      id: ID!
      firstName: String!
      lastName: String!
      fullName: String!
   }
   type Tweet {
      id: ID!
      text: String!
      author: User
   }
   # type Query 는 필수로 적어야 함
   # type Query 안에 있는 모든 것들은 REST API에서 GET의 개념처럼 작동된다고 보면 됨
   type Query {
      allTweets: [Tweet!]!
      tweet(id: ID!): Tweet # REST API로 치면 api/v1/tweet:id
   }
`

const server = new ApolloServer({typeDefs});

const { url } = await startStandaloneServer(server, {
   listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);