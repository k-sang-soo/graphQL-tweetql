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
   # ! 의미는 null을 포함하는 지 체크
   # [Tweet!]! 는 결과 값이 []이 될 수는 있지만 null이 될 수는 없고, []안에 Tweet 객체만 들어올 수 있다. ex)[Tweet1, Tweet2, Tweet3]
   # [Tweet]! 는 [] 안에 Tweet 객체 뿐만 아니라 null이 들어올 수 있다. ex)[Tweet1, null, Tweet2] 
   type Query {
      allTweets: [Tweet!]!
      tweet(id: ID!): Tweet # REST API로 치면 api/v1/tweet:id
   }
   # REST API에서 POST, PUT, DELETE 등과 같은 개념
   type Mutation {
      postTweet(text: String, userId: ID): Tweet
      deleteTweet(id: ID): Boolean
   }
`

const server = new ApolloServer({typeDefs});

const { url } = await startStandaloneServer(server, {
   listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);