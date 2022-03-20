import React, { useMemo } from 'react';
import Page from '../../components/Page';
import Image from 'material-ui-image';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import { isMobile } from 'react-device-detect';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useTombStats from '../../hooks/useTombStats';
import useLpStats from '../../hooks/useLpStats';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usetShareStats from '../../hooks/usetShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useFantomPrice from '../../hooks/useFantomPrice';
import useTokenBalance from '../../hooks/useTokenBalance';
import useStakedBalance from '../../hooks/useStakedBalance';
import useBanks from '../../hooks/useBanks';
import Modal from '../../components/Modal';
import useEarnings from '../../hooks/useEarnings';
import useShareStats from '../../hooks/usetShareStats';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import { getDisplayBalance } from '../../utils/formatBalance';
import { tomb as tombTesting, tShare as tShareTesting } from '../../tomb-finance/deployments/deployments.testing.json';
import { tomb as tombProd, tShare as tShareProd } from '../../tomb-finance/deployments/deployments.mainnet.json';
import useTotalTreasuryBalance from '../../hooks/useTotalTreasuryBalance.js';
import useModal from '../../hooks/useModal';
import { Box, Button, CardContent, Grid, Paper, Typography } from '@material-ui/core';
import  Card  from '../../components/Card';
import ZapModal from '../Bank/components/ZapModal';

import { makeStyles } from '@material-ui/core/styles';
import useTombFinance from '../../hooks/useTombFinance';

// const BackgroundImage = createGlobalStyle`
//   body {
//     background-color: var(--black);
// }

// * {
//     border-radius: 0 !important;
// }
// `;

const BackgroundImage = createGlobalStyle`
  body {
    background-color: var(--black);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='32' viewBox='0 0 16 32'%3E%3Cg fill='%231D1E1F' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 24h4v2H0v-2zm0 4h6v2H0v-2zm0-8h2v2H0v-2zM0 0h4v2H0V0zm0 4h2v2H0V4zm16 20h-6v2h6v-2zm0 4H8v2h8v-2zm0-8h-4v2h4v-2zm0-20h-6v2h6V0zm0 4h-4v2h4V4zm-2 12h2v2h-2v-2zm0-8h2v2h-2V8zM2 8h10v2H2V8zm0 8h10v2H2v-2zm-2-4h14v2H0v-2zm4-8h6v2H4V4zm0 16h6v2H4v-2zM6 0h2v2H6V0zm0 24h2v2H6v-2z'/%3E%3C/g%3E%3C/svg%3E");
}

`;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      marginTop: '10px',
    },
  },
  card: {
    backgroundColor: 'rgba(229, 152, 155, 0.1)',
    boxShadow: 'none',
  },
}));

const buycreamAddress = 'https://traderjoexyz.com/trade?outputCurrency=0xD9FF12172803c072a36785DeFea1Aa981A6A0C18#/';
const viewCreamAddress = 'https://dexscreener.com/avalanche/0xe367414f29e247b2d92edd610aa6dd5a7fd631ba';
const viewCshareAddress = 'https://dexscreener.com/avalanche/0x5eef38855090ccc49a1b7391f4c7b9efbdfe1456';
const buycshareAddress = 'https://traderjoexyz.com/trade?outputCurrency=0xf8D0C6c3ddC03F43A0687847f2b34bfd6941C2A2#/';

const Home = () => {
  const classes = useStyles();
  const [banks] = useBanks();
  const activeBanks = banks.filter((bank) => !bank.finished);
  const creamAvaxBank = activeBanks[0];
  const cshareAvaxBank = activeBanks[1];
  const cshareCreamBank = activeBanks[3];
  const stakedBalanceCreamAvax = useStakedBalance(creamAvaxBank.contract, creamAvaxBank.poolId);
  const stakedBalanceCshareAvax = useStakedBalance(cshareAvaxBank.contract, cshareAvaxBank.poolId);
  const stakedBalanceCshareCream = useStakedBalance(cshareCreamBank.contract, cshareCreamBank.poolId);
  const stakedTokenPriceInDollarsCreamAvax = useStakedTokenPriceInDollars(
    creamAvaxBank.depositTokenName,
    creamAvaxBank.depositToken,
  );
  const stakedTokenPriceInDollarsCshareAvax = useStakedTokenPriceInDollars(
    cshareAvaxBank.depositTokenName,
    cshareAvaxBank.depositToken,
  );
  const stakedTokenPriceInDollarsCshareCream = useStakedTokenPriceInDollars(
    cshareCreamBank.depositTokenName,
    cshareCreamBank.depositToken,
  );
  const tShareStats = useShareStats();
  const tombStats = useTombStats();
  const stakedInDollarsCreamAvax = (
    Number(stakedTokenPriceInDollarsCreamAvax) *
    Number(getDisplayBalance(stakedBalanceCreamAvax, creamAvaxBank.depositToken.decimal))
  ).toFixed(2);
  const stakedInDollarsCshareAvax = (
    Number(stakedTokenPriceInDollarsCshareAvax) *
    Number(getDisplayBalance(stakedBalanceCshareAvax, cshareAvaxBank.depositToken.decimal))
  ).toFixed(2);
  const stakedInDollarsCshareCream = (
    Number(stakedTokenPriceInDollarsCshareCream) *
    Number(getDisplayBalance(stakedBalanceCshareCream, cshareCreamBank.depositToken.decimal))
  ).toFixed(2);
  const earningsCreamAvax = useEarnings(creamAvaxBank.contract, creamAvaxBank.earnTokenName, creamAvaxBank.poolId);
  const earningsCshareAvax = useEarnings(cshareAvaxBank.contract, cshareAvaxBank.earnTokenName, cshareAvaxBank.poolId);
  const earningsCshareCream = useEarnings(
    cshareCreamBank.contract,
    cshareCreamBank.earnTokenName,
    cshareCreamBank.poolId,
  );
  const tokenStatsCreamAvax = creamAvaxBank.earnTokenName === 'CSHARE' ? tShareStats : tombStats;
  const tokenStatsCshareAvax = cshareAvaxBank.earnTokenName === 'CSHARE' ? tShareStats : tombStats;
  const tokenStatsCshareCream = cshareAvaxBank.earnTokenName === 'CSHARE' ? tShareStats : tombStats;
  const tokenPriceInDollarsCreamAvax = useMemo(
    () => (tokenStatsCreamAvax ? Number(tokenStatsCreamAvax.priceInDollars).toFixed(2) : null),
    [tokenStatsCreamAvax],
  );
  const tokenPriceInDollarsCshareAvax = useMemo(
    () => (tokenStatsCshareAvax ? Number(tokenStatsCshareAvax.priceInDollars).toFixed(2) : null),
    [tokenStatsCshareAvax],
  );
  const tokenPriceInDollarsCshareCream = useMemo(
    () => (tokenStatsCshareCream ? Number(tokenStatsCshareCream.priceInDollars).toFixed(2) : null),
    [tokenStatsCshareCream],
  );
  const earnedInDollarsCreamAvax = (
    Number(tokenPriceInDollarsCreamAvax) * Number(getDisplayBalance(earningsCreamAvax))
  ).toFixed(2);

  const earnedInDollarsCshareAvax = (
    Number(tokenPriceInDollarsCshareAvax) * Number(getDisplayBalance(earningsCshareAvax))
  ).toFixed(2);
  const earnedInDollarsCshareCream = (
    Number(tokenPriceInDollarsCshareCream) * Number(getDisplayBalance(earningsCshareCream))
  ).toFixed(2);
  const TVL = useTotalValueLocked();
  const tombFtmLpStats = useLpStats('CREAM-AVAXLP');
  const tShareFtmLpStats = useLpStats('CSHARE-AVAX-LP');
  const tBondStats = useBondStats();
  const tombFinance = useTombFinance();
  const tombBalance = useTokenBalance(tombFinance.TOMB);
  const displayTombBalance = useMemo(() => getDisplayBalance(tombBalance), [tombBalance]);

  const tshareBalance = useTokenBalance(tombFinance.TSHARE);
  const displayTshareBalance = useMemo(() => getDisplayBalance(tshareBalance), [tshareBalance]);

  const tbondBalance = useTokenBalance(tombFinance.TBOND);
  const displayTbondBalance = useMemo(() => getDisplayBalance(tbondBalance), [tbondBalance]);
  const { price: ftmPrice, marketCap: ftmMarketCap, priceChange: ftmPriceChange } = useFantomPrice();

  const totalTVL = TVL;

  let tomb;
  let tShare;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    tomb = tombTesting;
    tShare = tShareTesting;
  } else {
    tomb = tombProd;
    tShare = tShareProd;
  }

  const buyTombAddress = 'https://traderjoexyz.com/trade/' + tomb.address;
  const buyTShareAddress = 'https://traderjoexyz.com/trade/' + tShare.address;

  const tombLPStats = useMemo(() => (tombFtmLpStats ? tombFtmLpStats : null), [tombFtmLpStats]);
  const tshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
  const tombPriceInDollars = useMemo(
    () => (tombStats ? Number(tombStats.priceInDollars).toFixed(2) : null),
    [tombStats],
  );
  const tombPriceInFTM = useMemo(() => (tombStats ? Number(tombStats.tokenInFtm).toFixed(4) : null), [tombStats]);
  const tombCirculatingSupply = useMemo(() => (tombStats ? String(tombStats.circulatingSupply) : null), [tombStats]);
  const tombTotalSupply = useMemo(() => (tombStats ? String(tombStats.totalSupply) : null), [tombStats]);

  const tSharePriceInDollars = useMemo(
    () => (tShareStats ? Number(tShareStats.priceInDollars).toFixed(2) : null),
    [tShareStats],
  );
  const tSharePriceInFTM = useMemo(
    () => (tShareStats ? Number(tShareStats.tokenInFtm).toFixed(4) : null),
    [tShareStats],
  );
  const tShareCirculatingSupply = useMemo(
    () => (tShareStats ? String(tShareStats.circulatingSupply) : null),
    [tShareStats],
  );
  const tShareTotalSupply = useMemo(() => (tShareStats ? String(tShareStats.totalSupply) : null), [tShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInFTM = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const tombLpZap = useZap({ depositTokenName: 'CREAM-AVAX-LP' });
  const tshareLpZap = useZap({ depositTokenName: 'CSHARE-AVAX-LP' });
  const tombtshareLpZap = useZap({ depositTokenName: 'CREAM-CSHARE-LP' });


  const [onPresentTombZap, onDissmissTombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTombZap();
      }}
      tokenName={'CREAM-AVAX-LP'}
    />,
  );

  const [onPresentTshareZap, onDissmissTshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTshareZap();
      }}
      tokenName={'CSHARE-AVAX-LP'}
    />,
  );

  const [onPresenttombtshareZap, onDissmisstombtshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tombtshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmisstombtshareZap();
      }}
      tokenName={'CREAM-CSHARE-LP'}
    />,
  );

  const [onPresentModal] = useModal(
    <Modal>
      <Box p={4}>
        <h2>Welcome to</h2>
        <h2 style={{ color: '#ff4794' }}>IceCream Finance</h2>
        <p>Algo stablecoin on Avalanche C Chain, pegged to the price of 1 AVAX via seigniorage.</p>
        <p>
          Stake your CREAM-AVAX LP in the Farms to earn CSHARE rewards. Then stake your earned CSHARE in the Boardroom to
          earn more CREAM!
        </p>
      </Box>
    </Modal>,
  );

  
  const StyledLink = styled.a`
    font-weight: 700;
    text-decoration: none;
    color: #e6e6e6;
  `;

  const Row = styled.div`
    font-family: roboto, cursive;
    align-items: center;
    display: flex;
    font-size: 16px;
    justify-content: space-between;
    margin-bottom: 8px;
  `;
  // const handleMouseOverCream = () => {
  //   setIsHoveringCream(true);
  // };

  // const handleMouseOutCream = () => {
  //   setIsHoveringCream(false);
  // };

  // const handleMouseOverStraw = () => {
  //   setIsHoveringStraw(true);
  // };

  // const handleMouseOutStraw = () => {
  //   setIsHoveringStraw(false);
  // };

  // const handleMouseOverCaraml = () => {
  //   setIsHoveringCaraml(true);
  // };

  // const handleMouseOutCaraml = () => {
  //   setIsHoveringCaraml(false);
  // };

  // const [isHoveringFudge, setIsHoveringFudge] = useState(false);
  // const [isHoveringStraw, setIsHoveringStraw] = useState(false);
  // const [isHoveringCaraml, setIsHoveringCaraml] = useState(false);

  return (
    <Page>
      {/*       <BackgroundImage /> */}
      <Grid container spacing={3} >

        {/* Explanation text */}
        <Grid container direction="column" alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={8}>
            <Box p={4} justifyContent="center" alignItems="center" >
              <Typography variant="h3" fontWeight="bold" align="center">
                The sweetest protocol on Avalanche!
              </Typography>
            </Box>
            <Box style={{ justifyContent: "center", alignItems: "center", display: 'flex' }}>
              <Button
                style={{ marginBottom: '20px', backgroundColor:'#ff4794', color:'#fff' }}
                disabled={false}
                onClick={onPresentModal}
                variant="contained"
                
                
              >
                Read More
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* TVL */}
        <Grid container justify="center">
          <Box mt={3} style={{ justifyContent: "center", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 >Total Value Locked</h3>
            <CountUp style={{ fontSize: '50px', marginBottom: '30px' }} end={TVL} separator="," prefix="$" />
          </Box>
        </Grid>

        <Grid container justifyContent="space-around" alignItems="center" xs={12} sm={12} style={{ marginTop: '20px' }}>
          <Grid container item xs={12} sm={7} spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent style={{ position: 'relative', backgroundColor: 'white' }}>
                  <Grid container style={{ display: 'flex', padding: '15px' }}>
                    <Grid item xs={3}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <TokenSymbol symbol="TOMB" style={{ backgroundColor: 'transparent !important' }} />
                      <h2 style={{ paddingTop: '10px' }}>CREAM</h2>
                      <h4>Governance Token</h4>
                    </Grid>
                    <Grid item xs={9} style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch' }}>
                      <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Market Cap:</h3>
                        <h3>
                          ${(tombCirculatingSupply * tombPriceInDollars).toFixed(2)}
                        </h3>
                      </Grid>
                      <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Circulating Supply:</h3>
                        <h3 >{tombCirculatingSupply}</h3>
                      </Grid>

                      <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Total Supply:</h3>
                        <h3 >{tombTotalSupply}</h3>
                      </Grid>

                      <Grid style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '15px' }}>
                        <Grid xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
                          <h2 style={{ fontSize: '40px' }}>${tombPriceInDollars ? tombPriceInDollars : '-.--'}</h2>
                        </Grid>
                        <Grid xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>

                          <Button
                            color="primary"
                            variant="contained"
                            style={{ marginTop: '30px', marginRight: '15px' }}
                            target="_blank"
                            href={buycreamAddress}
                          >
                            Buy Now
                          </Button>
                          <Button
                            color="primary"
                            variant="contained"
                            style={{ marginTop: '30px' }}
                            target="_blank"
                            href={viewCreamAddress}
                          >
                            Chart
                          </Button>
                        </Grid>
                      </Grid>

                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>


            <Grid item xs={12}>
              <Card>
                <CardContent style={{ position: 'relative', backgroundColor: 'white' }}>
                  <Grid container style={{ display: 'flex', padding: '15px' }}>
                    <Grid item xs={3}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <TokenSymbol symbol="TSHARE" style={{ backgroundColor: 'transparent !important' }} />
                      <h2 style={{ paddingTop: '10px' }}>CSHARE</h2>
                      <h4>Utility Token</h4>
                    </Grid>
                    <Grid item xs={9} style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch' }}>
                      <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Market Cap:</h3>
                        <h3>
                          ${(tShareCirculatingSupply * tSharePriceInDollars).toFixed(2)}
                        </h3>
                      </Grid>
                      <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Circulating Supply:</h3>
                        <h3 >{tShareCirculatingSupply}</h3>
                      </Grid>

                      <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Total Supply:</h3>
                        <h3 >{tShareTotalSupply}</h3>
                      </Grid>

                      <Grid style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '15px' }}>
                        <Grid xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
                          <h2 style={{ fontSize: '40px' }}>${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}</h2>
                        </Grid>
                        <Grid xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>

                          <Button
                            color="primary"
                            variant="contained"
                            style={{ marginTop: '30px', marginRight: '15px' }}
                            target="_blank"
                            href={buycshareAddress}
                          >
                            Buy Now
                          </Button>
                          <Button
                            color="primary"
                            variant="contained"
                            style={{ marginTop: '30px' }}
                            target="_blank"
                            href={viewCshareAddress}
                          >
                            Chart
                          </Button>
                        </Grid>
                      </Grid>

                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

{/*         <Grid item xs={12}>
              <Card>
                <CardContent style={{ position: 'relative', backgroundColor: 'white' }}>
                  <Grid container style={{ display: 'flex', padding: '15px' }}>
                    <Grid item xs={3}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <TokenSymbol symbol="TBOND" style={{ backgroundColor: 'transparent !important' }} />
                      <h2 style={{ paddingTop: '10px' }}>CARAML</h2>
                      <h4>Bond Token</h4>
                    </Grid>
                    <Grid item xs={9} style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch' }}>
                      <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Market Cap:</h3>
                        <h3>
                          ${(tBondCirculatingSupply * tBondPriceInDollars).toFixed(2)}
                        </h3>
                      </Grid>
                      <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Circulating Supply:</h3>
                        <h3 >{tBondCirculatingSupply}</h3>
                      </Grid>

                      <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Total Supply:</h3>
                        <h3 >{tBondTotalSupply}</h3>
                      </Grid>

                      <Grid style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '15px' }}>
                        <Grid xs={12} sm={6} style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
                          <h2 style={{ fontSize: '40px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</h2>
                        </Grid>
                        <Grid xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>

                          <Link style={{ textDecoration: "none" }} to="/bonds">
                            <Button variant="contained" color="primary" style={{ marginTop: '30px', backgroundColor: '#21ad8f' }}>
                              View BONDS
                            </Button>
                          </Link>
                        </Grid>
                      </Grid>

                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid> */}
          </Grid>


          <Grid item style={{ margin: '20px' }} sm={4} xs={12}>
            <Card xs={12}>
              <CardContent style={{ backgroundColor: 'white' }}>

                <div
                  style={{
                    display: 'flex',
                    padding: '20px',
                    paddingTop: '0px',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'space-evenly',

                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                    <h2>Rewards</h2>
                  </div>
                  <div style={{ display: 'flex', marginTop: '10px' }}>
                    <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                      <TokenSymbol symbol="CREAM-AVAX-LP" style={{ backgroundColor: 'transparent !important' }} />
                      <h4>CREAM-AVAX LP</h4>
                    </div>
                    <div style={{ width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignContent: 'space-between',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <h4>Staked Amount:</h4>
                        <h4>{`≈ $${stakedInDollarsCreamAvax}`}</h4>

                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignContent: 'space-between',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <h4>Rewards Earned:</h4>
                        <h4>{`≈ $${earnedInDollarsCreamAvax}`}</h4>

                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <Button color="primary" onClick={onPresentTombZap} variant="contained">
                          Zap In
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', marginTop: '20px' }}>
                    <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <TokenSymbol symbol="CSHARE-AVAX-LP" style={{ backgroundColor: 'transparent !important' }} />
                      <h4>CSHARE-AVAX LP</h4>
                    </div>
                    <div style={{ width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignContent: 'space-between',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <h4>Staked Amount:</h4>
                        <h4>{`≈ $${stakedInDollarsCshareAvax}`}</h4>

                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignContent: 'space-between',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <h4>Rewards Earned:</h4>
                        <h4>{`≈ $${earnedInDollarsCshareAvax}`}</h4>

                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <Button color="primary" onClick={onPresentTshareZap} variant="contained">
                          Zap In
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', marginTop: '20px' }}>
                    <div style={{ width: '40%',  display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <TokenSymbol symbol="TOMB" style={{ backgroundColor: 'transparent !important' }} />
                      <h4>CREAM</h4>
                    </div>
                    <div style={{ width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignContent: 'space-between',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <h4>Staked Amount:</h4>
                        <h4>{`≈ $${stakedInDollarsCshareCream}`}</h4>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignContent: 'space-between',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <h4>Rewards Earned:</h4>
                        <h4>{`≈ $${earnedInDollarsCshareCream}`}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* LP POOLS */}

          {/* <Grid item xs={12} sm={6}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none', border: '1px solid var(--white)' }}>
            <CardContent align="center">
              <h2>3OMB-WFTM Spooky LP</h2>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="TOMB-FTM-LP" />
                </CardIcon>
              </Box>

              <Box mt={2}>
                <Button color="primary" disabled={true} onClick={onPresentTombZap} variant="contained">
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {tombLPStats?.tokenAmount ? tombLPStats?.tokenAmount : '-.--'} 3OMB /{' '}
                  {tombLPStats?.ftmAmount ? tombLPStats?.ftmAmount : '-.--'} FTM
                </span>
              </Box>
              <Box>${tombLPStats?.priceOfOne ? tombLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${tombLPStats?.totalLiquidity ? tombLPStats.totalLiquidity : '-.--'} <br />
                Total supply: {tombLPStats?.totalSupply ? tombLPStats.totalSupply : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid> */}

          {/* <Grid item xs={12} sm={6}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none', border: '1px solid var(--white)' }}>
            <CardContent align="center">
              <h2>3SHARES-WFTM Spooky LP</h2>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="TSHARE-FTM-LP" />
                </CardIcon>
              </Box>
              <Box mt={2}>
                <Button color="primary" onClick={onPresentTshareZap} variant="contained">
                  Zap In
                </Button>
            </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {tshareLPStats?.tokenAmount ? tshareLPStats?.tokenAmount : '-.--'} 3SHARE /{' '}
                  {tshareLPStats?.ftmAmount ? tshareLPStats?.ftmAmount : '-.--'} FTM
                </span>
              </Box>
              <Box>${tshareLPStats?.priceOfOne ? tshareLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${tshareLPStats?.totalLiquidity ? tshareLPStats.totalLiquidity : '-.--'}
                <br />
                Total supply: {tshareLPStats?.totalSupply ? tshareLPStats.totalSupply : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid> */}
        </Grid>

        {/*  <Box mt={2} style={{ marginTop: '50px' }}>
        <Typography align="center" variant="h4" gutterBottom style={{ marginBottom: '50px' }}>
          Protocol Owned Liquidity
        </Typography>
        <Grid container justify="center" align="center" spacing={3}>
          <Grid item xs={12} md={4} lg={4} className={classes.gridItem}>
            <Card
              style={{
                height: '100%',
                backgroundColor: 'rgba(229, 152, 155, 0.1)',
                boxShadow: 'none',
                border: '1px solid var(--white)',
              }}
            >
              <CardContent align="center">
                <Typography variant="h5">CREAM-AVAX LP:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance_3omb_wftm} separator="," prefix="$" />
              </CardContent>
              <CardContent align="center">
                <Typography variant="h5">CSHARE-AVAX LP:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance_3shares_wftm} separator="," prefix="$" />
              </CardContent>
              <CardContent align="center">
                <Typography variant="h5">CREAM-CSHARE LP:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance_2shares_wftm} separator="," prefix="$" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={4} className={classes.gridItem}>
            <Card
              style={{
                height: '100%',
                backgroundColor: 'rgba(229, 152, 155, 0.1)',
                boxShadow: 'none',
                border: '1px solid var(--white)',
              }}
            >
              <CardContent align="center">
                <Typography variant="h5">FUDGE:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance_3omb} separator="," prefix="$" />
              </CardContent>
              <CardContent align="center">
                <Typography variant="h5">STRAW:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance_3shares} separator="," prefix="$" />
              </CardContent>
              <CardContent align="center">
                <Typography variant="h5">CARAML:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance_2shares} separator="," prefix="$" />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={4} justify="center" className={classes.gridItem}>
            <Card
              style={{
                height: 'auto',
                marginBottom: '10px',
                backgroundColor: 'rgba(229, 152, 155, 0.1)',
                boxShadow: 'none',
                border: '1px solid var(--white)',
              }}
            >
              <CardContent align="center">
                <Typography variant="h5">TWAP:</Typography>
                <Typography style={{ fontSize: '25px' }}>{tombPriceInFTM ? tombPriceInFTM : '-.----'} DAI</Typography>
              </CardContent>
            </Card>
            <Card
              justify="center"
              style={{ height: '100%' }}
              style={{
                marginBottom: '10px',
                backgroundColor: 'rgba(229, 152, 155, 0.1)',
                boxShadow: 'none',
                border: '1px solid var(--white)',
              }}
            >
              <CardContent align="center">
                <Typography variant="h5">Total Value Burned:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance_3omb} separator="," prefix="$" />
              </CardContent>
            </Card>
            <Card
              style={{
                height: 'auto',
                backgroundColor: 'rgba(229, 152, 155, 0.1)',
                boxShadow: 'none',
                border: '1px solid var(--white)',
              }}
            >
              <CardContent align="center">
                <Typography variant="h5">Total Treasury Balance:</Typography>
                <CountUp style={{ fontSize: '25px' }} end={balance} separator="," prefix="$" />
              </CardContent>
            </Card>
          </Grid>*/}
      </Grid>
    </Page >
  );
};
const StyledValue = styled.div`
  //color: ${(props) => props.theme.color.grey[300]};
        font-size: 30px;
        font-weight: 700;
        `;

const StyledBalance = styled.div`
        align-items: center;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-left: 2.5%;
        margin-right: 2.5%;
        `;

const Balances = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 2.5%;
        margin-right: 2.5%;
        `;

const StyledBalanceWrapper = styled.div`
        align-items: center;
        display: flex;
        flex-direction: row;
        margin: 1%;
        `;


export default Home;

