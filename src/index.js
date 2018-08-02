import React from "react";
import ReactDOM from "react-dom";
import Dapp from "./dapp";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<Dapp />, document.getElementById("root"));
registerServiceWorker();
