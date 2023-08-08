import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Body from "./Component/body/Body";
import Footer from "./Component/Footer/Footer";
import NavBar from "./Component/NavBar/NavBar";
import { Session } from "./Context/Session";
import Chat from "./Component/Chat/Chat";

function App() {
  return (
    <Session>
      <Router>
        <div>
          <div className="body-container">
            <NavBar />
            <Body />
            <Footer />
          </div>
        </div>
      </Router>
      <Chat />
    </Session>
  );
}

export default App;
