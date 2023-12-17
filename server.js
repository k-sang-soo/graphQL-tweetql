import { ApolloServer } from "@apollo/server";
import { gql } from 'graphql-tag';
import {startStandaloneServer} from "@apollo/server/standalone";

// 더미 데이터
const tweets = [
   {
      id: "1",
      text: "first",
   },
   {
      id: "2",
      text: "second",
   }
]

// typeDefs 는 GraphQL API에서 사용할 데이터 타입들의 정의
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
   # ! 의미는 null을 포함하는 지 체크 한마디로 require 인지 체크
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

// resolvers는 GraphQL query 또는 mutation에 대한 구체적인 실행 방식을 정의
const resolvers = {
   Query: {
      allTweets() {
         return tweets;
      },
      // Apollo server가 resolvers function을 부를 때 2가지 argument를 줌
      // query 요청할 떄 보낸 args는 resolvers의 두번째 args에 들어감
      tweet(root, {id}) {
         return tweets.find(tweet => tweet.id === id);
      }
   }
}

const server = new ApolloServer({typeDefs, resolvers});

const { url } = await startStandaloneServer(server, {
   listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);