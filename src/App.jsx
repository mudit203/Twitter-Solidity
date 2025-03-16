import React from "react";
import TweetComponent from "./TweetComponent";
import ConnectWallet from "./ConnectWallet";

const App = () => {
  return (
    <div>
      <h1>Twitter Contract DApp</h1>
      <ConnectWallet />
      <TweetComponent />
    </div>
  );
};

export default App;
