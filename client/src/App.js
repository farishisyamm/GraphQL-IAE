import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql} from "@apollo/client";
import "./App.css";

const GET_PINS = gql`
  query {
    pins {
      id
      imgSrc
      name
      link
      size
    }
  }
`;

function Pin({ pinSize, imgSrc, name, link }) {
  return (
    <div className={`pin ${pinSize}`}>
      <img src={imgSrc} alt="" className="mainPic" />
      <div className="content">
        <h3>{name}</h3>
        <div className="search">
          <a href={link}>
          <img 
          src="https://www.iconpacks.net/icons/1/free-icon-click-1302.png"
          alt="click this"
          width="25" height="25"
          />
          <img 
            src="https://cdn.pixabay.com/photo/2012/04/11/12/01/display-27766_960_720.png"
            alt="click this"
            width="40" height="40"
          />
          </a>
        </div>
      </div>
    </div>
    
  );
}

function App() {
  const { loading, error, data } = useQuery(GET_PINS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div className="App">
      <main>
        <div className="mainContainer">
          {data.pins.map(({ id, imgSrc, name, link, size }) => (
            <Pin
              key={id}
              imgSrc={imgSrc}
              name={name}
              link={link}
              pinSize={size}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

function WrappedApp() {
  return (
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>
  );
}
export default WrappedApp;
