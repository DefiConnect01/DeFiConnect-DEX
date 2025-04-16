import AccountStore from './accountStore';
import StableSwapStore from './stableSwapStore';
import MultiSwapStore from "./multiSwapStore";
import LoanStore from "./loanStore";
import CrossChain from "./cross-chain";

import { Dispatcher } from 'flux';
import { EventEmitter as Emitter } from 'events';

const dispatcher = new Dispatcher();
const emitter = new Emitter();

const accountStore = new AccountStore(dispatcher, emitter);
const stableSwapStore = new StableSwapStore(dispatcher, emitter);
const multiSwapStore = new MultiSwapStore(dispatcher, emitter);
const loanStore = new LoanStore(dispatcher, emitter);
const crossChain = new CrossChain(dispatcher, emitter);

export default {
  accountStore,
  stableSwapStore,
  multiSwapStore,
  loanStore,
  crossChain,
  dispatcher,
  emitter,
};
