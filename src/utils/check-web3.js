import Web3 from "web3";

export const Web3States = {
  NoWeb3: "noWeb3",
  NoAccount: "noAccount",
  OK: "Ok"
};

export default (async function() {
  if (!window.web3 || !window.web3.eth) {
    return Web3States.NoWeb3;
  }

  const web3 = new Web3(window.web3.currentProvider);
  const accounts = await web3.eth.getAccounts();
  if (!accounts || !accounts.length) {
    return Web3States.NoAccount;
  }

  return Web3States.OK;
});
