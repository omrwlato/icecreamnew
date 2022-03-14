import React from 'react';

//Graveyard ecosystem logos
import tombLogo from '../../assets/img/NEWCREAM.png';
import tShareLogo from '../../assets/img/cshare.svg';
import tombLogoPNG from '../../assets/img/cream.svg';
import tShareLogoPNG from '../../assets/img/NEWSHARE.png';
import tBondLogo from '../../assets/img/cbond.png';
import mimLogo from '../../assets/img/mim.png';
import wavax from '../../assets/img/wavax.png';
import creamCshare from '../../assets/img/creamcshare.png';
import creamAvax from '../../assets/img/cream-wavax.png';
import cshareAvax from '../../assets/img/cshare-avax.png';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  TOMB: tombLogo,
  TOMBPNG: tombLogoPNG,
  WAVAX: wavax,
  TSHAREPNG: tShareLogoPNG,
  CREAM: tombLogo,
  TSHARE: tShareLogoPNG,
  TBOND: tBondLogo,
  CBOND: tBondLogo,
  CSHARE: tShareLogoPNG,
  MIM: mimLogo,
  'CREAM-AVAX-LP': creamAvax,
  'CREAM-CSHARE-LP': creamCshare,
  'CSHARE-AVAX-LP': cshareAvax,
};
type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  if (symbol === 'CREAM-AVAX-LP' || symbol === 'CSHARE-AVAX-LP') {
    return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={100} height={100} />;
  } else if (symbol === 'CREAM-CSHARE-LP') {
    return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={100} height={100} />;
  } else if (symbol === 'CREAM') {
    return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={90} height={90} />;
  } else {
    return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={100} height={100} />;
  }
};

export default TokenSymbol;
