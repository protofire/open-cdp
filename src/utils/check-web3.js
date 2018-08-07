import Web3 from "web3";

export default (async function() {
  if (!window.web3) {
    return "noWeb3";
  }

  const web3 = new Web3(window.web3.currentProvider);
  const accounts = await web3.eth.getAccounts();
  if (!accounts || !accounts.length) {
    return "noAccount";
  }

  return "ok";
});
