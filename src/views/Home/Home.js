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
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usetShareStats from '../../hooks/usetShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useFantomPrice from '../../hooks/useFantomPrice';
import useTokenBalance from '../../hooks/useTokenBalance';
import useStakedBalance from '../../hooks/useStakedBalance';
import useBanks from '../../hooks/useBanks';
import useEarnings from '../../hooks/useEarnings';
import useShareStats from '../../hooks/usetShareStats';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import { getDisplayBalance } from '../../utils/formatBalance';
import { tomb as tombTesting, tShare as tShareTesting } from '../../tomb-finance/deployments/deployments.testing.json';
import { tomb as tombProd, tShare as tShareProd } from '../../tomb-finance/deployments/deployments.mainnet.json';
import useTotalTreasuryBalance from '../../hooks/useTotalTreasuryBalance.js';

import { Box, Button, Card, CardContent, Grid, Paper, Typography } from '@material-ui/core';
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
    border: '1px solid var(--white)',
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

  const StyledLink = styled.a`
    font-weight: 700;
    text-decoration: none;
    color: var(--accent-light);
  `;

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
      <BackgroundImage />
      <Grid container spacing={3}>
        {/* Explanation text */}
        <Grid container direction="column" alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={8}>
            <Paper style={{ backgroundColor: 'transparent', boxShadow: 'none', border: 'none' }}>
              <Box p={4} display="flex" justifyContent="center" alignItems="center">
                <Typography variant="h3" fontWeight="bold" align="center">
                  Stake on the sweetest protocol to earn CSHARE rewards via seigniorage!
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        {/* TVL */}
        <Grid container justify="center">
          <Box mt={3}>
            <Card style={{ backgroundColor: 'none', boxShadow: 'none', border: 'none' }}>
              <CardContent align="center">
                <h3>Total Value Locked</h3>
                <CountUp style={{ fontSize: '40px' }} end={TVL} separator="," prefix="$" />
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid container justifyContent="space-around" xs={12} sm={12} style={{ marginTop: '20px' }}>
          <Grid sm={7}>
            {/* Cream */}
            <Grid style={{ backgroundColor: '#FFFFFF', borderRadius: '15px' }} xs={12}>
              <div style={{ display: 'flex', padding: '15px' }}>
                <div
                  style={{
                    width: '30%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <TokenSymbol symbol="TOMB" style={{ backgroundColor: 'transparent !important' }} />
                  <div>
                    <h2>CREAM</h2>
                  </div>
                  <div>
                    <p>Governance Token</p>
                  </div>
                </div>
                {isMobile ? (
                  <div style={{ width: '70%', padding: '0px 40px' }}>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold' }}>Market Cap:</span>
                      <span>${(tombCirculatingSupply * tombPriceInDollars).toFixed(2)}</span>
                    </span>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold' }}>Circulating Supply:</span>
                      <span>{tombCirculatingSupply}</span>
                    </span>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold' }}>Total Supply:</span>
                      <span>{tombTotalSupply}</span>
                    </span>
                    <div
                      style={{ display: 'flex', alignItems: 'flex-end', marginTop: '20px', flexDirection: 'column' }}
                    >
                      <span style={{ fontSize: '20px' }}>${tombPriceInDollars ? tombPriceInDollars : '-.--'}</span>
                      <span style={{ fontSize: '14px' }}>Per CREAM</span>
                    </div>
                    <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        color="primary"
                        variant="contained"
                        style={{ marginTop: '20px', marginRight: '15px' }}
                        target="_blank"
                        href={buycreamAddress}
                      >
                        Buy Now
                      </Button>
                      <Button
                        color="primary"
                        variant="contained"
                        style={{ marginTop: '20px' }}
                        target="_blank"
                        href={viewCreamAddress}
                      >
                        Chart
                      </Button>
                    </Box>
                  </div>
                ) : (
                  <div style={{ width: '70%', padding: '0px 40px' }}>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Market Cap:</span>
                      <span style={{ fontSize: '20px' }}>
                        ${(tombCirculatingSupply * tombPriceInDollars).toFixed(2)}
                      </span>
                    </span>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Circulating Supply:</span>
                      <span style={{ fontSize: '20px' }}>{tombCirculatingSupply}</span>
                    </span>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Total Supply:</span>
                      <span style={{ fontSize: '20px' }}>{tombTotalSupply}</span>
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div
                        style={{ display: 'flex', alignItems: 'flex-end', marginTop: '20px', flexDirection: 'column' }}
                      >
                        <span style={{ fontSize: '45px' }}>${tombPriceInDollars ? tombPriceInDollars : '-.--'}</span>
                        <span style={{ fontSize: '14px' }}>Per CREAM</span>
                      </div>
                      <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          color="primary"
                          variant="contained"
                          style={{ marginTop: '20px', marginRight: '15px' }}
                          target="_blank"
                          href={buycreamAddress}
                        >
                          Buy Now
                        </Button>
                        <Button
                          color="primary"
                          variant="contained"
                          style={{ marginTop: '20px' }}
                          target="_blank"
                          href={viewCreamAddress}
                        >
                          Chart
                        </Button>
                      </Box>
                    </div>
                  </div>
                )}
              </div>
            </Grid>
            {/* CShare */}
            <Grid style={{ backgroundColor: '#FFFFFF', borderRadius: '15px', marginTop: '20px' }} xs={12}>
              <div style={{ display: 'flex', padding: '15px' }}>
                <div
                  style={{
                    width: '30%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <TokenSymbol symbol="TSHARE" style={{ backgroundColor: 'transparent !important' }} />
                  <div>
                    <h2>CSHARE</h2>
                  </div>
                  <div>
                    <p>Utility Token</p>
                  </div>
                </div>
                {isMobile ? (
                  <div style={{ width: '70%', padding: '0px 40px' }}>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold' }}>Market Cap:</span>
                      <span>${(tShareCirculatingSupply * tSharePriceInDollars).toFixed(2)}</span>
                    </span>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold' }}>Circulating Supply:</span>
                      <span>{tShareCirculatingSupply}</span>
                    </span>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold' }}>Total Supply:</span>
                      <span>{tShareTotalSupply}</span>
                    </span>
                    <div
                      style={{ display: 'flex', alignItems: 'flex-end', marginTop: '20px', flexDirection: 'column' }}
                    >
                      <span style={{ fontSize: '20px' }}>${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}</span>
                      <span style={{ fontSize: '14px' }}>Per CSHARE</span>
                    </div>
                    <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        color="primary"
                        variant="contained"
                        style={{ marginTop: '20px', marginRight: '15px' }}
                        target="_blank"
                        href={buycshareAddress}
                      >
                        Buy Now
                      </Button>
                      <Button
                        color="primary"
                        variant="contained"
                        style={{ marginTop: '20px' }}
                        target="_blank"
                        href={viewCshareAddress}
                      >
                        Chart
                      </Button>
                    </Box>
                  </div>
                ) : (
                  <div style={{ width: '70%', padding: '0px 40px' }}>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Market Cap:</span>
                      <span style={{ fontSize: '20px' }}>
                        ${(tShareCirculatingSupply * tSharePriceInDollars).toFixed(2)}
                      </span>
                    </span>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Circulating Supply:</span>
                      <span style={{ fontSize: '20px' }}>{tShareCirculatingSupply}</span>
                    </span>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '20px' }}>Total Supply:</span>
                      <span style={{ fontSize: '20px' }}>{tShareTotalSupply}</span>
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div
                        style={{ display: 'flex', alignItems: 'flex-end', marginTop: '20px', flexDirection: 'column' }}
                      >
                        <span style={{ fontSize: '45px' }}>
                          ${tSharePriceInDollars ? tSharePriceInDollars : '-.--'}
                        </span>
                        <span style={{ fontSize: '14px' }}>Per CSHARE</span>
                      </div>
                      <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          color="primary"
                          variant="contained"
                          style={{ marginTop: '20px', marginRight: '15px' }}
                          target="_blank"
                          href={buycshareAddress}
                        >
                          Buy Now
                        </Button>
                        <Button
                          color="primary"
                          variant="contained"
                          style={{ marginTop: '20px' }}
                          target="_blank"
                          href={viewCshareAddress}
                        >
                          Chart
                        </Button>
                      </Box>
                    </div>
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
          <Grid style={{ backgroundColor: '#FFFFFF', borderRadius: '15px', width: '100%' }} sm={4} xs={12}>
            <div
              style={{
                display: 'flex',
                padding: '15px',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'space-evenly',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <h1>Rewards</h1>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '30%' }}>
                  <TokenSymbol symbol="CREAM-AVAX-LP" style={{ backgroundColor: 'transparent !important' }} />
                </div>
                <div style={{ width: '70%' }}>
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
              <div style={{ display: 'flex' }}>
                <div style={{ width: '30%' }}>
                  <TokenSymbol symbol="CSHARE-AVAX-LP" style={{ backgroundColor: 'transparent !important' }} />
                </div>
                <div style={{ width: '70%' }}>
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
              <div style={{ display: 'flex' }}>
                <div style={{ width: '30%' }}>
                  <TokenSymbol symbol="CREAM-CSHARE-LP" style={{ backgroundColor: 'transparent !important' }} />
                </div>
                <div style={{ width: '70%' }}>
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
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;
