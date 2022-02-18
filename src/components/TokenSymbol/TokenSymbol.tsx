import React from 'react';

//Graveyard ecosystem logos
import tombLogo from '../../assets/img/3OMB.svg';
import tShareLogo from '../../assets/img/3SHARES.svg';
import tombLogoPNG from '../../assets/img/3OMB.png';
import tShareLogoPNG from '../../assets/img/3SHARES.png';
import tBondLogo from '../../assets/img/3BOND.png';
import tombFtmLpLogo from '../../assets/img/tomb_ftm_lp.png';
import tshareFtmLpLogo from '../../assets/img/tshare_ftm_lp.png';
import wftmLogo from '../../assets/img/fantom-ftm-logo.png';
import twoshareLogo from '../../assets/img/t_2SHARE-01.png';
import twoombLogo from '../../assets/img/t_2OMB-01.png';
import mimLogo from '../../assets/img/mimlogopng.png';
import bloomLogo from '../../assets/img/BLOOM.jpg';
import TwoombLPLogo from '../../assets/img/2OMB-WFTM.png';
import TwosharesLPLogo from '../../assets/img/2SHARES-WFTM.png';
import TwoombTwosharesLPLogo from '../../assets/img/2OMB-2SHARES.png';

import ThreeombLPLogo from '../../assets/img/3OMB-WFTM.png';
import ThreesharesLPLogo from '../../assets/img/3SHARES-WFTM.png';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  TOMB: tombLogo,
  TOMBPNG: tombLogoPNG,
  TSHAREPNG: tShareLogoPNG,
  TSHARE: tShareLogo,
  TBOND: tBondLogo,
  WFTM: wftmLogo,
  MIM: mimLogo,
  BLOOM: bloomLogo,
  'CREAM-AVAX LP': TwoombLPLogo,
  'CSHARE-AVAX LP': TwosharesLPLogo,
  'CREAM-CSHARE LP': TwoombTwosharesLPLogo,

  'FUDGE-DAI LP': ThreeombLPLogo,
  'STRAW-DAI LP': ThreesharesLPLogo,


  'DAI': wftmLogo,
  'CREAM': twoombLogo,
  'CSHARE': twoshareLogo,
  'TOMB-FTM-LP': tombFtmLpLogo,
  'TSHARE-FTM-LP': tshareFtmLpLogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    return <img src={logosBySymbol['TOMB']} alt={`${symbol} Logo`} width={size} height={size} />
    // throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={size} />;
};

export default TokenSymbol;
