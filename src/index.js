import React from "react";
import ReactDOM from "react-dom";
import DApp from "./dapp";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<DApp />, document.getElementById("root"));
registerServiceWorker();
