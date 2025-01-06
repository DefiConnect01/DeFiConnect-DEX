import AccountStore from './accountStore';
import StableSwapStore from './stableSwapStore';
import MultiSwapStore from "./multiSwapStore";

import { Dispatcher } from 'flux';
import { EventEmitter as Emitter } from 'events';

const dispatcher = new Dispatcher();
const emitter = new Emitter();

const accountStore = new AccountStore(dispatcher, emitter);
const stableSwapStore = new StableSwapStore(dispatcher, emitter);
const multiSwapStore = new MultiSwapStore(dispatcher, emitter);

export default {
  accountStore,
  stableSwapStore,
  multiSwapStore,
  dispatcher,
  emitter,
};
