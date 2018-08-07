import React, { Component } from 'react';
import NoConnection from './components/NoConnection';
import AboutModal from './components/modals/AboutModal';
import Modal from './components/modals/Modal';
import ConfirmationModal from './components/modals/ConfirmationModal';
import AuthSuccessModal from './components/modals/AuthSuccessModal';
import OnboardingModal from './components/modals/OnboardingModal';
import SecurityModal from './components/modals/SecurityModal'
import CupHistoryModal from './components/modals/CupHistoryModal';
import Borrow from './components/Borrow';
import BorrowSmall from './components/BorrowSmall';
import MyWallet from './components/MyWallet';
import Stats from './components/cdpStats';
import Cups from './components/Cups';
import CupsSmall from './components/CupsSmall';
import NavBar from './components/NavBar';
import { web3 } from './components/Wallet';
import { initWeb3Ledger } from './web3';
import ReactNotify from './notify';
import api from './api.js';
import { WAD, toBytes32, addressToBytes32, fromRaytoWad, wmul, wdiv, etherscanTx, printNumber } from './helpers';
import './App.css';

const settings = require('./settings');

const easyCDPManager = require('./abi/cdp');
const ethLocker = require('./abi/ethLocker');
const repay = require('./abi/repay');
const tub = require('./abi/saitub');
const top = require('./abi/saitop');
const tap = require('./abi/saitap');
const vox = require('./abi/saivox');
const dsproxyfactory = require('./abi/dsproxyfactory');
const dsproxy = require('./abi/dsproxy');
const dsethtoken = require('./abi/dsethtoken');
const dstoken = require('./abi/dstoken');
const dsvalue = require('./abi/dsvalue');

class App extends Component {
  constructor() {
    super();
    const initialState = this.getInitialState();
    this.state = {
      ...initialState,
      network: {},
      profile: {
        stabilityDebt: -1,
        pethLocked: web3.toBigNumber(-1),
        extraEth: -1,
        cdpId: -1,
        isOwner: null,
        securityEnabled: false,
        mode: localStorage.getItem('mode') || 'account',
        proxy: null,
        activeProfile: null,
        accountBalance: web3.toBigNumber(-1),
      },
      transactions: {},
      termsModal: {
        announcement: true,
        terms: true,
        video: true,
      },
      authSuccessModal: {
        show: false
      },
      onboardingModal: {
        show: false
      },
      aboutModal: {
        show: false
      },
      disclaimerModal: {
        show: false
      },
      confirmationModal: {
        show: false
      },
      securityModal: {
        show: false
      },
      videoModal: {
        show: false
      },
      terminologyModal: {
        show: false
      },
      cupHistoryModal: {
        show: false
      },
      modal: {
        show: false
      },
      params: ''
    }
  }

  getInitialState = () => {
    return {
      system: {
        gasPrice: null,
        cdpManager: {
          transfering: false,
          leverage: 0,
          mode: 'borrow',
          cup: {},
          cupLoading: true,
          repayDai: 0,
          repayLeverage: 0.0,
          repayFee: 0.0,
        },
        tub: {
          address: null,
          authority: null,
          eek: 'undefined',
          safe: 'undefined',
          off: -1,
          out: -1,
          axe: web3.toBigNumber(-1),
          mat: web3.toBigNumber(-1),
          cap: web3.toBigNumber(-1),
          fit: web3.toBigNumber(-1),
          tax: web3.toBigNumber(-1),
          fee: web3.toBigNumber(-1),
          chi: web3.toBigNumber(-1),
          rhi: web3.toBigNumber(-1),
          rho: web3.toBigNumber(-1),
          gap: web3.toBigNumber(-1),
          tag: web3.toBigNumber(-1),
          per: web3.toBigNumber(-1),
          avail_boom_skr: web3.toBigNumber(-1),
          avail_boom_dai: web3.toBigNumber(-1),
          avail_bust_skr: web3.toBigNumber(-1),
          avail_bust_dai: web3.toBigNumber(-1),
          cups: {},
          totalCDPs: -1,
          // cupsList: localStorage.getItem('cupsList') || 'mine',
          cupsList: 'mine',
          cupsLoading: true,
          cupsCount: 0,
          cupsPage: 1,
          ownCup: false,
        },
        top: {
          address: null,
        },
        tap: {
          address: null,
          fix: web3.toBigNumber(-1),
          gap: web3.toBigNumber(-1),
        },
        vox: {
          address: null,
          era: web3.toBigNumber(-1),
          tau: web3.toBigNumber(-1),
          par: web3.toBigNumber(-1),
          way: web3.toBigNumber(-1),
        },
        pit: {
          address: null,
        },
        gem: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          tubBalance: web3.toBigNumber(-1),
          tapBalance: web3.toBigNumber(-1),
          tubApproved: -1,
          tapApproved: -1,
        },
        gov: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          pitBalance: web3.toBigNumber(-1),
          tubApproved: -1,
        },
        skr: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          tubBalance: web3.toBigNumber(-1),
          tapBalance: web3.toBigNumber(-1),
          tubApproved: -1,
          tapApproved: -1,
        },
        dai: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          myBalance: web3.toBigNumber(-1),
          tapBalance: web3.toBigNumber(-1),
          tubApproved: -1,
          tapApproved: -1,
          cdpManagerApproved: web3.toBigNumber(-1)
        },
        sin: {
          address: null,
          totalSupply: web3.toBigNumber(-1),
          tubBalance: web3.toBigNumber(-1),
          tapBalance: web3.toBigNumber(-1),
          // This field will keep an estimated value of new sin which is being generated due the 'stability/issuer fee'.
          // It will return to zero each time 'drip' is called
          issuerFee: web3.toBigNumber(0),
        },
        pip: {
          address: null,
          val: web3.toBigNumber(-1),
        },
        pep: {
          address: null,
          val: web3.toBigNumber(-1),
        },
        chartData: {
          ethusd: {},
          skreth: {},
          daiusd: {},
          ethdai: {},
        },
        stats: {
          error: false
        },
      },
    };
  }

  checkNetwork = () => {
    web3.version.getNode(error => {
      const isConnected = !error;

      // Check if we are synced
      if (isConnected) {
        web3.eth.getBlock('latest', (e, res) => {
          if (typeof (res) === 'undefined') {
            console.debug('YIKES! getBlock returned undefined!');
          }
          if (res.number >= this.state.network.latestBlock) {
            const networkState = { ...this.state.network };
            networkState.latestBlock = res.number;
            networkState.outOfSync = e !== null || ((new Date().getTime() / 1000) - res.timestamp) > 600;
            this.setState({ network: networkState });
          } else {
            // XXX MetaMask frequently returns old blocks
            // https://github.com/MetaMask/metamask-plugin/issues/504
            console.debug('Skipping old block');
          }
        });
      }

      // Check which network are we connected to
      // https://github.com/ethereum/meteor-dapp-wallet/blob/90ad8148d042ef7c28610115e97acfa6449442e3/app/client/lib/ethereum/walletInterface.js#L32-L46
      if (this.state.network.isConnected !== isConnected) {
        if (isConnected === true) {
          web3.eth.getBlock(0, (e, res) => {
            let network = false;
            if (!e) {
              switch (res.hash) {
                case '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9':
                  network = 'kovan';
                  break;
                case '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3':
                  network = 'main';
                  break;
                default:
                  console.log('setting network to private');
                  console.log('res.hash:', res.hash);
                  network = 'private';
              }
            }
            if (this.state.network.network !== network) {
              this.initNetwork(network);
            }
          });
        } else {
          const networkState = { ...this.state.network };
          networkState.isConnected = isConnected;
          networkState.network = false;
          networkState.latestBlock = 0;
          this.setState({ network: networkState });
        }
      }
    });
  }

  initNetwork = newNetwork => {
    this.checkAccounts();
    const networkState = { ...this.state.network };
    networkState.network = newNetwork;
    networkState.isConnected = true;
    networkState.latestBlock = 0;
    this.setState({ network: networkState });
  }

  checkAccounts = (checkAccountChange = true) => {
    window.web3.eth.getAccounts((error, accounts) => {
      if (!error) {
        const networkState = { ...this.state.network };
        networkState.accounts = accounts;
        const oldDefaultAccount = networkState.defaultAccount;
        networkState.defaultAccount = window.selectedAccount;
        web3.eth.defaultAccount = networkState.defaultAccount;
        this.setState({ network: networkState }, () => {
          if (checkAccountChange && oldDefaultAccount !== networkState.defaultAccount) {
            this.initContracts(settings.chain[this.state.network.network].top);
            // this.initContracts(this.state.system.top.address);
            this.initCDPManager();
          }
        });
      }
    });
  }

  componentDidMount = () => {
    setTimeout(this.init, 500);
  }

  initSecurity = () => {
    let updateSecurityStatus = (status) => {
      this.setState((prevState, props) => {
        let profile = prevState.profile;
        profile.securityEnabled = status.securityEnabled;
        return { profile }
      })
    }
    api.subscribe(this.state.profile.activeProfile, updateSecurityStatus);
    // this.handleOpenAuthModal();
  }

  generateSecurityCode = (callback) => {
    api.generateSecurityCode(this.state.profile.activeProfile, callback);
  }

  setPhoneNumber = (phone, token, callback) => {
    api.setPhoneNumber(this.state.profile.activeProfile, phone, token, callback);
  }

  validateSecurityCode = (code, callback) => {
    api.validateSecurityCode(this.state.profile.activeProfile, code, callback);
  }

  validateTempSecurityCode = (code, callback) => {
    api.validateTempSecurityCode(this.state.profile.activeProfile, code, callback);
  }

  testWeb3Client = () => {
    console.log('Account: ' + web3.eth.accounts);
  }

  enable2fa = () => {
    const id = Math.random();
    const title = 'Enabling 2FA';
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    this.cdpManagerObj.setOptTo2ndAuth(log);
  }

  startIntervals = () => {
    this.checkNetworkInterval = setInterval(this.checkNetwork, 3000);
  }

  init = () => {
    initWeb3Ledger();

    this.setHashParams();
    window.onhashchange = () => {
      this.setHashParams();
      this.initContracts(this.state.system.top.address);
      this.initCDPManager();
    }

    if (localStorage.getItem('termsModal')) {
      const termsModal = JSON.parse(localStorage.getItem('termsModal'));
      this.setState({ termsModal });
    }
  }

  setHashParams = () => {
    const params = window.location.hash.replace(/^#\/?|\/$/g, '').split('/');
    this.setState({ params });
  }

  loadObject = (abi, address) => {
    return web3.eth.contract(abi).at(address);
  }

  validateAddresses = topAddress => {
    return web3.isAddress(topAddress);
  }

  initContracts = topAddress => {
    if (!this.validateAddresses(topAddress)) {
      return;
    }
    web3.reset(true);
    if (typeof this.timeVariablesInterval !== 'undefined') clearInterval(this.timeVariablesInterval);
    if (typeof this.pendingTxInterval !== 'undefined') clearInterval(this.pendingTxInterval);
    const initialState = this.getInitialState();
    this.setState((prevState, props) => {
      return { system: { ...initialState }.system };
    }, () => {
      window.topObj = this.topObj = this.loadObject(top.abi, topAddress);
      // this.topObj.name.call((e, r) => console.log("Top Obj is: " + e, r))
      const addrs = settings.chain[this.state.network.network];

      const setUpPromises = [this.getTubAddress(), this.getTapAddress()];
      if (addrs.proxyFactory) {
        window.proxyFactoryObj = this.proxyFactoryObj = this.loadObject(dsproxyfactory.abi, addrs.proxyFactory);
        setUpPromises.push(this.getProxyAddress());
      }
      Promise.all(setUpPromises).then(r => {
        if (r[0] && r[1] && web3.isAddress(r[0]) && web3.isAddress(r[1])) {
          window.tubObj = this.tubObj = this.loadObject(tub.abi, r[0]);
          window.tapObj = this.tapObj = this.loadObject(tap.abi, r[1]);
          const system = { ...this.state.system };
          const profile = { ...this.state.profile };

          system.top.address = topAddress;
          system.tub.address = r[0];
          system.tap.address = r[1];

          if (addrs.proxyFactory && r[2]) {
            profile.proxy = r[2];
            profile.activeProfile = localStorage.getItem('mode') === 'proxy' ? profile.proxy : this.state.network.defaultAccount;
            window.proxyObj = this.proxyObj = this.loadObject(dsproxy.abi, profile.proxy);
          } else {
            profile.activeProfile = this.state.network.defaultAccount;
            profile.mode = 'account';
            localStorage.setItem('mode', 'account');
          }

          this.setState({ system, profile }, () => {
            const promises = [this.setUpVox(), this.setUpPit()];
            Promise.all(promises).then(r => {
              this.initializeSystemStatus();
              this.getGasPrice();

              //this.initSecurity();
              this.setUpToken('gem');
              this.setUpToken('gov');
              this.setUpToken('skr');
              this.setUpToken('dai');
              this.setUpToken('sin');
              this.getTotalCDPs();

              this.getCDPFromOwner()

              this.getCups(settings['CDPsPerPage']);

              this.setFiltersTub();
              this.setFiltersTap();
              this.setFiltersVox();
              this.setFilterFeedValue('pip');
              this.setFilterFeedValue('pep');
              this.setTimeVariablesInterval();
              this.setNonTimeVariablesInterval();

              // This is necessary to finish transactions that failed after signing
              this.setPendingTxInterval();
            });
          });
        } else {
          console.log('This is not a Top address');
        }
      });
    });
  }

  initCDPManager = () => {
    const addrs = settings.chain[this.state.network.network];
    window.cdpManagerObj = this.cdpManagerObj = this.loadObject(easyCDPManager.abi, addrs.EasyCDPManager);
    window.ethLockerObj = this.ethLockerObj = this.loadObject(ethLocker.abi, addrs.EthLocker);
    window.repayObj = this.repayObj = this.loadObject(repay.abi, addrs.Repay)
    this.getUserExtraEth();
  }

  loadEraRho = () => {
    const promises = [
      this.getParameterFromTub('rho'),
      this.getParameterFromVox('era')
    ];
    Promise.all(promises).then(r => {
      if (r[0] === true && r[1] === true && this.state.system.tub.tax.gte(0) && this.state.system.sin.tubBalance.gte(0)) {
        this.setState((prevState, props) => {
          const system = { ...prevState.system };
          const sin = { ...system.sin };
          sin.issuerFee = system.sin.tubBalance.times(web3.fromWei(system.tub.tax).pow(system.vox.era.minus(system.tub.rho))).minus(system.sin.tubBalance).round(0);
          system.sin = sin;
          return { system };
        });
      }
    });
  }

  setTimeVariablesInterval = () => {
    this.timeVariablesInterval = setInterval(() => {
      this.getParameterFromTub('chi', true);
      this.getParameterFromTub('rhi', true);
      this.getParameterFromVox('par', true);
      this.loadEraRho();
      this.getAccountBalance();
      this.getGasPrice();
    }, 5000);
  }

  setNonTimeVariablesInterval = () => {
    // This interval should not be necessary if we can rely on the events
    this.timeVariablesInterval = setInterval(() => {
      this.setUpToken('gem');
      this.setUpToken('gov');
      this.setUpToken('skr');
      this.setUpToken('dai');
      this.setUpToken('sin');
      this.getParameterFromTub('authority');
      this.getParameterFromTub('off');
      this.getParameterFromTub('out');
      this.getParameterFromTub('axe', true);
      this.getParameterFromTub('mat', true, this.calculateSafetyAndDeficit);
      this.getParameterFromTub('cap');
      this.getParameterFromTub('fit');
      this.getParameterFromTub('tax', true);
      this.getParameterFromTub('fee', true);
      this.getParameterFromTub('chi', true);
      this.getParameterFromTub('rhi', true);
      this.getParameterFromTub('per', true);
      this.getParameterFromTub('gap');
      this.getParameterFromTub('tag', true, this.calculateSafetyAndDeficit);
      this.getParameterFromTap('fix', true);
      this.getParameterFromTap('gap', false, this.getBoomBustValues);
      this.getParameterFromVox('way', true);
      this.getParameterFromVox('par', true);
    }, 30000);
  }

  setPendingTxInterval = () => {
    this.pendingTxInterval = setInterval(() => {
      this.checkPendingTransactions()
    }, 10000);
  }

  getAccountBalance = () => {
    if (web3.isAddress(this.state.profile.activeProfile)) {
      web3.eth.getBalance(this.state.profile.activeProfile, (e, r) => {
        const profile = { ...this.state.profile };
        profile.accountBalance = r;
        this.setState({ profile });
      });
    }
  }

  getGasPrice = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://dev.blockscale.net/api/gasexpress.json');
    xhr.addEventListener('load', () => {
      const data = JSON.parse(xhr.responseText);
      let gasPrice = data.fast;
      this.setState((prevState, props) => {
        let system = prevState.system
        system.gasPrice = web3.toHex(web3.toWei(gasPrice, 'gwei'))
        return { system };
      })
    })
    xhr.send();
  }

  getTubAddress = () => {
    const p = new Promise((resolve, reject) => {
      this.topObj.tub.call((e, r) => {
        if (!e) {
          resolve(r);
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getTapAddress = () => {
    const p = new Promise((resolve, reject) => {
      this.topObj.tap.call((e, r) => {
        if (!e) {
          resolve(r);
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getProxyOwner = (proxy) => {
    return new Promise((resolve, reject) => {
      this.loadObject(dsproxy.abi, proxy).owner((e, r) => {
        if (!e) {
          resolve(r);
        } else {
          reject(e);
        }
      });
    });
  }

  getProxyAddress = () => {
    const network = this.state.network;
    return new Promise((resolve, reject) => {
      const addrs = settings.chain[network.network];
      this.proxyFactoryObj.Created({ sender: network.defaultAccount }, { fromBlock: addrs.fromBlock }).get(async (e, r) => {
        if (!e) {
          if (r.length > 0) {
            for (let i = r.length - 1; i >= 0; i--) {
              if (await this.getProxyOwner(r[i].args.proxy) === network.defaultAccount) {
                resolve(r[i].args.proxy);
                break;
              }
            }
            resolve(null);
          } else {
            resolve(null);
          }
        } else {
          reject(e);
        }
      });
    });
  }

  setUpVox = () => {
    const p = new Promise((resolve, reject) => {
      this.tubObj.vox.call((e, r) => {
        if (!e) {
          this.setState((prevState, props) => {
            const system = { ...prevState.system };
            const vox = { ...system.vox };
            vox.address = r;
            system.vox = vox;
            return { system };
          }, () => {
            window.voxObj = this.voxObj = this.loadObject(vox.abi, r);
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  setUpPit = () => {
    const p = new Promise((resolve, reject) => {
      this.tubObj.pit.call((e, r) => {
        if (!e) {
          this.setState((prevState, props) => {
            const system = { ...prevState.system };
            const pit = { ...system.pit };
            pit.address = r;
            system.pit = pit;
            return { system };
          }, () => {
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  setUpToken = (token) => {
    this.tubObj[token.replace('dai', 'sai')].call((e, r) => {
      if (!e) {
        this.setState((prevState, props) => {
          const system = { ...prevState.system };
          const tok = { ...system[token] };
          tok.address = r;
          system[token] = tok;
          return { system };
        }, () => {
          window[`${token}Obj`] = this[`${token}Obj`] = this.loadObject(token === 'gem' ? dsethtoken.abi : dstoken.abi, r);
          this.getDataFromToken(token);
          this.setFilterToken(token);
        });
      }
    })
  }

  setFilterToken = (token) => {
    const filters = ['Transfer', 'Approval'];

    if (token === 'gem') {
      filters.push('Deposit');
      filters.push('Withdrawal');
    } else {
      filters.push('Mint');
      filters.push('Burn');
    }

    for (let i = 0; i < filters.length; i++) {
      const conditions = {};
      if (this[`${token}Obj`][filters[i]]) {
        this[`${token}Obj`][filters[i]](conditions, { fromBlock: 'latest' }, (e, r) => {
          if (!e) {
            this.logTransactionConfirmed(r.transactionHash);
            this.getDataFromToken(token);
          }
        });
      }
    }
  }

  getCups = (limit = 15, skip = 0) => {
    const conditions = this.getCupsListConditions();
    const me = this;
    if (settings.chain[this.state.network.network].service) {
      Promise.resolve(this.getFromService('cups', Object.assign(conditions.on, conditions.off), { cupi: 'asc' })).then(response => {
        const promises = [];
        response.results.forEach(v => {
          promises.push(me.getCup(v.cupi));
        });
        me.getCupsFromChain(this.state.system.tub.cupsList, conditions.on, conditions.off, response.lastBlockNumber, limit, skip, promises);
      }).catch(error => {
        me.getCupsFromChain(this.state.system.tub.cupsList, conditions.on, conditions.off, settings.chain[this.state.network.network].fromBlock, limit, skip);
      });
    } else {
      this.getCupsFromChain(this.state.system.tub.cupsList, conditions.on, conditions.off, settings.chain[this.state.network.network].fromBlock, limit, skip);
    }
  }

  getCupsFromChain = (cupsList, onConditions, offConditions, fromBlock, limit, skip, promises = []) => {
    const promisesLogs = [];
    promisesLogs.push(
      new Promise((resolve, reject) => {
        this.tubObj.LogNewCup(onConditions, { fromBlock }).get((e, r) => {
          if (!e) {
            for (let i = 0; i < r.length; i++) {
              promises.push(this.getCup(parseInt(r[i].args.cup, 16)));
            }
            resolve();
          } else {
            reject(e);
          }
        });
      })
    );
    if (typeof onConditions.lad !== 'undefined') {
      promisesLogs.push(
        new Promise((resolve, reject) => {
          // Get cups given to address (only if not seeing all cups).
          this.tubObj.LogNote({ sig: this.methodSig('give(bytes32,address)'), bar: toBytes32(onConditions.lad) }, { fromBlock }).get((e, r) => {
            if (!e) {
              for (let i = 0; i < r.length; i++) {
                promises.push(this.getCup(parseInt(r[i].args.foo, 16), Object.assign(onConditions, offConditions)));
              }
              resolve();
            } else {
              reject(e);
            }
          });
        })
      );
    }
    Promise.all(promisesLogs).then(r => {
      if (cupsList === this.state.system.tub.cupsList && this.state.system.tub.cupsLoading) {
        Promise.all(promises).then(cups => {
          const conditions = Object.assign(onConditions, offConditions);
          const cupsToShow = {};
          const cupsFiltered = {};
          let ownCup = this.state.system.tub.ownCup;
          for (let i = 0; i < cups.length; i++) {
            if ((typeof conditions.lad === 'undefined' || conditions.lad === cups[i].lad) &&
              (typeof conditions.closed === 'undefined' ||
                (conditions.closed && cups[i].lad === '0x0000000000000000000000000000000000000000') ||
                (!conditions.closed && cups[i].lad !== '0x0000000000000000000000000000000000000000' && cups[i].ink.gt(0))) &&
              (typeof conditions.safe === 'undefined' ||
                (conditions.safe && cups[i].safe) ||
                (!conditions.safe && !cups[i].safe))
            ) {
              cupsFiltered[cups[i].id] = cups[i];
            }
            ownCup = ownCup || cups[i].lad === this.state.profile.activeProfile;
          }
          const keys = Object.keys(cupsFiltered).sort((a, b) => a - b);
          for (let i = skip; i < Math.min(skip + limit, keys.length); i++) {
            cupsToShow[keys[i]] = cupsFiltered[keys[i]];
          }
          if (cupsList === this.state.system.tub.cupsList && this.state.system.tub.cupsLoading) {
            this.setState((prevState, props) => {
              const system = { ...prevState.system };
              const tub = { ...system.tub };
              tub.cupsLoading = false;
              tub.cupsCount = keys.length;
              tub.cups = cupsToShow;
              tub.ownCup = ownCup;
              system.tub = tub;
              return { system };
            });
          }
        });
      }
    });
  }

  getCup = id => {
    return new Promise((resolve, reject) => {
      this.tubObj.cups.call(toBytes32(id), (e, cupData) => {
        if (!e) {
          let cupBaseData = {
            id: parseInt(id, 10),
            lad: cupData[0],
            ink: cupData[1],
            art: cupData[2],
            ire: cupData[3],
          };

          Promise.resolve(this.addExtraCupData(cupBaseData)).then(cup => {
            resolve(cup);
          }, e => {
            reject(e);
          });
        } else {
          reject(e);
        }
      });
    });
  }

  addExtraCupData = (cup) => {
    cup.pro = wmul(cup.ink, this.state.system.tub.tag).round(0);
    cup.ratio = cup.pro.div(wmul(this.tab(cup), this.state.system.vox.par));
    // This is to give a window margin to get the maximum value (as 'chi' is dynamic value per second)
    const marginTax = web3.fromWei(this.state.system.tub.tax).pow(120);
    cup.avail_dai = wdiv(cup.pro, wmul(this.state.system.tub.mat, this.state.system.vox.par)).minus(this.tab(cup)).round(0).minus(1); // "minus(1)" to avoid rounding issues when dividing by mat (in the contract uses it mulvoxlying on safe function)
    cup.avail_dai_with_margin = wdiv(cup.pro, wmul(this.state.system.tub.mat, this.state.system.vox.par)).minus(this.tab(cup).times(marginTax)).round(0).minus(1);
    cup.avail_dai_with_margin = cup.avail_dai_with_margin.lt(0) ? web3.toBigNumber(0) : cup.avail_dai_with_margin;
    cup.avail_skr = cup.ink.minus(wdiv(wmul(wmul(this.tab(cup), this.state.system.tub.mat), this.state.system.vox.par), this.state.system.tub.tag)).round(0);
    cup.avail_skr_with_margin = cup.ink.minus(wdiv(wmul(wmul(this.tab(cup).times(marginTax), this.state.system.tub.mat), this.state.system.vox.par), this.state.system.tub.tag)).round(0);
    cup.avail_skr_with_margin = cup.avail_skr_with_margin.lt(0) ? web3.toBigNumber(0) : cup.avail_skr_with_margin;
    cup.liq_price = cup.ink.gt(0) && cup.art.gt(0) ? wdiv(wdiv(wmul(this.tab(cup), this.state.system.tub.mat), this.state.system.tub.per), cup.ink) : web3.toBigNumber(0);

    return new Promise((resolve, reject) => {
      this.tubObj.safe['bytes32'].call(toBytes32(cup.id), (e, safe) => {
        if (!e) {
          cup.safe = safe;
          resolve(cup);
        } else {
          reject(e);
        }
      });
    });
  }

  reloadCupData = id => {
    Promise.resolve(this.getCup(id).then(cup => {
      this.setState((prevState, props) => {
        const system = { ...prevState.system };
        const tub = { ...system.tub };
        const cups = { ...tub.cups };
        cups[id] = { ...cup };
        tub.cups = cups;
        system.tub = tub;
        return { system };
      });
    }));
  }

  getFromService = (service, conditions = {}, sort = {}) => {
    const p = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      let conditionsString = '';
      let sortString = '';
      Object.keys(conditions).map(key => {
        conditionsString += `${key}:${conditions[key]}`;
        conditionsString += Object.keys(conditions).pop() !== key ? '&' : '';
        return false;
      });
      conditionsString = conditionsString !== '' ? `/conditions=${conditionsString}` : '';
      Object.keys(sort).map(key => {
        sortString += `${key}:${sort[key]}`;
        sortString += Object.keys(sort).pop() !== key ? '&' : '';
        return false;
      });
      sortString = sortString !== '' ? `/sort=${sortString}` : '';
      const url = `${settings.chain[this.state.network.network].service}${settings.chain[this.state.network.network].service.slice(-1) !== '/' ? '/' : ''}${service}${conditionsString}${sortString}`;
      xhr.open('GET', url, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          reject(xhr.status);
        }
      }
      xhr.send();
    });
    return p;
  }

  getCupsListConditions = () => {
    const conditions = { on: {}, off: {} };
    switch (this.state.system.tub.cupsList) {
      case 'open':
        conditions.off.closed = false;
        conditions.off['ink.gt'] = 0;
        break;
      case 'unsafe':
        conditions.off.closed = false;
        conditions.off.safe = false;
        break;
      case 'closed':
        conditions.off.closed = true;
        break;
      case 'all':
        break;
      case 'mine':
      default:
        conditions.on.lad = this.state.profile.activeProfile;
        break;
    }
    return conditions;
  }

  setFiltersTub = () => {
    const cupSignatures = [
      'lock(bytes32,uint256)',
      'free(bytes32,uint256)',
      'draw(bytes32,uint256)',
      'wipe(bytes32,uint256)',
      'bite(bytes32)',
      'shut(bytes32)',
      'give(bytes32,address)',
    ].map(v => this.methodSig(v));

    this.tubObj.LogNote({}, { fromBlock: 'latest' }, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (cupSignatures.indexOf(r.args.sig) !== -1 && typeof this.state.system.tub.cups[r.args.foo] !== 'undefined') {
          this.reloadCupData(parseInt(r.args.foo, 16));
        } else if (r.args.sig === this.methodSig('mold(bytes32,uint256)')) {
          const ray = ['axe', 'mat', 'tax', 'fee'].indexOf(web3.toAscii(r.args.foo).substring(0, 3)) !== -1;
          const callback = ['mat'].indexOf(web3.toAscii(r.args.foo).substring(0, 3)) !== -1 ? this.calculateSafetyAndDeficit : () => { };
          this.getParameterFromTub(web3.toAscii(r.args.foo).substring(0, 3), ray, callback);
        } else if (r.args.sig === this.methodSig('cage(uint256,uint256)')) {
          this.getParameterFromTub('off');
          this.getParameterFromTub('fit');
          this.getParameterFromTap('fix', true);
        } else if (r.args.sig === this.methodSig('flow()')) {
          this.getParameterFromTub('out');
        }
        if (r.args.sig === this.methodSig('drip()') ||
          r.args.sig === this.methodSig('chi()') ||
          r.args.sig === this.methodSig('rhi()') ||
          r.args.sig === this.methodSig('draw(bytes32,uint256)') ||
          r.args.sig === this.methodSig('wipe(bytes32,uint256)') ||
          r.args.sig === this.methodSig('shut(bytes32)') ||
          (r.args.sig === this.methodSig('mold(bytes32,uint256)') && web3.toAscii(r.args.foo).substring(0, 3) === 'tax')) {
          this.getParameterFromTub('chi', true);
          this.getParameterFromTub('rhi', true);
          this.loadEraRho();
        }
      }
    });
  }

  setFiltersTap = () => {
    this.tapObj.LogNote({}, { fromBlock: 'latest' }, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (r.args.sig === this.methodSig('mold(bytes32,uint256)')) {
          this.getParameterFromTap('gap', false, this.getBoomBustValues());
        }
      }
    });
  }

  setFiltersVox = () => {
    this.voxObj.LogNote({}, { fromBlock: 'latest' }, (e, r) => {
      if (!e) {
        this.logTransactionConfirmed(r.transactionHash);
        if (r.args.sig === this.methodSig('mold(bytes32,uint256)')) {
          this.getParameterFromVox('way', true);
        }
      }
    });
  }

  setFilterFeedValue = obj => {
    this.tubObj[obj].call((e, r) => {
      if (!e) {
        this.setState((prevState, props) => {
          const system = { ...prevState.system };
          const feed = { ...system[obj] };
          feed.address = r;
          system[obj] = feed;
          return { system };
        }, () => {
          window[`${obj}Obj`] = this[`${obj}Obj`] = this.loadObject(dsvalue.abi, r);
          this.getValFromFeed(obj);

          this[`${obj}Obj`].LogNote({}, { fromBlock: 'latest' }, (e, r) => {
            if (!e) {
              if (
                r.args.sig === this.methodSig('poke(bytes32)') ||
                r.args.sig === this.methodSig('poke()')
              ) {
                this.getValFromFeed(obj);
                if (obj === 'pip') {
                  this.getParameterFromTub('tag', true, this.calculateSafetyAndDeficit);
                }
              }
            }
          });
        });
      }
    })
  }

  getDataFromToken = token => {
    this.getTotalSupply(token);
    if (token === 'dai') {
      this.getDaiAllowance();
    }
    if (token !== 'sin' && web3.isAddress(this.state.profile.activeProfile)) {
      this.getBalanceOf(token, this.state.profile.activeProfile, 'myBalance');
    }
    if (token === 'gem' || token === 'skr' || token === 'sin') {
      this.getBalanceOf(token, this.state.system.tub.address, 'tubBalance');
    }
    if (token === 'gem' || token === 'skr' || token === 'dai' || token === 'sin') {
      this.getBalanceOf(token, this.state.system.tap.address, 'tapBalance');
      this.getBoomBustValues();
    }
    if (token === 'gem' || token === 'skr') {
      this.getParameterFromTub('per', true);
    }
    if (token === 'gem' || token === 'skr' || token === 'dai' || token === 'gov') {
      this.getApproval(token, 'tub');
      if (token !== 'gov') {
        this.getApproval(token, 'tap');
      }
    }
    if (token === 'gov') {
      this.getBalanceOf(token, this.state.system.pit.address, 'pitBalance');
    }
  }

  getApproval = (token, dst) => {
    Promise.resolve(this.allowance(token, dst)).then(r => {
      this.setState((prevState, props) => {
        const system = { ...prevState.system };
        const tok = { ...system[token] };
        tok[`${dst}Approved`] = r.eq(web3.toBigNumber(2).pow(256).minus(1));
        system[token] = tok;
        return { system };
      });
    }, () => { });
  }

  getTotalSupply = name => {
    this[`${name}Obj`].totalSupply.call((e, r) => {
      if (!e) {
        this.setState((prevState, props) => {
          const system = { ...prevState.system };
          const tok = { ...system[name] };
          tok.totalSupply = r;
          system[name] = tok;
          return { system };
        }, () => {
          if (name === 'sin') {
            this.calculateSafetyAndDeficit();
          }
        });
      }
    })
  }

  getBalanceOf = (name, address, field) => {
    this[`${name}Obj`].balanceOf.call(address, (e, r) => {
      if (!e) {
        this.setState((prevState, props) => {
          const system = { ...prevState.system };
          const tok = { ...system[name] };
          tok[field] = r;
          system[name] = tok;
          return { system };
        }, () => {
          if ((name === 'skr' || name === 'dai') && field === 'tubBalance') {
            this.calculateSafetyAndDeficit();
          }
        });
      }
    })
  }

  initializeSystemStatus = () => {
    this.getParameterFromTub('authority');
    this.getParameterFromTub('off');
    this.getParameterFromTub('out');
    this.getParameterFromTub('axe', true);
    this.getParameterFromTub('mat', true, this.calculateSafetyAndDeficit);
    this.getParameterFromTub('cap');
    this.getParameterFromTub('fit');
    this.getParameterFromTub('tax', true);
    this.getParameterFromTub('fee', true);
    this.getParameterFromTub('chi', true);
    this.getParameterFromTub('rhi', true);
    this.getParameterFromTub('per', true);
    this.getParameterFromTub('gap');
    this.getParameterFromTub('tag', true, this.calculateSafetyAndDeficit);
    this.getParameterFromTap('fix', true);
    this.getParameterFromTap('gap', false, this.getBoomBustValues);
    this.getParameterFromVox('way', true);
    this.getParameterFromVox('par', true);
    this.loadEraRho();
    this.getAccountBalance();
    if (settings.chain[this.state.network.network].service) {
      if (settings.chain[this.state.network.network].chart) {
        this.getChartData();
      }
      this.getStats();
    }
  }

  calculateSafetyAndDeficit = () => {
    if (this.state.system.tub.mat.gte(0) && this.state.system.skr.tubBalance.gte(0) && this.state.system.tub.tag.gte(0) && this.state.system.sin.totalSupply.gte(0)) {
      this.setState((prevState, props) => {
        const system = { ...prevState.system };
        const tub = { ...system.tub };

        const pro = wmul(system.skr.tubBalance, system.tub.tag);
        const con = system.sin.totalSupply;
        tub.eek = pro.lt(con);

        const min = wmul(con, tub.mat);
        tub.safe = pro.gte(min);

        system.tub = tub;
        return { system };
      });
    }
  }

  getParameterFromTub = (field, ray = false, callback = false) => {
    const p = new Promise((resolve, reject) => {
      this.tubObj[field].call((e, value) => {
        if (!e) {
          this.setState((prevState, props) => {
            const system = { ...prevState.system };
            const tub = { ...system.tub };
            tub[field] = ray ? fromRaytoWad(value) : value;
            system.tub = tub;
            return { system };
          }, () => {
            this.getBoomBustValues();
            const promises = [];
            Object.keys(this.state.system.tub.cups).map(key =>
              promises.push(this.addExtraCupData(this.state.system.tub.cups[key]))
            );
            Promise.all(promises).then(r => {
              if (r.length > 0) {
                this.setState((prevState, props) => {
                  const system = { ...prevState.system };
                  const tub = { ...system.tub };
                  const cups = { ...tub.cups }
                  for (let i = 0; i < r.length; i++) {
                    if (typeof cups[r[i].id] !== 'undefined') {
                      cups[r[i].id].pro = r[i].pro;
                      cups[r[i].id].ratio = r[i].ratio;
                      cups[r[i].id].avail_dai = r[i].avail_dai;
                      cups[r[i].id].avail_dai_with_margin = r[i].avail_dai_with_margin;
                      cups[r[i].id].avail_skr = r[i].avail_skr;
                      cups[r[i].id].avail_skr_with_margin = r[i].avail_skr_with_margin;
                      cups[r[i].id].liq_price = r[i].liq_price;
                      cups[r[i].id].safe = r[i].safe;
                    }
                  }
                  tub.cups = cups;
                  system.tub = tub;
                  return { system };
                });
              }
            });
            if (callback) {
              callback(value);
            }
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getParameterFromTap = (field, ray = false) => {
    const p = new Promise((resolve, reject) => {
      this.tapObj[field].call((e, value) => {
        if (!e) {
          this.setState((prevState, props) => {
            const system = { ...prevState.system };
            const tap = { ...system.tap };
            tap[field] = ray ? fromRaytoWad(value) : value;
            system.tap = tap;
            return { system };
          }, () => {
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getParameterFromVox = (field, ray = false) => {
    const p = new Promise((resolve, reject) => {
      this.voxObj[field].call((e, value) => {
        if (!e) {
          this.setState((prevState, props) => {
            const system = { ...prevState.system };
            const vox = { ...system.vox };
            vox[field] = ray ? fromRaytoWad(value) : value;
            system.vox = vox;
            return { system };
          }, () => {
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getValFromFeed = (obj) => {
    const p = new Promise((resolve, reject) => {
      this[`${obj}Obj`].peek.call((e, r) => {
        if (!e) {
          this.setState((prevState, props) => {
            const system = { ...prevState.system };
            const feed = { ...system[obj] };
            feed.val = web3.toBigNumber(r[1] ? parseInt(r[0], 16) : -2);
            system[obj] = feed;
            return { system };
          }, () => {
            if (obj === 'pip') {
              this.getBoomBustValues();
            }
            resolve(true);
          });
        } else {
          reject(e);
        }
      });
    });
    return p;
  }

  getBoomBustValues = () => {
    if (this.state.system.dai.tapBalance.gte(0)
      //&& this.state.system.sin.issuerFee.gte(0)
      && this.state.system.sin.tapBalance.gte(0)
      && this.state.system.vox.par.gte(0)
      && this.state.system.tub.tag.gte(0)
      && this.state.system.tap.gap.gte(0)
      && this.state.system.pip.val.gte(0)
      && this.state.system.skr.tapBalance.gte(0)
      && this.state.system.sin.tubBalance.gte(0)
      && this.state.system.tub.tax.gte(0)
      && this.state.system.skr.tapBalance.gte(0)
      && this.state.system.skr.totalSupply.gte(0)
      && this.state.system.gem.tubBalance.gte(0)) {
      this.setState((prevState, props) => {
        const system = { ...prevState.system };
        const tub = { ...system.tub };

        // const dif = system.dai.tapBalance.add(system.sin.issuerFee).minus(system.sin.tapBalance); bust & boom don't execute drip anymore so we do not need to do the estimation
        const dif = system.dai.tapBalance.minus(system.sin.tapBalance);
        tub.avail_boom_dai = tub.avail_boom_skr = web3.toBigNumber(0);
        tub.avail_bust_dai = tub.avail_bust_skr = web3.toBigNumber(0);

        // if higher or equal, it means vox.par is static or increases over the time
        // if lower, it means it decreases over the time, so we calculate a future par (in 10 minutes) to reduce risk of tx failures
        const futurePar = system.vox.way.gte(WAD) ? system.vox.par : system.vox.par.times(web3.fromWei(system.vox.way).pow(10 * 60));

        if (dif.gt(0)) {
          // We can boom
          tub.avail_boom_dai = dif;
          tub.avail_boom_skr = wdiv(wdiv(wmul(tub.avail_boom_dai, futurePar), system.tub.tag), WAD.times(2).minus(system.tap.gap));
        }

        if (system.skr.tapBalance.gt(0) || dif.lt(0)) {
          // We can bust

          // This is a margin we need to take into account as bust quantity goes down per second
          // const futureFee = system.sin.tubBalance.times(web3.fromWei(tub.tax).pow(120)).minus(system.sin.tubBalance).round(0); No Drip anymore!!!
          // const daiNeeded = dif.abs().minus(futureFee);
          const daiNeeded = dif.gte(0) ? web3.toBigNumber(0) : dif.abs();
          const equivalentSKR = wdiv(wdiv(wmul(daiNeeded, futurePar), system.tub.tag), system.tap.gap);

          if (system.skr.tapBalance.gte(equivalentSKR)) {
            tub.avail_bust_skr = system.skr.tapBalance;
            tub.avail_bust_ratio = wmul(wmul(wdiv(WAD, system.vox.par), system.tub.tag), system.tap.gap);
            tub.avail_bust_dai = wmul(tub.avail_bust_skr, tub.avail_bust_ratio);
          } else {
            tub.avail_bust_dai = daiNeeded;
            // We need to consider the case where PETH needs to be minted generating a change in 'system.tub.tag'
            tub.avail_bust_skr = wdiv(system.skr.totalSupply.minus(system.skr.tapBalance), wdiv(wmul(wmul(system.pip.val, system.tap.gap), system.gem.tubBalance), wmul(tub.avail_bust_dai, system.vox.par)).minus(WAD));
            tub.avail_bust_ratio = wdiv(tub.avail_bust_dai, tub.avail_bust_skr);
          }
        }
        system.tub = tub;
        return { system };
      });
    }
  }

  parseCandleData = data => {
    const dataParsed = [];
    data.forEach(value => {
      const timestamp = (new Date(value.timestamp * 1000)).setHours(0, 0, 0);
      const index = dataParsed.length - 1;
      const noWei = value.value / 10 ** 18;
      if (dataParsed.length === 0 || timestamp !== dataParsed[index].date.getTime()) {
        dataParsed.push({
          date: new Date(timestamp),
          open: noWei,
          high: noWei,
          low: noWei,
          close: noWei,
        });
      } else {
        dataParsed[index].high = dataParsed[index].high > noWei ? dataParsed[index].high : noWei;
        dataParsed[index].low = dataParsed[index].low < noWei ? dataParsed[index].low : noWei;
        dataParsed[index].close = noWei;
      }
    });

    return dataParsed;
  }

  setChartState = (key, value) => {
    return new Promise((resolve, reject) => {
      this.setState((prevState, props) => {
        const system = { ...prevState.system };
        const chartData = { ...system.chartData };
        chartData[key] = value;
        system.chartData = chartData;
        return { system };
      }, () => {
        resolve(value);
      });
    });
  }

  getETHUSDPrice = timestamps => {
    return new Promise((resolve, reject) => {
      Promise.resolve(this.getFromService('pips', { 'timestamp.gte': timestamps[30] }, { 'timestamp': 'asc' })).then(response => {
        response.results = this.parseCandleData(response.results);
        Promise.resolve(this.setChartState('ethusd', response)).then(() => {
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
    });
  }

  getSKRETHPrice = timestamps => {
    return new Promise((resolve, reject) => {
      Promise.resolve(this.getFromService('pers', {}, { 'timestamp': 'asc' })).then(response => {
        const finalResponse = { lastBlockNumber: response.lastBlockNumber, results: [] };

        // If there is not result before 30 days ago, we assume that the value of PETH/ETH was 1 at that moment
        finalResponse.results.push({ value: 10 ** 18, timestamp: timestamps[30] });

        let lastIndex = 30;
        response.results.forEach(value => {
          if (value.timestamp <= timestamps[30]) {
            finalResponse.results[0] = { value: value.value, timestamp: timestamps[30] };
          } else {
            for (let i = lastIndex; i >= 0; i--) {
              if (value.timestamp > timestamps[i]) {
                finalResponse.results.push({ value: finalResponse.results[finalResponse.results.length - 1].value, timestamp: timestamps[i] });
                lastIndex = i;
              }
            }
            finalResponse.results.push({ value: value.value, timestamp: value.timestamp });
          }
        });
        for (let i = lastIndex; i >= 0; i--) {
          finalResponse.results.push({ value: finalResponse.results[finalResponse.results.length - 1].value, timestamp: timestamps[i] });
          lastIndex = i - 1;
        }
        finalResponse.results = this.parseCandleData(finalResponse.results);
        Promise.resolve(this.setChartState('skreth', finalResponse)).then(() => {
          resolve(finalResponse);
        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
    });
  }

  getDAIUSDPrice = timestamps => {
    return new Promise((resolve, reject) => {
      Promise.resolve(this.getFromService('ways')).then(response => {
        const finalResponse = { lastBlockNumber: response.lastBlockNumber, results: [] };

        let lastIndex = 30;
        let lastTimestamp = -1;
        let lastRate = -1;
        let price = web3.toBigNumber(10).pow(18);
        // response.results = [{ timestamp: 1500662100, value: '999999999350000000000000000' }, { timestamp: 1501556300, value: '1000000000750000000000000000' }, { timestamp: 1502161100, value: '999999999350000000000000000' }, { timestamp: 1502852300, value: '1000000000350000000000000000' }];

        if (response.results.length === 0) {
          lastTimestamp = timestamps[30];
          lastRate = web3.toBigNumber(1);
        }
        response.results.forEach(value => {
          for (let i = lastIndex; i >= 0; i--) {
            if (value.timestamp > timestamps[i]) {
              price = price.times(lastRate.pow(timestamps[i] - lastTimestamp));
              lastTimestamp = timestamps[i];
              if (i !== 30) {
                finalResponse.results.push({ value: price.valueOf(), timestamp: timestamps[i] - 1 });
              }
              finalResponse.results.push({ value: price.valueOf(), timestamp: timestamps[i] });
              lastIndex = i - 1;
            }
          }
          if (lastTimestamp !== -1) {
            price = price.times(lastRate.pow(value.timestamp - lastTimestamp));
          }
          lastTimestamp = value.timestamp;
          lastRate = web3.toBigNumber(value.value).div(web3.toBigNumber(10).pow(27));
          if (value.timestamp >= timestamps[30]) {
            finalResponse.results.push({ value: price.valueOf(), timestamp: value.timestamp });
          }
        });
        for (let i = lastIndex; i >= 0; i--) {
          price = price.times(lastRate.pow(timestamps[i] - lastTimestamp));
          lastTimestamp = timestamps[i];
          if (i !== 30) {
            finalResponse.results.push({ value: price.valueOf(), timestamp: timestamps[i] - 1 });
          }
          finalResponse.results.push({ value: price.valueOf(), timestamp: timestamps[i] });
          lastIndex = i - 1;
        }

        finalResponse.results = this.parseCandleData(finalResponse.results);
        Promise.resolve(this.setChartState('daiusd', finalResponse)).then(() => {
          resolve(finalResponse);
        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
    });
  }

  getChartData = () => {
    const timestamps = [];
    for (let i = 0; i <= 30; i++) {
      timestamps[i] = parseInt(((new Date()).setHours(0, 0, 0) - i * 24 * 60 * 60 * 1000) / 1000, 10);
    }
    const promises = [];
    // ETH/USD
    promises.push(this.getETHUSDPrice(timestamps));
    // DAI/USD
    promises.push(this.getDAIUSDPrice(timestamps));
    // PETH/ETH
    this.getSKRETHPrice(timestamps);

    Promise.all(promises).then(r => {
      if (r[0] && r[1]) {
        const ethdai = { results: [] };
        r[0].results.forEach((value, index) => {
          ethdai.results.push({
            date: value.date,
            open: value.open / r[1].results[index].open,
            high: value.high / r[1].results[index].high,
            low: value.low / r[1].results[index].low,
            close: value.close / r[1].results[index].close,
          });
        });
        this.setChartState('ethdai', ethdai);
      }
    }).catch(error => {
    });
  }

  getStats = () => {
    Promise.resolve(this.getFromService('cupStats')).then(response => {
      this.setState((prevState, props) => {
        const system = { ...prevState.system };
        system.stats = { error: false, results: response.results };
        return { system };
      });
    }).catch(error => {
      this.setState((prevState, props) => {
        const system = { ...prevState.system };
        system.stats = { error: true };
        return { system };
      });
    });
  }

  tab = cup => {
    return wmul(cup.art, this.state.system.tub.chi).round(0);
  }

  rap = cup => {
    return wmul(cup.ire, this.state.system.tub.rhi).minus(this.tab(cup)).round(0);
  }

  methodSig = method => {
    return web3.sha3(method).substring(0, 10)
  }

  // Modals
  handleOpenModal = e => {
    e.preventDefault();
    const method = e.target.getAttribute('data-method');
    const cup = e.target.getAttribute('data-cup') ? e.target.getAttribute('data-cup') : false;
    this.setState({ modal: { show: true, method, cup } });
  }

  handleCloseModal = e => {
    e.preventDefault();
    this.setState({ modal: { show: false } });
  }

  handleOpenVideoModal = e => {
    e.preventDefault();
    this.setState({ videoModal: { show: true } });
  }

  handleOpenTermsModal = e => {
    e.preventDefault();
    const termsModal = { ...this.state.termsModal };
    termsModal[e.target.getAttribute('data-modal')] = true;
    this.setState({ termsModal: termsModal });
  }

  handleOpenAboutModal = e => {
    e.preventDefault();
    this.setState({ aboutModal: { show: true } });
  }

  handleCloseAboutModal = e => {
    e.preventDefault();
    this.setState({ aboutModal: { show: false } });
  }

  handleOpenConfirmationModal = e => {
    if (e) e.preventDefault();
    this.setState({ confirmationModal: { show: true } });
  }

  handleCloseConfirmationModal = e => {
    if (e) e.preventDefault();
    this.setState({ confirmationModal: { show: false } });
  }

  handleOpenSecurityModal = e => {
    if (e) e.preventDefault();
    this.setState({ securityModal: { show: true } });
  }

  handleCloseSecurityModal = e => {
    if (e) e.preventDefault();
    this.setState({ securityModal: { show: false } });
  }

  handleOpenAuthSuccessModal = e => {
    if (e) e.preventDefault();
    this.setState({ authSuccessModal: { show: true } });
  }

  handleCloseAuthSuccessModal = e => {
    if (e) e.preventDefault();
    this.setState({ authSuccessModal: { show: false } });
  }

  handleOpenOnboardingModal = e => {
    if (e) e.preventDefault();
    this.setState({ onboardingModal: { show: true } });
  }

  handleCloseOnboardingModal = e => {
    if (e) e.preventDefault();
    this.setState({ onboardingModal: { show: false } });
  }

  handleCloseVideoModal = e => {
    e.preventDefault();
    this.markAsAccepted('video');
    this.setState({ videoModal: { show: false } });
  }

  handleOpenTerminologyModal = e => {
    e.preventDefault();
    this.setState({ terminologyModal: { show: true } });
  }

  handleCloseTerminologyModal = e => {
    e.preventDefault();
    this.setState({ terminologyModal: { show: false } });
  }

  handleOpenCupHistoryModal = e => {
    e.preventDefault();
    const id = e.target.getAttribute('data-id');
    const me = this;
    this.setState({ cupHistoryModal: { show: true, id } }, () => {
      if (settings.chain[this.state.network.network].service) {
        Promise.resolve(this.getFromService('cupHistoryActions', { cupi: id }, { timestamp: 'asc' })).then(response => {
          me.setState({ cupHistoryModal: { show: true, error: false, id, actions: response.results } });
        }).catch(error => {
          me.setState({ cupHistoryModal: { show: true, error: true } });
        });
      }
    });
  }

  handleCloseCupHistoryModal = e => {
    e.preventDefault();
    this.setState({ cupHistoryModal: { show: false } });
  }

  markAsAccepted = type => {
    const termsModal = { ...this.state.termsModal };
    termsModal[type] = false;
    this.setState({ termsModal }, () => {
      localStorage.setItem('termsModal', JSON.stringify(termsModal));
    });
  }
  //

  // Transactions
  checkPendingTransactions = () => {
    const transactions = { ...this.state.transactions };
    Object.keys(transactions).map(tx => {
      if (transactions[tx].pending) {
        web3.eth.getTransactionReceipt(tx, (e, r) => {
          if (!e && r !== null) {
            if (r.logs.length === 0) {
              this.logTransactionFailed(tx);
            } else if (r.blockNumber) {
              this.logTransactionConfirmed(tx);
            }
          }
        });
      }
      return false;
    });
  }

  logRequestTransaction = (id, title) => {
    const msgTemp = 'Waiting for transaction signature...';
    this.refs.notificator.info(id, title, msgTemp, false);
  }

  logPendingTransaction = (id, tx, title, callbacks = []) => {
    const msgTemp = 'Transaction TX was created. Waiting for confirmation...';
    const transactions = { ...this.state.transactions };
    transactions[tx] = { pending: true, title, callbacks }
    this.setState({ transactions });
    console.log(msgTemp.replace('TX', tx));
    this.refs.notificator.hideNotification(id);
    this.refs.notificator.info(tx, title, etherscanTx(this.state.network.network, msgTemp.replace('TX', `${tx.substring(0, 10)}...`), tx), false);
  }

  logTransactionConfirmed = tx => {
    const msgTemp = 'Transaction TX was confirmed.';
    const transactions = { ...this.state.transactions };
    if (transactions[tx] && transactions[tx].pending) {
      transactions[tx].pending = false;
      this.setState({ transactions }, () => {
        console.log(msgTemp.replace('TX', tx));
        this.refs.notificator.hideNotification(tx);
        this.refs.notificator.success(tx, transactions[tx].title, etherscanTx(this.state.network.network, msgTemp.replace('TX', `${tx.substring(0, 10)}...`), tx), 4000);
        if (typeof transactions[tx].callbacks !== 'undefined' && transactions[tx].callbacks.length > 0) {
          transactions[tx].callbacks.forEach(callback => this.executeCallback(callback));
        }
      });
    }
  }

  logTransactionFailed = tx => {
    const msgTemp = 'Transaction TX failed.';
    const transactions = { ...this.state.transactions };
    if (transactions[tx]) {
      transactions[tx].pending = false;
      this.setState({ transactions });
      if (transactions[tx].title.indexOf('Approving DAI') !== -1) this.getDaiAllowance();
      if (transactions[tx].title.indexOf('Move CDP') !== -1) this.getCDPFromOwner();
      if (transactions[tx].title.indexOf('rap') !== -1) this.refreshCDPs();
      this.refs.notificator.error(tx, transactions[tx].title, msgTemp.replace('TX', `${tx.substring(0, 10)}...`), 4000);
    }
  }

  logTransactionRejected = (tx, title, callback = false) => {
    const msgTemp = 'User denied transaction signature.';
    this.refs.notificator.error(tx, title, msgTemp, 4000);
    if (callback) callback();
  }
  //

  // Actions
  executeMethod = (object, method, callbacks = []) => {
    const id = Math.random();
    const title = `${object.toUpperCase()}: ${method}`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title, callbacks);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
      this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.basicActions,
        `${this.methodSig(`${method}(address)`)}${addressToBytes32(this.state.system[object].address, false)}`,
        log);
    } else {
      this[`${object}Obj`][method]({
        gasPrice: this.state.system.gasPrice,
        gas: 772321,
      }, log);
    }
  }

  executeMethodCup = (method, cup, callbacks = []) => {
    const id = Math.random();
    const title = `TUB: ${method} ${cup}`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        callbacks.push(['reloadCupData', cup]);
        this.logPendingTransaction(id, tx, title, callbacks);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
      this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.basicActions,
        `${this.methodSig(`${method}(address,bytes32)`)}${addressToBytes32(this.tubObj.address, false)}${toBytes32(cup, false)}`,
        log);
    } else {
      this.tubObj[method](toBytes32(cup), {
        gasPrice: this.state.system.gasPrice,
        gas: 772321,
      }, log);
    }
  }

  executeMethodValue = (object, method, value, callbacks = []) => {
    const id = Math.random();
    const title = `${object.toUpperCase()}: ${method} ${value}`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title, callbacks);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
      this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.basicActions,
        `${this.methodSig(`${method}(address,uint256)`)}${addressToBytes32(this.state.system[object].address, false)}${toBytes32(web3.toWei(value), false)}`,
        log);
    } else {
      this[`${object}Obj`][method](web3.toWei(value), {
        gasPrice: this.state.system.gasPrice,
        gas: 772321,
      }, log);
    }
  }

  executeMethodCupValue = (method, cup, value, toWei = true, callbacks = []) => {
    const id = Math.random();
    const title = `TUB: ${method} ${cup} ${value}`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        callbacks.push(['reloadCupData', cup]);
        this.logPendingTransaction(id, tx, title, callbacks);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
      this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.basicActions,
        `${this.methodSig(`${method}(address,bytes32,uint256)`)}${addressToBytes32(this.tubObj.address, false)}${toBytes32(cup, false)}${toBytes32(toWei ? web3.toWei(value) : value, false)}`,
        log);
    } else {
      this.tubObj[method](toBytes32(cup), toWei ? web3.toWei(value) : value, {
        gasPrice: this.state.system.gasPrice,
        // gas price of management commands
        gas: 772321,
      }, log);
    }
  }

  allowance = (token, dst) => {
    return new Promise((resolve, reject) => {
      if (this.state.profile.activeProfile) {
        this[`${token}Obj`].allowance.call(this.state.profile.activeProfile, this[`${dst}Obj`].address, (e, r) => {
          if (!e) {
            resolve(r);
          } else {
            reject(e);
          }
        });
      } else {
        reject(true);
      }
    });
  }

  executeCallback = args => {
    const method = args.shift();
    // If the callback is to execute a getter function is better to wait as sometimes the new value is not uopdated instantly when the tx is confirmed
    const timeout = ['executeMethod', 'executeMethodValue', 'executeMethodCup', 'executeMethodCupValue', 'checkAllowance'].indexOf(method) !== -1 ? 0 : 3000;
    // console.log(method, args, timeout);
    setTimeout(() => {
      this[method](...args);
    }, timeout);
  }

  checkAllowance = (token, dst, callbacks) => {
    let promise;
    let valueObj;
    valueObj = web3.toBigNumber(2).pow(256).minus(1); // uint(-1)

    promise = this.allowance(token, dst);

    Promise.resolve(promise).then(r => {
      if (r.gte(valueObj)) {
        callbacks.forEach(callback => this.executeCallback(callback));
      } else {
        const tokenName = token.replace('gem', 'weth').replace('gov', 'mkr').replace('skr', 'peth').toUpperCase();
        const action = {
          gem: {
            tub: 'Join',
            tap: 'Mock'
          },
          skr: {
            tub: 'Exit/Lock',
            tap: 'Boom'
          },
          dai: {
            tub: 'Wipe/Shut',
            tap: 'Bust/Cash'
          },
          gov: {
            tub: 'Wipe/Shut'
          }
        }
        const id = Math.random();
        const title = `${tokenName}: approve ${action[token][dst]}`;
        this.logRequestTransaction(id, title);
        const log = (e, tx) => {
          if (!e) {
            this.logPendingTransaction(id, tx, title, callbacks);
          } else {
            console.log(e);
            this.logTransactionRejected(id, title);
          }
        }
        this[`${token}Obj`].approve(this.state.system[dst].address, -1, {}, log);
      }
    }, () => { });
  }

  lockMoreEth = (eth, cdp) => {
    const cdpID = toBytes32(cdp);
    const fee = (eth*.007).toFixed(5);
    if (!eth) return false;

    const id = Math.random();
    const title = `Locking ${parseFloat(eth).toFixed(3)} into CDP ${cdp}`;
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title, [['refreshCDPs'], ['getCDPFromOwner']]);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    const load_up = {
      from: this.state.profile.activeProfile,
      to: settings.chain[this.state.network.network].EthLocker.address,
      value: web3.toWei(parseFloat(eth)+parseFloat(fee), 'ether'),
      gasPrice: this.state.system.gasPrice,
      gas: 1000000
    }
    this.logRequestTransaction(id, title);
    this.ethLockerObj.lockWithJustEth.sendTransaction(cdpID, web3.toWei(fee), load_up, log)
  }

  updateValue = (value, token) => {
    const method = this.state.modal.method;
    const cup = this.state.modal.cup;
    let error = false;
    switch (method) {
      case 'ethLock':
        this.lockMoreEth(value, cup);
        break;
      case 'proxy':
        const id = Math.random();
        const title = 'PROXY: create new profile';
        this.logRequestTransaction(id, title);
        this.proxyFactoryObj.build((e, tx) => {
          if (!e) {
            this.logPendingTransaction(id, tx, title);
            this.proxyFactoryObj.Created({ sender: this.state.network.defaultAccount }, { fromBlock: 'latest' }, (e, r) => {
              if (!e) {
                const profile = { ...this.state.profile }
                profile.proxy = r.args.proxy;
                this.setState({ profile }, () => {
                  this.changeMode();
                });
              } else {
                console.log(e);
              }
            });
          } else {
            console.log(e);
            this.logTransactionRejected(id, title);
          }
        });
        break;
      case 'open':
        this.executeMethod('tub', method, [['showNewCup']]);
        break;
      case 'drip':
        this.executeMethod('tub', method);
        break;
      case 'shut':
        // We calculate debt with some margin before shutting cup (to avoid failures)
        const debt = this.tab(this.state.system.tub.cups[cup]).times(web3.fromWei(this.state.system.tub.tax).pow(120));
        if (this.state.system.dai.myBalance.lt(debt)) {
          error = `Not enough balance of DAI to shut CDP ${cup}.`;
        } else {
          const futureGovFee = web3.fromWei(wdiv(this.state.system.tub.fee, this.state.system.tub.tax)).pow(180).round(0); // 3 minutes of future fee
          const govDebt = wmul(wdiv(this.rap(this.state.system.tub.cups[cup]), this.state.system.pep.val), futureGovFee);
          if (govDebt.gt(this.state.system.gov.myBalance)) {
            error = `Not enough balance of MKR to shut CDP ${cup}.`;
          } else {
            if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
              this.executeMethodCup(method, cup, [
                ['setUpToken', 'sai'],
                ['setUpToken', 'sin'],
                ['setUpToken', 'gov'],
                ['setUpToken', 'skr']
              ]);
            } else {
              this.checkAllowance('dai', 'tub', [
                ['getApproval', 'dai', 'tub'],
                ['checkAllowance', 'gov', 'tub',
                  [
                    ['getApproval', 'gov', 'tub'],
                    ['executeMethodCup', method, cup,
                      [
                        ['setUpToken', 'sai'],
                        ['setUpToken', 'sin'],
                        ['setUpToken', 'gov'],
                        ['setUpToken', 'skr']
                      ]
                    ]
                  ]
                ]
              ]);
            }
          }
        }
        break;
      case 'bite':
        this.executeMethodCup(method, cup);
        break;
      case 'join':
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodValue('tub', method, value, [
            ['setUpToken', 'gem'],
            ['setUpToken', 'skr']
          ]);
        } else {
          // const valAllowanceJoin = web3.fromWei(web3.toBigNumber(value).times(this.state.system.tub.per).round().add(1).valueOf());
          this.checkAllowance('gem', 'tub', [
            ['getApproval', 'gem', 'tub'],
            ['executeMethodValue', 'tub', method, value,
              [
                ['setUpToken', 'gem'],
                ['setUpToken', 'skr']
              ]
            ]
          ]);
        }
        break;
      case 'exit':
        value = this.state.system.tub.off === true ? web3.fromWei(this.state.system.skr.myBalance) : value;
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodValue('tub', method, value, [
            ['setUpToken', 'gem'],
            ['setUpToken', 'skr']
          ]);
        } else {
          this.checkAllowance('skr', 'tub', [
            ['getApproval', 'skr', 'tub'],
            ['executeMethodValue', 'tub', method, value,
              [
                ['setUpToken', 'gem'],
                ['setUpToken', 'skr']
              ]
            ]
          ]);
        }
        break;
      case 'boom':
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodValue('tap', method, value, [
            ['setUpToken', 'skr'],
            ['setUpToken', 'sai'],
            ['setUpToken', 'sin']
          ]);
        } else {
          this.checkAllowance('skr', 'tap', [
            ['getApproval', 'skr', 'tap'],
            ['executeMethodValue', 'tap', method, value,
              [
                ['setUpToken', 'skr'],
                ['setUpToken', 'sai'],
                ['setUpToken', 'sin']
              ]
            ]
          ]);
        }
        break;
      case 'bust':
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodValue('tap', method, value, [
            ['setUpToken', 'skr'],
            ['setUpToken', 'sai'],
            ['setUpToken', 'sin']
          ]);
        } else {
          // const valueDAI = wmul(web3.toBigNumber(value), this.state.system.tub.avail_bust_ratio).ceil();
          this.checkAllowance('dai', 'tap', [
            ['getApproval', 'dai', 'tap'],
            ['executeMethodValue', 'tap', method, value,
              [
                ['setUpToken', 'skr'],
                ['setUpToken', 'sai'],
                ['setUpToken', 'sin']
              ]
            ]
          ]);
        }
        break;
      case 'lock':
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodCupValue(method, cup, value, true, [
            ['setUpToken', 'skr']
          ]);
        } else {
          this.checkAllowance('skr', 'tub', [
            ['getApproval', 'skr', 'tub'],
            ['executeMethodCupValue', method, cup, value, true,
              [
                ['setUpToken', 'skr']
              ]
            ]
          ]);
        }
        break;
      case 'free':
        if (this.state.system.tub.off) {
          this.executeMethodCupValue(method, cup, web3.fromWei(this.state.system.tub.cups[cup].avail_skr), true, [
            ['setUpToken', 'skr']
          ]);
        } else {
          this.executeMethodCupValue(method, cup, value, true, [
            ['setUpToken', 'skr']
          ]);
        }
        break;
      case 'draw':
        this.executeMethodCupValue(method, cup, value, true, [
          ['setUpToken', 'sai'],
          ['setUpToken', 'sin']
        ]);
        break;
      case 'wipe':
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodCupValue(method, cup, value, true, [
            ['setUpToken', 'sai'],
            ['setUpToken', 'sin'],
            ['setUpToken', 'gov']
          ]);
        } else {
          this.checkAllowance('dai', 'tub', [
            ['getApproval', 'dai', 'tub'],
            ['checkAllowance', 'gov', 'tub',
              [
                ['getApproval', 'gov', 'tub'],
                ['executeMethodCupValue', method, cup, value, true,
                  [
                    ['setUpToken', 'sai'],
                    ['setUpToken', 'sin'],
                    ['setUpToken', 'gov']
                  ]
                ]
              ]
            ]
          ]);
        }
        break;
      case 'give':
        this.executeMethodCupValue(method, cup, value, false);
        break;
      case 'cash':
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodValue('tap', method, value, [
            ['setUpToken', 'sai'],
            ['setUpToken', 'gem']
          ]);
        } else {
          this.checkAllowance('dai', 'tap', [
            ['getApproval', 'dai', 'tap'],
            ['executeMethodValue', 'tap', method, value,
              [
                ['setUpToken', 'sai'],
                ['setUpToken', 'gem']
              ]
            ]
          ]);
        }
        break;
      case 'mock':
        if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
          this.executeMethodValue('tap', method, value, [
            ['setUpToken', 'sai'],
            ['setUpToken', 'gem']
          ]);
        } else {
          this.checkAllowance('gem', 'tap', [
            ['getApproval', 'gem', 'tap'],
            ['executeMethodValue', 'tap', method, value,
              [
                ['setUpToken', 'sai'],
                ['setUpToken', 'gem']
              ]
            ]
          ]);
        }
        break;
      case 'vent':
      case 'heal':
        this.executeMethod('tap', method);
        break;
      default:
        break;
    }

    if (error) {
      const modal = { ...this.state.modal }
      modal.error = error;
      this.setState({ modal });
    } else {
      this.setState({ modal: { show: false } });
    }
  }

  getDaiAllowance = () => {
    if (this.state.profile.activeProfile)
      this.daiObj.allowance.call(this.state.profile.activeProfile, settings.chain[this.state.network.network].Repay, (e, r) => {
        if (!e) {
          this.setState((prevState, props) => {
            const system = { ...prevState.system };
            system.dai.cdpManagerApproved = r;
            return { system };
          })
        }
        else console.log(e);
      })
  }

  getCDPFromOwner = () => {
    if (this.state.profile.activeProfile)
      this.cdpManagerObj.getCDPFromOwner.call(this.state.profile.activeProfile, (e, r) => {
        this.setState((prevState, props) => {
          const profile = { ...prevState.profile };
          profile.cdpId = r;
          this.verifyCDPOwner(r);
          return { profile };
        }, function () {
          this.tubObj.cups.call(r, (e, response) => {
            if (!e) this.setState((prevState, props) => {
              const profile = { ...prevState.profile };
              profile.stabilityDebt = response[2] / 1000000000000000000;
              return { profile };
            })

          })
        })
      })
  }

  verifyCDPOwner = (cdp) => {
    this.cdpManagerObj.cdpOwner.call(cdp, this.state.profile.activeProfile, (e, r) => {
      if (!e) this.setState((prevState, props) => {
        const profile = { ...prevState.profile };
        profile.isOwner = r;
        if (r) this.getCup(cdp).then(cup => {
          this.setState((prevState, props) => {
            const cdpManager = prevState.system.cdpManager;
            cdpManager.cup = cup;
            cdpManager.cupLoading = false;
            return { cdpManager };
          });
        })
        else this.setState((prevState, props) => {
          const cdpManager = prevState.system.cdpManager;
          cdpManager.cupLoading = false;
          return { cdpManager };
        });
        return { profile };
      })
      else console.log('erroro: ', e)
    })

  }

  moveCDP = (cdp) => {
    const guy = this.state.profile.activeProfile;
    const id = Math.random();
    const title = `Wrap CDP: ${web3.toDecimal(cdp)}`;

    this.setState((prevState, props) => {
      const profile = prevState.profile
      profile.cdpId = -1;
      return { profile }
    })

    this.setState((prevState, props) => {
      const cdpManager = prevState.system.cdpManager;
      cdpManager.transfering = true;
      return { cdpManager }
    })

    this.logRequestTransaction(id, title);
    const callback = (res) => {
      console.log(res);
    }

    const log = (e, tx) => {
      if (!e) {
        // console.log('transfering cdp: '+cdp);
        api.transferCDP(guy, cdp, callback);
        this.logPendingTransaction(id, tx, title, [['refreshCDPs'], ['getCDPFromOwner']]);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title, this.getCDPFromOwner);
      }
    }
    this.tubObj.give(cdp, settings.chain[this.state.network.network].EasyCDPManager, log);
  }

  getBackCDP = () => {
    this.setState((prevState, props) => {
      const cdpManager = prevState.system.cdpManager;
      cdpManager.transfering = true;
      return { cdpManager }
    })

    const id = Math.random();
    const title = 'Unwrap CDP';
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title, [['refreshCDPs']]);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title, this.refreshCDPs);
      }
    }
    this.cdpManagerObj.getBackCDP(log);
  }

  getTotalCDPs = () => {
    this.tubObj.cupi.call((e, r) => {
      if (!e) this.setState((prevState, props) => {
        const tub = prevState.system.tub;
        tub.totalCDPs = parseInt(r);
        return { tub };
      })
    })
  }

  transferToken = (token, to, amount) => {
    const tokenName = token.replace('gem', 'weth').replace('gov', 'mkr').replace('skr', 'peth').toUpperCase();
    const id = Math.random();
    const title = `${tokenName}: transfer ${to} ${amount}`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title, [['setUpToken', token]]);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
      this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.tokenActions,
        `${this.methodSig(`transfer(address,address,uint256)`)}${addressToBytes32(this[`${token}Obj`].address, false)}${addressToBytes32(to, false)}${toBytes32(web3.toWei(amount), false)}`,
        log);
    } else {
      this[`${token}Obj`].transfer(to, web3.toWei(amount), {}, log);
    }
  }

  wrapUnwrap = (operation, amount) => {
    const id = Math.random();
    const title = `WETH: ${operation} ${amount}`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title, [['setUpToken', 'gem'], ['getAccountBalance']]);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (operation === 'wrap') {
      if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
        this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.tokenActions,
          `${this.methodSig(`deposit(address,uint256)`)}${addressToBytes32(this.gemObj.address, false)}${toBytes32(web3.toWei(amount), false)}`,
          log);
      } else {
        this.gemObj.deposit({ value: web3.toWei(amount) }, log);
      }
    } else if (operation === 'unwrap') {
      if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
        this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.tokenActions,
          `${this.methodSig(`withdraw(address,uint256)`)}${addressToBytes32(this.gemObj.address, false)}${toBytes32(web3.toWei(amount), false)}`,
          log);
      } else {
        this.gemObj.withdraw(web3.toWei(amount), {}, log);
      }
    }
  }

  approveDai = (amount = this.state.system.dai.myBalance / 1000000000000000000) => {
    this.setState((prevState, props) => {
      const dai = prevState.system.dai;
      dai.cdpManagerApproved = web3.toBigNumber(-1);
      return { dai }
    })
    const address = settings.chain[this.state.network.network].Repay;
    const id = Math.random();
    const title = 'Approving DAI: ' + amount;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title, [['getDaiAllowance']]);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title, this.getDaiAllowance);
      }
    }
    const load_up = {
      gasPrice: this.state.system.gasPrice,
      gas: 77232,
      value: web3.toWei(0, 'ether'),
    }

    this.daiObj.approve.sendTransaction(address, web3.toWei(amount),load_up, log)
  }

  approve = (token, dst, val) => {
    const tokenName = token.replace('gem', 'weth').replace('gov', 'mkr').replace('skr', 'peth').toUpperCase();
    const action = {
      gem: {
        tub: 'Join',
        tap: 'Mock'
      },
      skr: {
        tub: 'Exit/Lock',
        tap: 'Boom'
      },
      dai: {
        tub: 'Wipe/Shut',
        tap: 'Bust/Cash'
      },
      gov: {
        tub: 'Wipe/Shut'
      }
    }
    const id = Math.random();
    const title = `${tokenName}: ${val ? 'approve' : 'deny'} ${action[token][dst]}`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title, [['getApproval', token, dst]]);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
      this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.tokenActions,
        `${this.methodSig('approve(address,address,bool)')}${addressToBytes32(this[`${token}Obj`].address, false)}${addressToBytes32(this[`${dst}Obj`].address, false)}${toBytes32(val ? web3.toBigNumber(2).pow(256).minus(1).valueOf() : 0, false)}`,
        log);
    } else {
      this[`${token}Obj`].approve(this[`${dst}Obj`].address, val ? -1 : 0, (e, tx) => log(e, tx));
    }
  }

  approveAll = val => {
    const id = Math.random();
    const title = `WETH/MKR/PETH/DAI: ${val ? 'approve' : 'deny'} all`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    if (this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)) {
      this.proxyObj.execute['address,bytes'](settings.chain[this.state.network.network].proxyContracts.customActions,
        `${this.methodSig('approveAll(address,address,bool)')}${addressToBytes32(this.tubObj.address, false)}${addressToBytes32(this.tapObj.address, false)}${toBytes32(val, false)}`,
        log);
    }
  }
  //

  changeMode = () => {
    const profile = { ...this.state.profile };
    profile.mode = profile.mode !== 'proxy' ? 'proxy' : 'account';
    profile.activeProfile = profile.mode === 'proxy' ? profile.proxy : this.state.network.defaultAccount;
    profile.accountBalance = web3.toBigNumber(-1);
    if (profile.mode === 'proxy' && !web3.isAddress(profile.proxy)) {
      this.setState({ modal: { show: true, method: 'proxy' } });
    } else {
      this.setState({ profile }, () => {
        localStorage.setItem('mode', profile.mode);
        this.initContracts(this.state.system.top.address);
        this.initCDPManager();
      });
    }
  }

  changeManagementMode = (mode) => {
    document.getElementById(mode + 'tab').click();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  handleChangeCDP = (cdp) => {
    this.setState({ selectedCDP: cdp });
  }

  setNewCupsTab = (cupsList) => {
    this.setState((prevState, props) => {
      const system = { ...prevState.system };
      const tub = { ...system.tub };
      tub.cups = {};
      tub.cupsLoading = true;
      tub.cupsPage = 1;
      tub.cupsList = cupsList;
      system.tub = tub;
      return { system };
    }, () => {
      localStorage.setItem('cupsList', cupsList);
      this.getCups(settings['CDPsPerPage']);
    });
  }

  showNewCup = () => {
    this.setNewCupsTab('mine');
  }

  handleDialChange = (newValue) => {
    this.setState({ value: newValue });
  };

  listCups = e => {
    e.preventDefault();
    const cupsList = e.target.getAttribute('data-value');
    this.setNewCupsTab(cupsList);
  }

  moveCupsPage = e => {
    e.preventDefault();
    const page = parseInt(e.target.getAttribute('data-page'), 10);

    this.setState((prevState, props) => {
      const system = { ...prevState.system };
      const tub = { ...system.tub };
      tub.cups = {};
      tub.cupsLoading = true;
      tub.cupsPage = page;
      system.tub = tub;
      return { system };
    }, () => {
      this.getCups(settings['CDPsPerPage'], settings['CDPsPerPage'] * (page - 1));
    });
  }
  //

  handleChangeBorrow = (dai, lev, eth) => {
    this.setState((prevState, props) => {
      const cdpManager = prevState.system.cdpManager;
      cdpManager.getDai = dai;
      cdpManager.leverage = lev;
      cdpManager.lockupEth = eth;
      return { cdpManager };
    })
  }

  handleChangeLeverage = (leverage) => {
    let ethPrice = this.state.system.pip.val / 1000000000000000000;
    let ethBalance = this.state.profile.accountBalance / 1000000000000000000; //transaction fee
    this.setState((prevState, props) => {
      const cdpManager = prevState.system.cdpManager;
      cdpManager.leverage = leverage;
      if (cdpManager.lockupEth && cdpManager.lockupEth >= 0) {
        cdpManager.getDai = (((cdpManager.lockupEth) * ethPrice) * (leverage - 1)).toFixed(2);
        return { cdpManager };
      }
      cdpManager.getDai = ((ethBalance * ethPrice) * (leverage - 1)).toFixed(2);
      cdpManager.lockupEth = ethBalance.toFixed(6);
      return { cdpManager };
    }, () => {
      this.setDials();
    })
    return leverage;
  }

  handleChangeGetDai = (dai) => {
    let ethPrice = this.state.system.pip.val / 1000000000000000000;
    this.setState((prevState, props) => {
      const cdpManager = prevState.system.cdpManager;
      let leverage = cdpManager.leverage || this.silentChangeLeverage();

      cdpManager.getDai = dai;
      cdpManager.lockupEth = (((dai / ethPrice) / (leverage - 1))).toFixed(6);
      return { cdpManager };
    }, () => {
      this.setDials();
    })
  }

  handleChangeLockup = (eth) => {
    let ethPrice = this.state.system.pip.val / 1000000000000000000;
    this.setState((prevState, props) => {
      const cdpManager = prevState.system.cdpManager;
      let leverage = cdpManager.leverage || this.silentChangeLeverage()
      cdpManager.getDai = ((eth * ethPrice) * ((leverage) - 1)).toFixed(2);
      cdpManager.lockupEth = eth;
      return { cdpManager };
    }, () => {
      this.setDials();
    })
  }

  silentChangeLeverage = (leverage = 1.165) => {
    this.setState((prevState, props) => {
      const cdpManager = prevState.system.cdpManager;
      cdpManager.leverage = leverage;
      return { cdpManager }
    })
    return leverage;
  }

  handleChangeSafetyNet = (val) => {
    let pethEthRatio = this.state.system.tub.per / 1000000000000000000;
    let ethPrice = this.state.system.pip.val / 1000000000000000000;
    // console.log('changing to: ' + val)
    return this.setState((prevState, props) => {
        const cdpManager = prevState.system.cdpManager;
        cdpManager.safetyNet = val;
        let leverage = 1 + ((ethPrice * (val / 100 - 1) * cdpManager.lockupEth * pethEthRatio) / ((-1.5) * cdpManager.lockupEth * ethPrice))
        // console.log('newLev: ' + leverage);
        this.handleChangeLeverage(leverage.toFixed(3));
        return { cdpManager };
      },
      function () {
        this.setDialColors(val);
        this.setDials();
      }

    )
  }

  handleChangeDai = (val) => {
    this.setState((prevState, props) => {
      const cdpManager = prevState.system.cdpManager;
      cdpManager.availableDai = val;
      return { cdpManager };
    })
  }

  handleChangePeth = (val) => {
    this.setState((prevState, props) => {
      const cdpManager = prevState.system.cdpManager;
      cdpManager.availablePeth = val;
      return { cdpManager };
    })
  }

  handleChangeRepay = (val) => {
    this.setState((prevState, props) => {
      const cdpManager = prevState.system.cdpManager;
      cdpManager.repay = val;
      return { cdpManager };
    })
  }

  handleChangeLiquidationPrice = (price) => {
    const ethPrice = this.state.system.pip.val / 1000000000000000000;
    this.handleChangeSafetyNet(100 * (ethPrice - price) / ethPrice);
  }

  getUserExtraEth = () => {
    if (this.state.profile.activeProfile) {
      this.cdpManagerObj.ethInManager(this.state.profile.activeProfile, (e, r) => {
        if (e) console.log(e);
        else this.setState((prevState, props) => {
          let profile = prevState.profile;
          profile.extraEth = r;
          return { profile };
        })
      })
    }
  }

  redeemExtraEth = () => {
    const id = Math.random();
    const title = `Redeem Extra Eth:`;
    this.logRequestTransaction(id, title);
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    this.cdpManagerObj.refundExtraEth(log);
  }

  refreshCDPs = () => {
    this.setState((prevState, props) => {
      const system = { ...prevState.system };
      const tub = { ...prevState.system.tub };
      const cdpManager = { ...prevState.system.cdpManager };
      cdpManager.cup = {};
      cdpManager.cupLoading = true;
      cdpManager.transfering = false;
      tub.cups = {};
      tub.cupsLoading = true;
      system.tub = tub;
      system.cdpManager = cdpManager;
      return { system };
    }, () => {
      this.getCups(settings['CDPsPerPage']);
      this.getCDPFromOwner();
    });
  }

  createCDP = () => {
    const dai = this.state.system.cdpManager.getDai;
    const eth = this.state.system.cdpManager.lockupEth;
    if (!dai || !eth) return false;
    const id = Math.random();
    const title = `Borrowing...\nGet: ${parseFloat(dai).toFixed(3)}\nLock Up: ${parseFloat(eth).toFixed(3)}`;
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title, [['refreshCDPs'], ['getCDPFromOwner']]);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    const load_up = {
      from: this.state.profile.activeProfile,
      to: settings.chain[this.state.network.network].EasyCDPManager,
      value: web3.toWei(eth, 'ether'),
      gasPrice: this.state.system.gasPrice,
      gas: 772321,
    }

    this.logRequestTransaction(id, title);
    if (this.state.profile.isOwner) {
      this.cdpManagerObj.borrowMore.sendTransaction(this.state.profile.cdpId, web3.toWei(dai), web3.toWei(eth), "test", load_up, log)
      return;
    }
    this.cdpManagerObj.originateCDP.sendTransaction(web3.toWei(dai), web3.toWei(eth), "test", load_up, log)
  }

  repayCDP = () => {
    const amount = this.state.cdpManager.repayDai;
    const cdp = this.state.cdpManager.repayCDP;
    const fee = this.state.cdpManager.repayEthFee;

    const cdpId = toBytes32(cdp);
    const id = Math.random();;
    const title = `Repaying ${parseFloat(amount).toFixed(3)} Dai on CDP ${cdp}...`;

    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title, [['refreshCDPs']]);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }

    const load_up = {
      from: this.state.profile.activeProfile,
      to: settings.chain[this.state.network.network].Repay,
      value: web3.toWei(fee, 'ether'),
      gasPrice: this.state.system.gasPrice,
      gas: 772321,
    }

    this.logRequestTransaction(id, title);
    this.repayObj.repay.sendTransaction(cdpId, web3.toWei(amount),web3.toWei(amount),load_up, log)
  }


  setInitialDaiBox = () => {
    const ethBalance = this.state.profile.accountBalance / 1000000000000000000
    const ethPrice = this.state.system.pip.val / 1000000000000000000;
    const leverage = this.state.system.cdpManager.leverage;
    let dai = ((ethBalance) * ethPrice) * (leverage - 1);
    dai = dai > 100 ? Math.floor(dai / 100) * 100 : Math.floor(dai / 10) * 10;
    this.handleChangeGetDai(dai);
  }

  setDialColors = (val) => {
    let color;
    if (val < 33.333) color = "#F44336";
    else if (val < 66.666) color = "#FFD600";
    else color = "#4CAF50";
    this.setState((prevState, props) => {
      const cdpManager = prevState.system.cdpManager;
      cdpManager.safetyNetColor = color;
      return { cdpManager }
    })
  }

  switchCDPMode = (mode) => {
    this.setState((prevState, props) => {
      let cdpManager = prevState.system.cdpManager;
      cdpManager.mode = mode;
      return { cdpManager };
    })
  }

  stageRepay = (cdp,repayDai, liquidationPrice)=>{
    let ethPrice = this.state.system.pip.val / 1000000000000000000;
    this.setState((prevState, props) => {
      let cdpManager = prevState.system.cdpManager;
      cdpManager.repayDai = repayDai;
      cdpManager.repayCDP = cdp;
      cdpManager.repayLiquidation = liquidationPrice;
      cdpManager.repayDaiFee = repayDai * .007;
      cdpManager.repayEthFee = (repayDai/ ethPrice *.007).toFixed(6);
      return { cdpManager };
    },()=>{
      console.log('FEE: '+this.state.cdpManager.repayEthFee)
      this.handleOpenConfirmationModal();
    })
  }

  setDials = () => {
    // console.log('updating dials')
    let pethEthRatio = this.state.system.tub.per / 1000000000000000000;
    let ethPrice = this.state.system.pip.val / 1000000000000000000;
    this.setState((prevState, props) => {
      let cdpManager = prevState.system.cdpManager;
      cdpManager.liquidationPrice = (cdpManager.getDai * 1.5) / (cdpManager.lockupEth * pethEthRatio);
      // console.log('new Liquidation Price: ' + cdpManager.liquidationPrice)
      return { cdpManager };
    }, () => {
      this.setState((prevState, props) => {
        let cdpManager = prevState.system.cdpManager;
        cdpManager.safetyNet = 100 * (ethPrice - cdpManager.liquidationPrice) / ethPrice;
        // console.log('new safetyNet: ' + cdpManager.safetyNet)
        return { cdpManager };
      }, () => {
        this.setState((prevState, props) => {
          let cdpManager = prevState.system.cdpManager;
          cdpManager.availableDai = (cdpManager.lockupEth * ethPrice) * (2 / 3);
          cdpManager.availableDai = ((cdpManager.getDai) / cdpManager.availableDai) * 100
          return { cdpManager };
        }, () => {
          this.setDialColors(this.state.cdpManager.safetyNet);
        })
      })
    })

  }

  approvePethEth = () => {
    const amount = this.state.system.skr.myBalance;
    const id = Math.random();
    const title = `(1/2) Approving EasyCDP to use PETH`;

    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title, [['convertPethToEth', amount]]);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    const load_up = {
      gasPrice: this.state.system.gasPrice,
      value: web3.toWei(0, 'ether'),
    }
    this.logRequestTransaction(id, title);
    this.skrObj.approve(settings.chain[this.state.network.network].EthLocker, amount, load_up, log)
  }

  convertPethToEth = (amount) => {
    const id = Math.random();
    const title = `(2/2) Converting ${web3.fromWei(amount).toFixed(3)} PETH to ETH`;
    const log = (e, tx) => {
      if (!e) {
        this.logPendingTransaction(id, tx, title, [['setUpToken', 'skr'], ['getAccountBalance']]);
      } else {
        console.log(e);
        this.logTransactionRejected(id, title);
      }
    }
    const load_up = {
      gasPrice: this.state.system.gasPrice,
      gas: 1000000,
      value: web3.toWei(0, 'ether'),
    }
    this.logRequestTransaction(id, title);
    this.ethLockerObj.convertPETHToETH(amount, load_up, log)
  }

  renderiFrame() {
    return (
      <div className="content-wrapper">
        <section className="iframe-content">
          <div>
            <div className="row">
              <div className="col-md-12">
                <BorrowSmall
                  profile={this.state.profile}
                  safetyNetColor={this.state.system.cdpManager.safetyNetColor}
                  changeLiquidation={this.handleChangeLiquidationPrice}
                  handleChangeSafetyNet={this.handleChangeSafetyNet}
                  handleChangeGetDai={this.handleChangeGetDai}
                  handleChangeLeverage={this.handleChangeLeverage}
                  handleChangeLockup={this.handleChangeLockup}
                  handleChangeRepay={this.handleChangeRepay}
                  handleOpenConfirmationModal={this.handleOpenConfirmationModal}
                  profile={this.state.profile}
                  mode={this.switchCDPMode}
                  repayCDP={this.repayCDP}
                  system={this.state.system}
                  cdpId={this.state.profile.cdpId}
                  approveDai={this.approveDai}
                  moveCDP={this.moveCDP}
                  account={this.state.network.defaultAccount}
                  ethPrice={this.state.system.pip.val}
                  ethBalance={this.state.profile.accountBalance}
                  cdpManager={this.state.system.cdpManager}
                  allowance={this.state.system.dai.cdpManagerApproved}
                  safetyNet={this.state.system.cdpManager.safetyNet}
                  liquidationPrice={this.state.system.cdpManager.liquidationPrice || 0}
                  createCDP={this.createCDP} />
              </div>
              <div className="col-md-12">
                <CupsSmall
                  getBackCDP={this.getBackCDP}
                  refreshCDPs={this.refreshCDPs}
                  cdpManager={this.state.system.cdpManager}
                  activeProfile={this.state.profile.activeProfile}
                  moveCDP={this.moveCDP}
                  pethEthRatio={this.state.system.tub.per / 1000000000000000000}
                  system={this.state.system}
                  network={this.state.network.network}
                  profile={this.state.profile}
                  handleOpenModal={this.handleOpenModal}
                  handleOpenCupHistoryModal={this.handleOpenCupHistoryModal}
                  listCups={this.listCups}
                  moveCupsPage={this.moveCupsPage}
                  tab={this.tab}
                  rap={this.rap} />
              </div>
            </div>
          </div>
          <Modal ethBalance={this.state.profile.accountBalance} system={this.state.system} modal={this.state.modal} updateValue={this.updateValue} handleCloseModal={this.handleCloseModal} tab={this.tab} rap={this.rap} proxyEnabled={this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)} />
          <ConfirmationModal create={this.createCDP}  easy={this.state.system.cdpManager} modal={this.state.confirmationModal} handleClose={this.handleCloseConfirmationModal} />
          <ReactNotify ref='notificator' />
        </section>
      </div>
    );
  }

  renderMain() {
    return (
      <div className="content-wrapper">
        <header className="main-header">
          <NavBar
            openAuthModal={this.handleOpenAuthModal}
            openSecurityModal={this.handleOpenSecurityModal}
            etherPrice={this.state.system.pip.val}
            daiBalance={this.state.system.dai.myBalance}
            accountBalance={this.state.profile.accountBalance}
            network={this.state.network.network}
            account={this.state.network.defaultAccount}
            openAboutModal={this.handleOpenAboutModal}
          />

        </header>

        <section className="content-header">
          {
            settings.chain[this.state.network.network].proxyFactory
              ?
              <div className="onoffswitch mode-box">
                <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitchpMode" checked={this.state.profile.mode === 'proxy'} onChange={this.changeMode} />
                <label className="onoffswitch-label" htmlFor="myonoffswitchpMode">
                  <span className="onoffswitch-inner"></span>
                  <span className="onoffswitch-switch"></span>
                </label>
              </div>
              :
              ''
          }
        </section>
        <section className="content">
          <div>
            <div className="row">
              <Stats
                profile={this.state.profile}
                cdpCount={this.state.system.tub.totalCDPs}
                skr={this.state.system.skr}
                dai={this.state.system.dai}
                pethEthRatio={this.state.system.tub.per} />
              <MyWallet
                convert={this.approvePethEth}
                pethBalance={this.state.system.skr.myBalance}
                openAuthModal={this.handleOpenAuthModal}
                openSecurityModal={this.handleOpenSecurityModal}
                etherPrice={this.state.system.pip.val}
                daiBalance={this.state.system.dai.myBalance}
                accountBalance={this.state.profile.accountBalance}
                network={this.state.network.network}
                account={this.state.network.defaultAccount}
                openAboutModal={this.handleOpenAboutModal}
              />
            </div>
            <div className="row">
              <div className="col-md-12">
                <Cups
                  changeCDP={this.handleChangeCDP}
                  changeMode={this.changeManagementMode}
                  selectManage={Borrow.selectManage}
                  selectRepay={Borrow.selectRepay}
                  getBackCDP={this.getBackCDP}
                  refreshCDPs={this.refreshCDPs}
                  cdpManager={this.state.system.cdpManager}
                  activeProfile={this.state.profile.activeProfile}
                  moveCDP={this.moveCDP}
                  pethEthRatio={this.state.system.tub.per / 1000000000000000000}
                  system={this.state.system}
                  network={this.state.network.network}
                  profile={this.state.profile}
                  handleOpenModal={this.handleOpenModal}
                  handleOpenCupHistoryModal={this.handleOpenCupHistoryModal}
                  listCups={this.listCups}
                  moveCupsPage={this.moveCupsPage}
                  tab={this.tab}
                  rap={this.rap} />
              </div>
              <div className="col-md-12">
                <Borrow
                  dai={this.state.system.dai}
                  stageRepay={this.stageRepay}
                  tab={this.tab}
                  selectedCDP={this.state.selectedCDP}
                  handleChangeCDP={this.handleChangeCDP}
                  handleOpenModal={this.handleOpenModal}
                  system={this.state.system}
                  cupSelected={794}
                  profile={this.state.profile}
                  safetyNetColor={this.state.system.cdpManager.safetyNetColor}
                  changeLiquidation={this.handleChangeLiquidationPrice}
                  handleChangeSafetyNet={this.handleChangeSafetyNet}
                  handleChangeGetDai={this.handleChangeGetDai}
                  handleChangeLeverage={this.handleChangeLeverage}
                  handleChangeLockup={this.handleChangeLockup}
                  handleChangeRepay={this.handleChangeRepay}
                  handleOpenConfirmationModal={this.handleOpenConfirmationModal}
                  profile={this.state.profile}
                  mode={this.switchCDPMode}
                  repayCDP={this.repayCDP}
                  system={this.state.system}
                  cdpId={this.state.profile.cdpId}
                  approveDai={this.approveDai}
                  moveCDP={this.moveCDP}
                  account={this.state.network.defaultAccount}
                  ethPrice={this.state.system.pip.val}
                  ethBalance={this.state.profile.accountBalance}
                  cdpManager={this.state.system.cdpManager}
                  allowance={this.state.system.dai.cdpManagerApproved}
                  safetyNet={this.state.system.cdpManager.safetyNet}
                  liquidationPrice={this.state.system.cdpManager.liquidationPrice || 0}
                  createCDP={this.createCDP} />
              </div>
            </div>
          </div>
          <AuthSuccessModal modal={this.state.authSuccessModal} handleClose={this.handleCloseAuthSuccessModal} />
          <OnboardingModal modal={this.state.onboardingModal} handleClose={this.handleCloseOnboardingModal} />
          <AboutModal modal={this.state.aboutModal} handleCloseAboutModal={this.handleCloseAboutModal} />
          <ConfirmationModal create={this.createCDP} repay={this.repayCDP} easy={this.state.system.cdpManager} modal={this.state.confirmationModal} handleClose={this.handleCloseConfirmationModal} />
          <SecurityModal enable={this.enable2fa} securityEnabled={this.state.profile.securityEnabled} handleSuccess={this.handleOpenAuthSuccessModal} validateSecurityCode={this.validateTempSecurityCode} setPhoneNumber={this.setPhoneNumber} modal={this.state.securityModal} handleClose={this.handleCloseSecurityModal} />
          <CupHistoryModal modal={this.state.cupHistoryModal} handleCloseCupHistoryModal={this.handleCloseCupHistoryModal} network={this.state.network.network} />
          <Modal ethBalance={this.state.profile.accountBalance} system={this.state.system} modal={this.state.modal} updateValue={this.updateValue} handleCloseModal={this.handleCloseModal} tab={this.tab} rap={this.rap} proxyEnabled={this.state.profile.mode === 'proxy' && web3.isAddress(this.state.profile.proxy)} />
          <ReactNotify ref='notificator' />
        </section>
      </div>
    );
  }

  render() {
    return (
      (new URLSearchParams(window.location.search)).has('iframe') ?
        this.state.network.isConnected ?
          this.renderiFrame()
          : <NoConnection checkNetwork={this.checkNetwork} startIntervals={this.startIntervals} />
        : this.state.network.isConnected ? this.renderMain() : <NoConnection checkNetwork={this.checkNetwork} startIntervals={this.startIntervals} />
    );
  }
}

export default App;



// WEBPACK FOOTER //
// ./src/App.js