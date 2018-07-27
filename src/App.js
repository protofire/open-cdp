import React, { Component } from "react";
import styled from "styled-components";

const Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  min-height: 100vh;
`;

class App extends Component {
  render() {
    return (
      <Layout>
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </Layout>
    );
  }
}

export default App;
