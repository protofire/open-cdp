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
  HelpIcon,
  SetMaxEth,
  Button,
  Slider,
  Address,
  ToggleOptions,
  WizardNumberInput,
  Modal,
  Dialog,
  CancelDialogButton,
  AcceptDialogButton,
  HelpPopup
} from "./components";
import { NoWeb3 } from "./components/static";


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

    this.wizardEthRef = React.createRef();
  }

  constants = {
    defaultLeverage: 1.165,
    minSecurityPercent: 150
  };

  emptyInitialState = {
    ethPrice: 420.64,
    // ethPrice: web3.toBigNumber(420.64),
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
    leverage: (4 / 3).toFixed(3),
    safety: 50,
    liquidationPrice: "",
    // flags
    loadingData: false,
    showAdvanced: false,
    showDialogTx: false,
    showWaitingAction: false,
    showMiningNotice: false,
    showHelp: ""
  };

  getLiquidationPrice = () => ((this.state.ethPrice * (100 - this.state.safety)) / 100).toFixed(2);

  handleWizardChange = name => async eventOrNode => {
    const { value } = eventOrNode.target || eventOrNode;
    await this.setState({ [name]: value });

    const { ethPrice, walletEth } = this.state;

    let { eth, dai, leverage, safety } = this.state;

    if (name !== "eth" && !eth) {
      eth = walletEth;
    }

    const getDaiAmount = leverage => (eth * ethPrice * (leverage - 1)).toFixed(2);

    switch (name) {
      case "eth":
        if (eth < 0) {
          eth = 0;
        }
        dai = (eth * ethPrice * (leverage - 1)).toFixed(2);
        break;
      case "dai":
        if (dai < 0) {
          dai = 0;
        }
        eth = dai === "" ? "" : (dai / ethPrice / (leverage - 1)).toFixed(6);
        break;
      case "leverage":
        safety = Math.round(-150 * leverage + 250);
        dai = getDaiAmount(leverage);
        break;
      case "safety":
        leverage = ((-2 / 300) * safety + 5 / 3).toFixed(3);
        dai = getDaiAmount(leverage);
        break;
      default:
        break;
    }

    const liquidationPrice = this.getLiquidationPrice();

    await this.setState({ eth, dai, leverage, safety, liquidationPrice });
  };

  showHelp = showHelp => this.setState({ showHelp });

  setMaxEth = () =>
    this.setState({ eth: this.state.walletEth }, () =>
      this.handleWizardChange("eth")(this.wizardEthRef)
    );

  toggleOptions = () => this.setState(prevState => ({ showAdvanced: !prevState.showAdvanced }));

  toggleDialog = () => this.setState(prevState => ({ showDialogTx: !prevState.showDialogTx }));

  createCdp = () => this.setState({ showDialogTx: true });

  confirmTx = () => {
    this.toggleDialog();
    this.setState({ showWaitingAction: true });
    setTimeout(() => this.setState({ showWaitingAction: false, showMiningNotice: true }), 8000);
    setTimeout(() => this.setState({ showMiningNotice: false, loadingData: true }), 18000);
    setTimeout(() => this.setState({ loadingData: false }), 28000);
  };

  render() {
    // if (!window.web3) {
    //   return <NoWeb3 />
    // }

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
      loadingData,
      showAdvanced,
      showDialogTx,
      showWaitingAction,
      showMiningNotice,
      showHelp
    } = this.state;
    const ethInUsd = walletEth * ethPrice;
    const wizEthInUsd = eth * ethPrice;
    const createCdpDisabled = !(eth && dai);
    const noEnoughEth = eth > walletEth;

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
                  <i className="eth-in-usd">({formatNumber(ethInUsd, 2)} U$D)</i>
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
                    <HelpIcon
                      onMouseMove={() => this.showHelp("ethToLockUp")}
                      onMouseOut={() => this.showHelp("")}
                    >
                      ?
                    </HelpIcon>
                    {showHelp === "ethToLockUp" && (
                      <HelpPopup>
                        <p>This is the amount of ETH you should lock up in order to borrow DAIs.</p>
                      </HelpPopup>
                    )}
                    <SetMaxEth onClick={() => this.setMaxEth()}>set max</SetMaxEth>
                  </div>
                  <div>
                    <WizardNumberInput
                      name="Eth"
                      value={eth}
                      placeholder="0.00"
                      step={0.0001}
                      className={noEnoughEth ? "redText" : ""}
                      onChange={this.handleWizardChange("eth")}
                      innerRef={el => {
                        this.wizardEthRef = el;
                      }}
                    />
                    <span>ETH</span>
                  </div>
                  <div>
                    <span>min 0.01 ETH</span>
                    <span>{formatNumber(wizEthInUsd)} U$D</span>
                  </div>
                </label>

                <label htmlFor="dai">
                  <div>
                    <span>DAI to get</span>
                    <HelpIcon
                      onMouseMove={() => this.showHelp("daiToGet")}
                      onMouseOut={() => this.showHelp("")}
                    >
                      ?
                    </HelpIcon>
                    {showHelp === "daiToGet" && (
                      <HelpPopup>
                        <p>
                          This is the total DAIs you can get by creating a new CDP with current
                          settings.
                        </p>
                      </HelpPopup>
                    )}
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
                        <HelpIcon
                          onMouseMove={() => this.showHelp("safety")}
                          onMouseOut={() => this.showHelp("")}
                        >
                          ?
                        </HelpIcon>
                        {showHelp === "safety" && (
                          <HelpPopup>
                            <p>% ETH needs to fall by to be liquidated.</p>
                          </HelpPopup>
                        )}
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
                        <HelpIcon
                          onMouseMove={() => this.showHelp("leverage")}
                          onMouseOut={() => this.showHelp("")}
                        >
                          ?
                        </HelpIcon>
                        {showHelp === "leverage" && (
                          <HelpPopup>
                            <p>CDP ratio between ETH and DAI. Another way of manage safety.</p>
                          </HelpPopup>
                        )}
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
                  }%). You can borrow up to <span>{dai || "0"}</span> DAI
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
            <Modal>
              <Dialog>
                <h3>Confirm CDP creation?</h3>
                <p>
                  You are going to lock up <span>{eth} ETH</span> and receive <span>{dai} DAI</span>.
                </p>
                <p>Are you sure you want to proceed with this transaction?</p>
                <div className="buttons">
                  <CancelDialogButton onClick={() => this.toggleDialog()}>
                    Cancel
                  </CancelDialogButton>
                  <AcceptDialogButton onClick={() => this.confirmTx()}>Accept</AcceptDialogButton>
                </div>
              </Dialog>
            </Modal>
          )}

          {showWaitingAction && (
            <Modal>
              <Dialog>
                <h3>Waiting...</h3>
                <p>Please accept pending transaction on your wallet.</p>
                <img src="/images/waiting-coin.svg" alt="Waiting" />
              </Dialog>
            </Modal>
          )}

          {showMiningNotice && (
            <Modal>
              <Dialog>
                <h3>Creating CDP!</h3>
                <p>Your CDP creation transaction is in progress on the blockchain.</p>
                <p>Please be patient till it finishes, shouldn't take too long.</p>
                <img src="/images/working-gears.svg" alt="Mining" />
              </Dialog>
            </Modal>
          )}

          {loadingData && (
            <Modal>
              <Dialog>
                <h3>Loading...</h3>
                <p>Your new CDP has been created!</p>
                <p>Now please wait while new data is being loaded.</p>
                <img src="/images/loading-coffee.svg" alt="Loading" />
              </Dialog>
            </Modal>
          )}
        </Layout>
      </ThemeProvider>
    );
  }
}

export default Dapp;
