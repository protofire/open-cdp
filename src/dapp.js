import React, { Component } from "react";
import { ThemeProvider } from "styled-components";
import { CSSTransitionGroup } from "react-transition-group";
import Maker from "@makerdao/dai";

import web3Checker, { Web3States } from "./utils/check-web3";
import theme from "./utils/theme";
import formatNumber from "./utils/format-number";
import {
  Layout,
  Header,
  Main,
  Footer,
  Github,
  Protofire,
  Section,
  Block,
  HelpIcon,
  SetMaxEth,
  Button,
  Slider,
  TokenIconWrapper,
  IconDAI,
  IconETH,
  DollarSign,
  Address,
  WalletCdpsTable,
  ToggleOptions,
  WizardNumberInput,
  Modal,
  Dialog,
  CancelDialogButton,
  AcceptDialogButton,
  HelpPopup
} from "./components/Styled";
import { NoWeb3Screen, NoAccountScreen } from "./components/WalletCheckScreens";

class DApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3Status: Web3States.NoWeb3,
      ...this.emptyInitialState(),
      ...this.mockedStateValues()
    };

    this.state.liquidationPrice = this.getLiquidationPrice();

    this.wizardEthRef = React.createRef();

    this.maker = Maker.create("test");
  }

  emptyInitialState = () => ({
    ethPrice: -1,
    // maker
    daiPrice: -1,
    totalCdps: -1,
    totalDaiSupply: -1,
    totalEthLockedUp: -1,
    // wallet
    walletAddress: "",
    walletDai: -1,
    walletEth: -1,
    // wizard
    eth: "",
    dai: "",
    leverage: -1,
    safety: -1,
    liquidationPrice: -1,
    // flags
    loadingData: false,
    showAdvanced: false,
    showDialogTx: false,
    showWaitingAction: false,
    showMiningNotice: false,
    showComingSoonModal: false,
    showHelp: ""
  });

  mockedStateValues = () => ({
    ethPrice: 420.64,
    // maker
    daiPrice: 1.02,
    totalCdps: 105232,
    totalDaiSupply: 2129501294,
    totalEthLockedUp: 4919825,
    // wallet
    walletAddress: "...",
    walletDai: 234,
    walletEth: 0.7132,
    walletCdps: this.getWalletCdps(),
    // wizard
    eth: "",
    dai: "",
    leverage: (4 / 3).toFixed(3),
    safety: 50,
    liquidationPrice: "",
    // TX
    currentTx: "0x0000000000000000000000000000000000000000000000000000000000000000"
  });

  componentDidMount() {
    // web3Checker().then(web3Status => this.setState({ web3Status }));
    this.checkWeb3().then(() => {
      this.makerAttachEvents();
    });
  }

  checkWeb3 = async () => {
    const web3Status = await web3Checker();
    this.setState({ web3Status });
  };

  makerAttachEvents = () => {
    const { Web3States } = this;

    this.maker.on("web3/AUTHENTICATED", eventObj => {
      const { account } = eventObj.payload;
      this.setState({
        walletAddress: account
      });
    });

    this.maker.on("web3/DEAUTHENTICATED", () => {
      this.setState({ walletAddress: '...' });
      return this.checkWeb3();
    });

    this.maker.on("web3/DISCONNECTED", () => {
      this.setState({ web3Status: Web3States.NoWeb3 });
      return this.checkWeb3();
    });
  };

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

  getWalletCdps = () => [
    {
      id: 123,
      borrowedDai: 230.876,
      lockedEth: 1.923,
      liquidationPrice: 390.893
    },
    {
      id: 133,
      borrowedDai: 376,
      lockedEth: 2.567,
      liquidationPrice: 400.123
    },
    {
      id: 135,
      borrowedDai: 50,
      lockedEth: 0.134,
      liquidationPrice: 251.785
    },
    {
      id: 189,
      borrowedDai: 8970.897,
      lockedEth: 38.343,
      liquidationPrice: 356.98
    },
    {
      id: 235,
      borrowedDai: 230.876,
      lockedEth: 1.923,
      liquidationPrice: 390.893
    },
    {
      id: 267,
      borrowedDai: 376,
      lockedEth: 2.567,
      liquidationPrice: 400.123
    },
    {
      id: 342,
      borrowedDai: 50,
      lockedEth: 0.134,
      liquidationPrice: 251.785
    },
    {
      id: 346,
      borrowedDai: 8970.897,
      lockedEth: 38.343,
      liquidationPrice: 356.98
    }
  ];

  getLiquidationPrice = () => ((this.state.ethPrice * (100 - this.state.safety)) / 100).toFixed(2);

  toggleOptions = () => this.setState(prevState => ({ showAdvanced: !prevState.showAdvanced }));

  toggleDialog = () => this.setState(prevState => ({ showDialogTx: !prevState.showDialogTx }));

  toggleComingSoonModal = () =>
    this.setState(prevState => ({ showComingSoonModal: !prevState.showComingSoonModal }));

  showHelp = showHelp => this.setState({ showHelp });

  setMaxEth = () =>
    this.setState({ eth: this.state.walletEth }, () =>
      this.handleWizardChange("eth")(this.wizardEthRef)
    );

  createCdp = () => this.setState({ showDialogTx: true });

  confirmTx = () => {
    this.toggleDialog();
    this.setState({ showWaitingAction: true });
    setTimeout(() => this.setState({ showWaitingAction: false, showMiningNotice: true }), 8000);
    setTimeout(() => this.setState({ showMiningNotice: false, loadingData: true }), 18000);
    setTimeout(() => this.setState({ loadingData: false }), 28000);
  };

  render() {
    const {
      web3Status,
      walletCdps,
      ethPrice,
      daiPrice,
      totalCdps,
      totalDaiSupply,
      totalEthLockedUp,
      walletAddress,
      walletEth,
      walletDai,
      eth,
      dai,
      leverage,
      safety,
      liquidationPrice,
      currentTx,
      loadingData,
      showAdvanced,
      showDialogTx,
      showWaitingAction,
      showMiningNotice,
      showComingSoonModal,
      showHelp
    } = this.state;

    const ethInUsd = walletEth * ethPrice;
    const wizEthInUsd = eth * ethPrice;
    const createCdpDisabled = !(eth || dai) || eth > walletEth;
    const noEnoughEth = eth > walletEth;
    const LS = "...";

    return (
      <ThemeProvider theme={theme}>
        <Layout>
          <Header>
            <h1>Borrow money using cryptocurrency as collateral</h1>
            <h4>This is a demo DApp. Data is faked, formulas are real.</h4>
          </Header>
          <Main>
            {web3Status === Web3States.NoWeb3 && <NoWeb3Screen />}
            {web3Status === Web3States.NoAccount && <NoAccountScreen />}
            {web3Status === Web3States.OK && (
              <React.Fragment>
                <Section>
                  <h2>My Wallet</h2>
                  <Address>Your address: {walletAddress || "-"}</Address>
                  <Block>
                    <TokenIconWrapper>
                      {walletDai > -1 ? formatNumber(walletDai) : LS} DAI <IconDAI />
                    </TokenIconWrapper>
                    <TokenIconWrapper>
                      {walletEth > -1 ? formatNumber(walletEth) : LS} ETH <IconETH />{" "}
                      <i className="eth-in-usd">({formatNumber(ethInUsd, 2, 2)} U$D)</i>
                    </TokenIconWrapper>
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
                            <p>
                              This is the amount of ETH you should lock up in order to borrow DAIs.
                            </p>
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
                          min={0.01}
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
                        <span>{formatNumber(wizEthInUsd, 2, 2)} U$D</span>
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

                  <CSSTransitionGroup
                    transitionName="advanced-options"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                  >
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
                                {safety > -1 ? safety : 50}
                                <i>%</i>
                              </span>
                            </div>
                            <Slider
                              name="Safety"
                              value={safety > -1 ? safety : 50}
                              onChange={this.handleWizardChange("safety")}
                              min="0"
                              max="100"
                              step={1}
                            />
                            <div className="safety-points">
                              <span>Low</span>
                              <span>Mid</span>
                              <span>High</span>
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
                                  <p>
                                    CDP ratio between ETH and DAI. Another way of manage safety.
                                  </p>
                                </HelpPopup>
                              )}
                            </div>
                            <div>
                              <WizardNumberInput
                                name="Leverage"
                                value={leverage > -1 ? leverage : ""}
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
                  </CSSTransitionGroup>

                  <Block>
                    <p className="textual">
                      CDP liquidation would start if ETH goes below{" "}
                      <span>U$D {liquidationPrice > -1 ? liquidationPrice : LS}</span> (-{safety >
                      -1
                        ? safety
                        : LS}%). You can borrow up to <span>{dai || LS}</span> DAI
                    </p>
                  </Block>

                  <Block>
                    <Button
                      type="button"
                      disabled={createCdpDisabled}
                      onClick={() => this.createCdp()}
                    >
                      Create CDP
                    </Button>
                    <ToggleOptions onClick={() => this.toggleOptions()}>
                      {showAdvanced ? "▲ Basic" : "▼ Advanced"}
                    </ToggleOptions>
                  </Block>
                </Section>

                <Section>
                  <h2>My CDPs</h2>
                  <Block>
                    {!walletCdps && <span className="no-cdps-found">No CDPs found</span>}
                    {walletCdps && (
                      <WalletCdpsTable>
                        <thead>
                          <tr>
                            <th>CDP ID</th>
                            <th>Borrowed DAI</th>
                            <th>Locked ETH</th>
                            <th>Liquidation Price</th>
                            <th>Manage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {walletCdps.map(cdp => {
                            const disabled = cdp.id % 3;
                            return (
                              <tr key={cdp.id}>
                                <td>{cdp.id}</td>
                                <td>{formatNumber(cdp.borrowedDai, 3, 3)}</td>
                                <td>{formatNumber(cdp.lockedEth, 3, 3)}</td>
                                <td>
                                  <DollarSign /> {formatNumber(cdp.liquidationPrice, 3, 3)}
                                </td>
                                <td>
                                  <button onClick={() => this.toggleComingSoonModal()}>
                                    Repay
                                  </button>
                                  <button
                                    onClick={() => this.toggleComingSoonModal()}
                                    disabled={disabled}
                                  >
                                    Free
                                  </button>
                                  <button
                                    onClick={() => this.toggleComingSoonModal()}
                                    disabled={disabled}
                                  >
                                    Draw
                                  </button>
                                  <button
                                    onClick={() => this.toggleComingSoonModal()}
                                    disabled={disabled}
                                  >
                                    Wipe
                                  </button>
                                  <button onClick={() => this.toggleComingSoonModal()}>Shut</button>
                                  <button onClick={() => this.toggleComingSoonModal()}>Give</button>
                                  <button
                                    onClick={() => this.toggleComingSoonModal()}
                                    disabled={disabled}
                                  >
                                    Bite
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </WalletCdpsTable>
                    )}
                  </Block>
                </Section>

                <Section className="general-info">
                  <div>
                    <span>
                      <DollarSign /> {ethPrice > -1 ? formatNumber(ethPrice) : LS}
                    </span>
                    <span>ETH price</span>
                  </div>
                  <div>
                    <span>
                      <DollarSign /> {daiPrice > -1 ? formatNumber(daiPrice) : LS}
                    </span>
                    <span>DAI price</span>
                  </div>
                  <div>
                    <span>{totalCdps > -1 ? formatNumber(totalCdps, 0) : LS}</span>
                    <span>Total CDPs</span>
                  </div>
                  <div>
                    <TokenIconWrapper>
                      <IconDAI /> {totalDaiSupply > -1 ? formatNumber(totalDaiSupply, 3, 3) : LS}
                    </TokenIconWrapper>
                    <span>Total DAI supply</span>
                  </div>
                  <div>
                    <TokenIconWrapper>
                      <IconETH />{" "}
                      {totalEthLockedUp > -1 ? formatNumber(totalEthLockedUp, 3, 3) : LS}
                    </TokenIconWrapper>
                    <span>Total ETH locked up</span>
                  </div>
                </Section>

                {showDialogTx && (
                  <Modal>
                    <Dialog>
                      <h3>Confirm CDP creation?</h3>
                      <p>
                        You are going to lock up <span>{eth} ETH</span> and receive{" "}
                        <span>{dai} DAI</span>.
                      </p>
                      <p>Are you sure you want to proceed with this transaction?</p>
                      <div className="buttons">
                        <CancelDialogButton onClick={() => this.toggleDialog()}>
                          Cancel
                        </CancelDialogButton>
                        <AcceptDialogButton onClick={() => this.confirmTx()}>
                          Accept
                        </AcceptDialogButton>
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
                      <p>You can track it with its hash: </p>
                      <p>
                        <a
                          href={`https://etherscan.io/tx/${currentTx}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View TX on etherscan.io"
                          className="tx-etherscan"
                        >
                          {currentTx}
                        </a>
                      </p>
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

                {showComingSoonModal && (
                  <Modal>
                    <Dialog>
                      <h3>Coming Soon!</h3>
                      <p>This feature will be available in future releases.</p>
                      <img
                        className="coming-soon"
                        src="/images/coming-soon.svg"
                        alt="Coming Soon"
                      />
                      <div className="buttons">
                        <CancelDialogButton onClick={() => this.toggleComingSoonModal()}>
                          Close
                        </CancelDialogButton>
                      </div>
                    </Dialog>
                  </Modal>
                )}
              </React.Fragment>
            )}
          </Main>

          <Footer>
            <p>
              Open Source <Github />. Made with <span>❤</span> by <Protofire />.
            </p>
          </Footer>
        </Layout>
      </ThemeProvider>
    );
  }
}

export default DApp;
