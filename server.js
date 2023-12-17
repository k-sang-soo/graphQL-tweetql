import { ApolloServer } from "@apollo/server";
import { gql } from 'graphql-tag';
import {startStandaloneServer} from "@apollo/server/standalone";

// 더미 데이터
let tweets = [
   {
      id: "1",
      text: "first",
      userId: "2"
   },
   {
      id: "2",
      text: "second",
      userId: "1"
   }
];

let users = [
   {
      id: "1",
      firstName: "kim",
      lastName: "sangsoo"
   }
];

// typeDefs 는 GraphQL API에서 사용할 데이터 타입들의 정의
const typeDefs = gql`
   # 우리만의 타입을 정의해서 사용할 수 있음 (allTweets의 타입)
   type User {
      id: ID!
      firstName: String!
      lastName: String!
      fullName: String! # dynamic field 추가
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
      allUsers: [User!]!
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
      allUsers() {
        return users;
      },
      allTweets() {
         return tweets;
      },
      // Apollo server가 resolvers function을 부를 때 2가지 argument를 줌
      // 첫번째 argument에는 현재 실행 중인 쿼리의 최상위 필드에 해당하는 데이터가 들어있음
      // query 요청할 떄 보낸 args는 resolvers의 두번째 args에 들어감
      tweet(root, {id}) {
         return tweets.find(tweet => tweet.id === id);
      }
   },
   Mutation: {
      postTweet(_, {text, userId}) {
         const newTweet = {
            id: tweets.length + 1,
            text,
            userId
         };
         tweets.push(newTweet);
         return newTweet;
      },
      deleteTweet(_, {id}) {
         const tweet = tweets.find(tweet => tweet.id === id);
         if(!tweet) return false;
         tweets = tweets.filter(tweet => tweet.id !== id);
         return true;
      }
   },
   /*
    type resolvers 정의
    작동 순서
    1. allUsers 쿼리 실행
    2. 해당 쿼리에 대한 Resolvers 함수인 allUsers Resolvers가 실행
    3. GraphQL은 allUsers 쿼리의 결과로 나온 데이터에서 fullName 필드가 없다는 것을 확인
    4. GraphQL은 Resolvers에서 정의한 타입 중에서 fullName 필드를 찾으려고 함
    5. fullName 필드가 해당 타입(User)에서 정의되어 있다면 fullName 함수를 실행
    6. 함수의 반환 값은 기존 타입(User)의 필드 값에 fullName을 추가하여 최종적인 응답 데이터가 됨
    */
   User: {
       fullName({firstName, lastName}) {
          return `${firstName} ${lastName}`;
       }
   },
   Tweet: {
      author({userId}) {
         return users.find(user => user.id === userId);
      }
   }
}

const server = new ApolloServer({typeDefs, resolvers});

const { url } = await startStandaloneServer(server, {
   listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);