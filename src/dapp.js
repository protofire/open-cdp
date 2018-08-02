import React, { Component } from "react";
import { ThemeProvider } from "styled-components";
// import Maker from "@makerdao/makerdao-exchange-integration";

import theme from "./utils/theme";
import formatNumber from "./utils/format-number";
import {
  Layout,
  Header,
  Main,
  Footer,
  Github,
  Section,
  Block,
  Help,
  Button,
  Slider,
  Address,
  ToggleOptions,
  WizardNumberInput,
  ConfirmTx,
  Waiting,
  Mining,
  Loading
} from "./components";

class Dapp extends Component {
  constructor(props) {
    super(props);

    this.state = this.emptyInitialState;

    this.state.liquidationPrice = this.getLiquidationPrice();

    // const maker = new Maker("kovan", {
    //   privateKey: "0x1619221769eddcf59e23d81b66b915375724460717ccf57b6cd94fe5e4fae6f9",
    //   provider: {
    //     infuraApiKey: "114062d9830945bab907936452cc21f7"
    //   }
    // });
    //
    // maker.on("web3/INITIALIZED", eventObj => {
    //   const {
    //     provider: { type, url }
    //   } = eventObj.payload;
    //   console.log("web3/INITIALIZED", type, url);
    // });
    //
    // maker.on("web3/CONNECTED", eventObj => {
    //   const { api, network, node } = eventObj.payload;
    //   console.log("web3/CONNECTED", api, network, node);
    // });
    //
    // maker.on("web3/AUTHENTICATED", eventObj =>
    //   console.log("web3 authenticated with account", eventObj.payload.account)
    // );
    //
    // maker.on("web3/DEAUTHENTICATED", () => console.log("web3/DEAUTHENTICATED"));
    //
    // maker.on("web3/DISCONNECTED", () => console.log("web3/DISCONNECTED"));
    //
    // maker.on("price/ETH_USD", eventObj => {
    //   const { price } = eventObj.payload;
    //   console.log("ETH price changed to", price);
    // });
    //
    // maker.on("price/MKR_USD", eventObj => {
    //   const { price } = eventObj.payload;
    //   console.log("MKR price changed to", price);
    // });
    //
    // maker.on("price/WETH_PETH", eventObj => {
    //   const { ratio } = eventObj.payload;
    //   console.log("WETH ratio changed to", ratio);
    // });

    // const price = maker.service('price');
    // console.log(price);
    // (async () => {
    //   const ethPrice = await price.getEthPrice();
    //   console.log(ethPrice);
    // })();
  }

  constants = {
    defaultLeverage: 1.165,
    minSecurityPercent: 150
  };

  emptyInitialState = {
    ethPrice: 420.64,
    // maker
    daiPrice: 1.02,
    totalCdps: 105232,
    totalDaiSupply: 2129501294,
    totalEthLockedUp: 4919825,
    // wallet
    walletAddress: "0x7557F009a3F16ebBeDC469515D3dAC5CbE9C3939",
    walletDai: 234,
    walletEth: 0.7132,
    walletPeth: 34,
    // wizard
    eth: "",
    dai: "",
    leverage: "",
    safety: 50,
    liquidationPrice: "",
    // flags
    loadingData: false,
    showAdvanced: true,
    showDialogTx: false,
    showWaitingAction: false,
    showMiningNotice: false
  };

  getLiquidationPrice = () => ((this.state.ethPrice * this.state.safety) / 100).toFixed(2);

  handleWizardChange = name => async event => {
    const { value } = event.target;
    await this.setState({ [name]: value });

    const { walletEth } = this.state;

    let { eth, dai, leverage, safety } = this.state;

    if (!eth) {
      eth = walletEth;
    }

    switch (name) {
      case "eth":
        break;
      case "dai":
        break;
      case "leverage":
        safety = Math.round(-150 * leverage + 250);
        break;
      case "safety":
        leverage = (-0.006666667 * safety + 1.666667).toFixed(3);
        break;
      default:
        break;
    }

    if (name === "leverage" || name === "safety") {
      dai = (Math.exp(0.0954735 * safety) * eth).toFixed(2);
    }

    const liquidationPrice = this.getLiquidationPrice();

    await this.setState({ eth, dai, leverage, safety, liquidationPrice });
  };

  createCdp = () => this.setState({ showDialogTx: true });

  toggleOptions = () => this.setState(prevState => ({ showAdvanced: !prevState.showAdvanced }));

  toggleDialog = () => this.setState(prevState => ({ showDialogTx: !prevState.showDialogTx }));

  confirmTx = () => {
    this.toggleDialog();
    this.setState({ showWaitingAction: true });
    setTimeout(() => this.setState({ showWaitingAction: false, showMiningNotice: true }), 6000);
    setTimeout(() => this.setState({ showMiningNotice: false, loadingData: true }), 15000);
    setTimeout(() => this.setState({ loadingData: false }), 25000);
  };

  render() {
    const {
      ethPrice,
      daiPrice,
      totalCdps,
      totalDaiSupply,
      totalEthLockedUp,
      walletAddress,
      walletEth,
      walletDai,
      walletPeth,
      eth,
      dai,
      leverage,
      safety,
      liquidationPrice,
      // loadingData,
      loadingData,
      showAdvanced,
      showDialogTx,
      showWaitingAction,
      showMiningNotice
    } = this.state;
    const ethInUsd = walletEth * ethPrice;
    const wizEthInUsd = eth * ethPrice;
    const createCdpDisabled = !(eth && dai);

    return (
      <ThemeProvider theme={theme}>
        <Layout>
          <Header>
            <h1>OpenCDP</h1>
          </Header>
          <Main>
            <Section>
              <h2>My Wallet</h2>
              <Address>Your address: {walletAddress || "-"}</Address>
              <Block>
                <span>{walletDai ? formatNumber(walletDai) : "-"} DAI</span>
                <span>
                  {walletEth ? formatNumber(walletEth) : "-"} ETH{" "}
                  <i className="eth-in-usd">({formatNumber(ethInUsd)} U$D)</i>
                </span>
                <span>{walletPeth ? formatNumber(walletPeth) : "-"} PETH</span>
              </Block>
            </Section>

            <Section>
              <h2>New CDP</h2>
              <Block>
                <label htmlFor="eth">
                  <div>
                    <span>ETH to lock up</span>
                    <Help>?</Help>
                  </div>
                  <div>
                    <WizardNumberInput
                      name="Eth"
                      value={eth}
                      placeholder="0.00"
                      step={0.0001}
                      onChange={this.handleWizardChange("eth")}
                    />
                    <span>ETH</span>
                  </div>
                  <div>
                    <span>min 0.01ETH</span>
                    <span>{formatNumber(wizEthInUsd)} U$D</span>
                  </div>
                </label>

                <label htmlFor="dai">
                  <div>
                    <span>DAI to get</span>
                    <Help>?</Help>
                  </div>
                  <div>
                    <WizardNumberInput
                      name="Dai"
                      value={dai}
                      placeholder="0.00"
                      step={0.01}
                      onChange={this.handleWizardChange("dai")}
                    />
                    <span>DAI</span>
                  </div>
                </label>
              </Block>

              {showAdvanced && (
                <Block>
                  <div>
                    <label htmlFor="safety">
                      <div>
                        <span>Safety</span>
                        <Help>?</Help>
                        <span className="safety-percent">
                          {safety}
                          <i>%</i>
                        </span>
                      </div>
                      <Slider
                        name="Safety"
                        value={safety}
                        onChange={this.handleWizardChange("safety")}
                        min="0"
                        max="100"
                        step={1}
                      />
                      <div className="safety-points">
                        <span>Unsafe</span>
                        <span>Mid Safe</span>
                        <span>Very Safe</span>
                      </div>
                    </label>
                  </div>
                  <div>
                    <label htmlFor="leverage">
                      <div>
                        <span>Leverage</span>
                        <Help>?</Help>
                      </div>
                      <div>
                        <WizardNumberInput
                          name="Leverage"
                          value={leverage}
                          placeholder="-"
                          min={1}
                          max={5 / 3}
                          step={0.001}
                          onChange={this.handleWizardChange("leverage")}
                        />
                        <span>X</span>
                      </div>
                    </label>
                  </div>
                </Block>
              )}

              <Block>
                <p className="textual">
                  CDP liquidation would start if ETH goes below <span>{liquidationPrice}</span> (-{
                    safety
                  }%). You can borrow up to <span>{dai}</span> DAI
                </p>
              </Block>

              <Block>
                <Button type="button" disabled={createCdpDisabled} onClick={() => this.createCdp()}>
                  Create CDP
                </Button>
                <ToggleOptions onClick={() => this.toggleOptions()}>
                  {showAdvanced ? "Basic" : "Advanced"} options
                </ToggleOptions>
              </Block>
            </Section>

            <Section>
              <h2>My CDPs</h2>
              <Block>
                <span className="no-cdps-found">No CDPs found</span>
              </Block>
            </Section>
          </Main>
          <Footer>
            <div>
              <div>
                <span>{ethPrice}</span>
                <span>ETH price</span>
              </div>
              <div>
                <span>{daiPrice}</span>
                <span>DAI price</span>
              </div>
              <div>
                <span>{totalCdps}</span>
                <span>Total CDPs</span>
              </div>
              <div>
                <span>{totalDaiSupply}</span>
                <span>Total DAI supply</span>
              </div>
              <div>
                <span>{totalEthLockedUp}</span>
                <span>Total ETH locked up</span>
              </div>
            </div>
            <p>
              OSS made with <span>❤</span> over all around the world. <Github />
            </p>
          </Footer>

          {showDialogTx && (
            <ConfirmTx
              data={{
                eth,
                dai,
                confirmTx: () => this.confirmTx(),
                toggleDialog: () => this.toggleDialog()
              }}
            />
          )}

          {showWaitingAction && <Waiting />}
          {showMiningNotice && <Mining />}
          {loadingData && <Loading />}
        </Layout>
      </ThemeProvider>
    );
  }
}

export default Dapp;
