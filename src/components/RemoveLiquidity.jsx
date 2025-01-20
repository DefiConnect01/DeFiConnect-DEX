import React, { useEffect, useState } from 'react'
import stores from '../stores';
import { ACTIONS } from '../stores/constants/constants';
import BigNumber from "bignumber.js";


const RemoveLiquidity = () => {
  const [pairReadOnly, setPairReadOnly] = useState(false);

  const [pair, setPair] = useState(null);
  const [veToken, setVeToken] = useState(null);

  const [depositLoading, setDepositLoading] = useState(false);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [depositStakeLoading, setDepositStakeLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");

  const [stable, setStable] = useState(false);

  const [asset0, setAsset0] = useState(null);
  const [asset1, setAsset1] = useState(null);
  const [assetOptions, setAssetOptions] = useState([]);

  const [withdrawAsset, setWithdrawAsset] = useState(null);
  const [withdrawAassetOptions, setWithdrawAssetOptions] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [withdrawAmount0, setWithdrawAmount0] = useState("");
  const [withdrawAmount1, setWithdrawAmount1] = useState("");

  const [quote, setQuote] = useState(null);
  const [withdrawQuote, setWithdrawQuote] = useState(null);

  const [advanced, setAdvanced] = useState(true);

  const [token, setToken] = useState(null);
  const [vestNFTs, setVestNFTs] = useState([]);

  const ssUpdated = async () => {
    const storeAssetOptions = stores.stableSwapStore.getStore("baseAssets");
    const nfts = stores.stableSwapStore.getStore("vestNFTs");
    const veTok = stores.stableSwapStore.getStore("veToken");
    const pairs = stores.stableSwapStore.getStore("pairs");
    console.log({storeAssetOptions, nfts, veTok, pairs})

    const onlyWithBalance = pairs.filter((ppp) => {
      return (
        BigNumber(ppp.balance).gt(0) ||
        (ppp.gauge && BigNumber(ppp.gauge.balance).gt(0))
      );
    });

    setWithdrawAssetOptions(onlyWithBalance);
    setWithdrawAsset(onlyWithBalance[0]);
    setAssetOptions(storeAssetOptions);
    setVeToken(veTok);
    setVestNFTs(nfts);

    if (nfts.length > 0) {
      if (token == null) {
        setToken(nfts[0]);
      }
    }
    
    const address = "0x7B9A90a535395ee272435E13Bac3372372AE3356"; //vAMM-WETH/TGS
    const addressA = "0x46961dBC53AF28CE82479f6e1eA10F6477CfEca3"; 
    const addressB = "0xcFd2cb035A6647dC553a2Ef65b9694E2D076475f";
    const stab = false;
    if (address) {
      setPairReadOnly(true);

      const pp = await stores.stableSwapStore.getPairByAddress(
        address
      );

      console.log({pp})
      const pp2 = await stores.stableSwapStore.getPair(
        addressA,
        addressB,
        stab
      )
      console.log({ pp2 })
      setPair(pp2);

      if (pp2) {
        setWithdrawAsset(pp);
        setAsset0(pp2.token0);
        setAsset1(pp2.token1);
        setStable(pp2.isStable);
      }

      if (pp2 && BigNumber(pp2.balance).gt(0)) {
        setAdvanced(true);
      }
    } else {
      let aa0 = asset0;
      let aa1 = asset1;

      if (storeAssetOptions.length > 0 && asset0 == null) {
        const wETHIndex = storeAssetOptions.findIndex((token) => {
          return token.id == DEFAULT_ASSET_FROM;
        });
        setAsset0(storeAssetOptions[wETHIndex]);
        aa0 = storeAssetOptions[wETHIndex];
      }
      if (storeAssetOptions.length > 0 && asset1 == null) {
        const dystIndex = storeAssetOptions.findIndex((token) => {
          return token.id == DEFAULT_ASSET_TO;
        });
        setAsset1(storeAssetOptions[dystIndex]);
        aa1 = storeAssetOptions[dystIndex];
      }
      if (withdrawAassetOptions.length > 0 && withdrawAsset == null) {
        setWithdrawAsset(withdrawAassetOptions[0]);
      }

      if (aa0 && aa1) {
        const p = await stores.stableSwapStore.getPair(
          aa0.address,
          aa1.address,
          stable
        );
        setPair(p);
      }
    }
  };

  useEffect(() => {
    ssUpdated()
    const depositReturned = () => {
      setDepositLoading(false);
      setStakeLoading(false);
      setDepositStakeLoading(false);
      setCreateLoading(false);

      setAmount0("");
      setAmount1("");
      setQuote(null);
      setWithdrawAmount("");
      setWithdrawAmount0("");
      setWithdrawAmount1("");
      setWithdrawQuote(null);

      onBack();
    };

    const createGaugeReturned = () => {
      setCreateLoading(false);
      ssUpdated();
    };

    const errorReturned = () => {
      setDepositLoading(false);
      setStakeLoading(false);
      setDepositStakeLoading(false);
      setCreateLoading(false);
    };

    const quoteAddReturned = (res) => {
      setQuote(res.output);
    };

    const quoteRemoveReturned = (res) => {
      if (!res) {
        return;
      }
      setWithdrawQuote(res.output);
      setWithdrawAmount0(res.output.amount0);
      setWithdrawAmount1(res.output.amount1);
    };

    const assetsUpdated = () => {
      setAssetOptions(stores.stableSwapStore.getStore("baseAssets"));
    };

    // ssUpdated();

    stores.emitter.on(ACTIONS.UPDATED, ssUpdated);
    stores.emitter.on(ACTIONS.LIQUIDITY_ADDED, depositReturned);
    stores.emitter.on(ACTIONS.ADD_LIQUIDITY_AND_STAKED, depositReturned);
    stores.emitter.on(ACTIONS.LIQUIDITY_REMOVED, depositReturned);
    stores.emitter.on(ACTIONS.REMOVE_LIQUIDITY_AND_UNSTAKED, depositReturned);
    stores.emitter.on(ACTIONS.LIQUIDITY_STAKED, depositReturned);
    stores.emitter.on(ACTIONS.LIQUIDITY_UNSTAKED, depositReturned);
    stores.emitter.on(ACTIONS.PAIR_CREATED, depositReturned);
    stores.emitter.on(ACTIONS.QUOTE_ADD_LIQUIDITY_RETURNED, quoteAddReturned);
    stores.emitter.on(
      ACTIONS.QUOTE_REMOVE_LIQUIDITY_RETURNED,
      quoteRemoveReturned
    );
    stores.emitter.on(ACTIONS.CREATE_GAUGE_RETURNED, createGaugeReturned);
    stores.emitter.on(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated);
    stores.emitter.on(ACTIONS.ERROR, errorReturned);

    return () => {
      stores.emitter.removeListener(ACTIONS.UPDATED, ssUpdated);
      stores.emitter.removeListener(ACTIONS.LIQUIDITY_ADDED, depositReturned);
      stores.emitter.removeListener(
        ACTIONS.ADD_LIQUIDITY_AND_STAKED,
        depositReturned
      );
      stores.emitter.removeListener(ACTIONS.LIQUIDITY_REMOVED, depositReturned);
      stores.emitter.removeListener(
        ACTIONS.REMOVE_LIQUIDITY_AND_UNSTAKED,
        depositReturned
      );
      stores.emitter.removeListener(ACTIONS.LIQUIDITY_STAKED, depositReturned);
      stores.emitter.removeListener(
        ACTIONS.LIQUIDITY_UNSTAKED,
        depositReturned
      );
      stores.emitter.removeListener(ACTIONS.PAIR_CREATED, depositReturned);
      stores.emitter.removeListener(
        ACTIONS.QUOTE_ADD_LIQUIDITY_RETURNED,
        quoteAddReturned
      );
      stores.emitter.removeListener(
        ACTIONS.QUOTE_REMOVE_LIQUIDITY_RETURNED,
        quoteRemoveReturned
      );
      stores.emitter.removeListener(
        ACTIONS.CREATE_GAUGE_RETURNED,
        createGaugeReturned
      );
      stores.emitter.removeListener(ACTIONS.BASE_ASSETS_UPDATED, assetsUpdated);
      stores.emitter.removeListener(ACTIONS.ERROR, errorReturned);
    };
  }, []);

  const handleRemoveLiquidity = () => {
    stores.dispatcher.dispatch({
        type: ACTIONS.REMOVE_LIQUIDITY, content: {
            token0: asset0,
            token1: asset1,
            pair, 
            percent: 100, 
            slippage: 10
        }
    })
  }

  return (
    <div>
      <p>Remove Liquidity</p>
      <button className='bg-rose-500 px-4 py-2 hove:bg-rose/80 rounded-full' onClick={handleRemoveLiquidity}>
        Remove x-liquidity
      </button>
    </div>
  )
}

export default RemoveLiquidity