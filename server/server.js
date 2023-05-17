  const express = require('express');
  const { graphqlHTTP } = require('express-graphql');
  const { buildSchema } = require('graphql');
  const mysql = require('mysql');

  function createConnection() {
    return mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tugas3',
    });
  }

  const schema = buildSchema(`
    type Pin {
      id: ID!
      imgSrc: String!
      name: String!
      link: String!
      size: String!
    }

    type Query {
      pins: [Pin]
    }

    type Mutation {
      addPin(imgSrc: String!, name: String!, link: String!, size: String!): Pin
      deletePin(id: ID!): Boolean
    }

  `);

  const root = {
    pins: () => {
      const connection = createConnection();

      return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM pins', (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }

          connection.end();
        });
      });
    },
    
    addPin: ({ imgSrc, name, link, size }) => {
      const connection = createConnection();

      return new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO pins (imgSrc, name, link, size) VALUES (?, ?, ?, ?)',
          [imgSrc, name, link, size],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              connection.query(
                'SELECT * FROM pins WHERE id = ?',
                [results.insertId],
                (error, results) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(results[0]);
                  }

                  connection.end();
                }
              );
            }
          }
        );
      });
    },

    deletePin: ({ id }) => {
      const connection = createConnection();
  
      return new Promise((resolve, reject) => {
        connection.query(
          'DELETE FROM pins WHERE id = ?',
          [id],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results.affectedRows > 0);
            }

            connection.end();
          }
        );
      });
    },
  };

  const app = express();

  app.use('/graphql', (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Max-Age', '3600');
      next();
    });

  app.use('/graphql', (req, res, next) => {
      if (req.method === 'GET' || req.method === 'POST') {
        graphqlHTTP({
          schema,
          rootValue: root,
          graphiql: true,
        })(req, res, next);
      } else {
        res.status(200).send();
      }
    });

  app.listen(4000, () => {
    console.log('Running a GraphQL API server at http://localhost:4000/graphql');
  });

  module.exports = app;
