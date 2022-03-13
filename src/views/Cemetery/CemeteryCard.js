import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, CardActions, CardContent, Typography, Grid } from '@material-ui/core';
import Card from '../../components/Card';
import useStatsForPool from '../../hooks/useStatsForPool';
import useBank from '../../hooks/useBank';
import useRedeem from '../../hooks/useRedeem';
import useEarnings from '../../hooks/useEarnings';
import useHarvest from '../../hooks/useHarvest';
import useTombStats from '../../hooks/useTombStats';
import useShareStats from '../../hooks/usetShareStats';
import { getDisplayBalance } from '../../utils/formatBalance';
import useStakedBalance from '../../hooks/useStakedBalance';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useModal from '../../hooks/useModal';
import useStake from '../../hooks/useStake';
import DepositModal from '../Bank/components/DepositModal';
import WithdrawModal from '../Bank/components/WithdrawModal';
import useWithdraw from '../../hooks/useWithdraw';
import useTokenBalance from '../../hooks/useTokenBalance';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import LinkIcon from '@mui/icons-material/Link';
import InputIcon from '@mui/icons-material/Input';
import ArrowDropUpTwoTone from '@mui/icons-material/ArrowDropUpTwoTone';
import ArrowDropDownTwoTone from '@mui/icons-material/ArrowDropDownTwoTone';
import TokenSymbol from '../../components/TokenSymbol';
import { makeStyles, useTheme } from '@material-ui/core/styles';

async function watchAssetInMetamask(asset) {
  const { ethereum } = window;


  const symbolName = asset.depositTokenName.substring(0, 11)
  if (ethereum && ethereum.chainId === '0xa86a') {
    await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: asset.address,
          symbol: symbolName,
          decimals: 18,
        },
      },
    });
  }
  return true;
}

const useStyles = makeStyles(() => ({
  detailsButton: {
    color: '#2596be',
    '&:hover': {
      textDecoration: 'none',
      color: '#2596be !important',
    },
  }
}))


const CemeteryCard = ({ bank }) => {
  const [show, setShow] = useState(false);
  const classes = useStyles();
  const [approveStatus, approve] = useApprove(bank.depositToken, bank.address);
  const statsOnPool = useStatsForPool(bank);
  const { onRedeem } = useRedeem(bank);
  const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
  const { onReward } = useHarvest(bank);
  const bombStats = useTombStats();
  const tShareStats = useShareStats();
  const tokenStats = bank.earnTokenName === 'CSHARE' ? tShareStats : bombStats;
  const stakedBalance = useStakedBalance(bank.contract, bank.poolId);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);
  const tokenPriceInDollars = useMemo(
    () => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null),
    [tokenStats],
  );
  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);
  const stakedInDollars = (
    Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance, bank.depositToken.decimal))
  ).toFixed(2);
  const { onStake } = useStake(bank);
  const { onWithdraw } = useWithdraw(bank);
  const tokenBalance = useTokenBalance(bank.depositToken);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );
  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  return (
    < Grid item xs={12}>
      <Card >
        <CardContent style={{ position: 'relative', backgroundColor: 'white' }}>
          <Grid justifyContent="space-between" style={{ display: 'flex', flexDirection: "row" }}>
            <Grid alignItems="flex-start" justifyContent="space-between" style={{ display: 'flex' }}>
              <Grid style={{ padding: '10px' }}>
                <TokenSymbol symbol={bank.depositTokenName} />
              </Grid>
              <Grid style={{ padding: '10px', display: 'flex', flexDirection: "row", alignContent: "center" }} mt={2} mb={2}>
                <Grid>
                  <Link style={{ textDecoration: 'none', color: '#2596be' }} to={{ pathname: `https://snowtrace.io/address/${bank.address}` }} target="_blank">
                    <h2 style={{ color: 'black', padding: '10px' }}>{bank.depositTokenName}</h2>
                  </Link>
                </Grid>
                <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Link style={{ textDecoration: 'none', color: '#2596be' }} to={{ pathname: `https://snowtrace.io/address/${bank.address}` }} target="_blank">
                    <InputIcon style={{ color: 'black' }} />
                  </Link>
                </Grid>
              </Grid>
            </Grid>

            <Grid alignItems="center" justifyContent="center" style={{ display: 'flex', flexDirection: "row", width: '60%' }}>

              <Grid container item alignItems="center" justifyContent="center" style={{ display: 'flex', flexDirection: "column" }} >
                <Grid item alignItems="center" justifyContent="center" style={{ padding: '10px' }}>
                  <h3 style={{ color: 'black' }}>{`Staked`}</h3>
                </Grid>
                <Grid item alignItems="center" justifyContent="center" style={{ padding: '10px' }}>
                  {approveStatus !== ApprovalState.APPROVED ? (
                    <h2 style={{ color: 'black' }}>
                      {`≈ $0`}
                    </h2>
                  ) : (
                    <h2 style={{ color: 'black' }}>
                      {`≈ $${stakedInDollars}`}
                    </h2>
                  )}
                </Grid>
              </Grid>

              <Grid container item alignItems="center" justifyContent="center" style={{ display: 'flex', flexDirection: "column" }} >
                <Grid item alignItems="center" justifyContent="center" style={{ padding: '10px' }}>
                  <h3 style={{ color: 'black' }}>{`TVL`}</h3>
                </Grid>
                <Grid item alignItems="center" justifyContent="center" style={{ padding: '10px' }}>
                  <h2 style={{ color: 'black' }}>${statsOnPool?.TVL}</h2>
                </Grid>
              </Grid>

              <Grid container item alignItems="center" justifyContent="center" style={{ display: 'flex', flexDirection: "column" }} >
                <Grid item alignItems="center" justifyContent="center" style={{ padding: '10px' }}>
                  <h3 style={{ color: 'black' }}>{`APR`}</h3>
                </Grid>
                <Grid item alignItems="center" justifyContent="center" style={{ padding: '10px' }}>
                  <h2 style={{ color: 'black' }}>{statsOnPool?.dailyAPR}%</h2>
                </Grid>
              </Grid>

              <Grid container item alignItems="center" justifyContent="center" style={{ display: 'flex', flexDirection: "column" }} >
                <Button
                  color="primary"
                  variant="contained"
                  style={{
                    marginBottom: '5px',
                    borderRadius: '10px',
                  }}
                >
                  {`${bank.multiplier}`}
                </Button>
              </Grid>

              <Grid container item alignItems="center" justifyContent="center" style={{ display: 'flex', flexDirection: "column" }} >
                <Button className={classes.detailsButton}
                  style={{ borderRadius: '10px', textDecoration: 'none' }}
                  onClick={() => setShow(prev => !prev)}>
                  {show ? <ArrowDropUpTwoTone sx={{ fontSize: 40 }} style={{ color: 'black' }} /> : <ArrowDropDownTwoTone sx={{ fontSize: 40 }} style={{ color: 'black' }} />}</Button>
              </Grid>


            </Grid>
          </Grid>
          <div>
            {show ?
              <div>
                <hr style={{
                  color: '#D3D3D3',
                  backgroundColor: '#D3D3D3',
                  height: 1
                }} />

                <Grid justifyContent="center" style={{ display: 'flex', flexDirection: "row" }}>

                  <Grid>
                    <Grid justifyContent="center">
                      <h3 style={{ color: 'black' }}>Deposit</h3>
                    </Grid>
                    <hr style={{
                      color: '#D3D3D3',
                      backgroundColor: '#D3D3D3',
                      height: 1
                    }} />

                  </Grid>

                  <Grid>


                  </Grid>

                </Grid>

                <Grid justifyContent="space-between" style={{ display: 'flex', marginBottom: '5px', marginTop: '10px' }}>
                  <h3 style={{ marginBottom: '10px', color: 'black' }}>APR:</h3>
                  <h4 style={{ color: 'black' }}>{statsOnPool?.dailyAPR}%</h4>
                </Grid>
                <Grid justifyContent="space-between" style={{ display: 'flex', marginBottom: '5px' }}>
                  <h3 style={{ marginBottom: '10px', color: 'black' }}>Earn:</h3>
                  <h4 style={{ color: 'black' }}>{bank.earnTokenName}</h4>
                </Grid>
                <Grid>
                  <h3 style={{ color: 'black', marginBottom: '10px', marginTop: '15px' }}>{`${bank.earnTokenName} EARNED`}</h3>
                </Grid>
                <Grid alignItems="flex-start" justifyContent="space-between" style={{ display: 'flex', marginBottom: '10px' }}>
                  <Grid>
                    <h2 style={{ color: 'black' }}>{getDisplayBalance(earnings)}</h2>
                    <h5 style={{ color: 'grey', marginTop: '5px', marginBottom: '15px', fontWeight: 'normal' }}>{`≈ $${earnedInDollars}`}</h5>
                  </Grid>
                  <Button onClick={onReward} color="primary"
                    variant="contained"
                    style={{ borderRadius: '10px' }}
                    className="shinyButtonSecondary">
                    Collect
                  </Button>
                </Grid>
                <Grid style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                  <Grid alignItems="flex-start">
                    <h3 style={{ marginBottom: '10px', color: 'black' }}>{`${bank.depositTokenName} Staked`}</h3>
                  </Grid>
                  <Grid alignItems="center">

                    <span>
                      {approveStatus !== ApprovalState.APPROVED ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Button
                            disabled={
                              bank.closedForStaking ||
                              approveStatus === ApprovalState.PENDING ||
                              approveStatus === ApprovalState.UNKNOWN
                            }
                            onClick={approve}
                            color="primary"
                            variant="contained"
                            style={{
                              marginBottom: '5px',
                              borderRadius: '10px',

                            }}
                            className="shinyButtonSecondary"
                          >
                            {`Approve ${bank.depositTokenName}`}
                          </Button>
                        </div>
                      ) : (
                        <Grid container justifyContent='space-between' alignItems='flex-start' flex spacing={2}>
                          <Grid item>
                            <h2 style={{ color: 'black' }}>
                              {getDisplayBalance(stakedBalance, bank.depositToken.decimal)}
                            </h2>
                            <h5 style={{ color: 'grey', fontWeight: 'normal', marginTop: '5px' }}>
                              {`≈ $${stakedInDollars}`}
                            </h5>
                          </Grid>
                          <Grid item>
                            <Grid container flex spacing={2}>
                              <Grid item>
                                <Button onClick={onPresentWithdraw} color="primary"
                                  variant="contained"
                                  style={{ borderRadius: '10px' }}
                                  className="shinyButtonSecondary">
                                  -
                                </Button>
                              </Grid>
                              <Grid item >
                                <Button color="primary"
                                  variant="contained"
                                  style={{ borderRadius: '10px' }}
                                  className="shinyButtonSecondary" disabled={bank.closedForStaking}
                                  onClick={() => (bank.closedForStaking ? null : onPresentDeposit())}>
                                  +
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    </span>
                  </Grid>
                </Grid>
              </div>
              : <div />}
          </div>
        </CardContent>
      </Card >
    </Grid >
  );
};

export default CemeteryCard;
