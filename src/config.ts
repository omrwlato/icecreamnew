import {Configuration} from './tomb-finance/config';
import {BankInfo} from './tomb-finance';
import {ChainId} from '@traderjoe-xyz/sdk';

const configurations: {[env: string]: Configuration} = {

  production: {
    chainId: ChainId.AVALANCHE,

    networkName: 'Avalanche Mainnet',
    ftmscanUrl: 'https://snowtrace.io/',
    defaultProvider: 'https://api.avax.network/ext/bc/C/rpc',
    deployments: require('./tomb-finance/deployments/deployments.mainnet.json'),
    externalTokens: {
        WAVAX: ['0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', 18], //wavax
        FUSDT: ['0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18], // busd
        MIM: ['0x130966628846bfd36ff31a822705796e8cb8c18d', 18], //mim
        'USDT-BNB-LP': ['0x781655d802670bbA3c89aeBaaEa59D3182fD755D', 18], //avax/mim
        'CREAM': ['0xAE21d31a6494829a9E4B2B291F4984AAE8121757', 18], //icecream
        'TOMB': ['0xAE21d31a6494829a9E4B2B291F4984AAE8121757', 18], //icecream
        'TSHARE': ['0x155f794b56353533E0AfBF76e1B1FC57DFAd5Bd7', 18], //icecream
        'CREAM-AVAX-LP': ['0x00C87ce7188F7652d0C0940274cEC5db62f1e825', 18], //creamavax
        'CSHARE-AVAX-LP': ['0xbD61dFAd83Fc19960476abca1324FfD798234c66', 18], //share
        'CREAM-CSHARE-LP': ['0xeC1e129BbAac3DdE156643F5d41FC9b5a59033a7', 18], //cream sharae

    },
    baseLaunchDate: new Date('2022-01-28 17:00:00Z'),
    bondLaunchesAt: new Date('2022-01-30T17:00:00Z'),
    masonryLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  /*
  Explanation:
  name: description of the card
  poolId: the poolId assigned in the contract
  sectionInUI: way to distinguish in which of the 3 pool groups it should be listed
        - 0 = Single asset stake pools
        - 1 = LP asset staking rewarding TOMB
        - 2 = LP asset staking rewarding TSHARE
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */
/*   CreamCshareRewardPool: {
    name: 'Earn CREAM by staking CSHARE',
    poolId: 0,
    sectionInUI: 0,
    contract: 'CreamCshare2RewardPool',
    depositTokenName: 'CSHARE',
    earnTokenName: 'CREAM',
    finished: false,
    multiplier: '1000x',
    site: 'https://icecreamfinance.app',
    buyLink: 'https://traderjoexyz.com/trade?outputCurrency=0x155f794b56353533E0AfBF76e1B1FC57DFAd5Bd7#/',
    sort: 0,
    closedForStaking: false,
  }, */

  CreamMimRewardPool: {
    name: 'Earn CREAM with MIM',
    poolId: 0,
    sectionInUI: 0,
    contract: 'CreamMimRewardPool',
    depositTokenName: 'MIM',
    earnTokenName: 'CREAM',
    finished: true,
    multiplier: '1000x',
    site: 'https://icecreamfinance.app',
    buyLink: 'https://traderjoexyz.com/trade?outputCurrency=0x155f794b56353533E0AfBF76e1B1FC57DFAd5Bd7#/',
    sort: 3,  
    closedForStaking: true,
  },
  CreamWavaxRewardPool: {
    name: 'Earn Cream with AVAX',
    poolId: 1,
    sectionInUI: 0,
    contract: 'CreamWavaxRewardPool',
    depositTokenName: 'WAVAX',
    earnTokenName: 'CREAM',
    finished: true,
    multiplier: '1000x',
    site: 'https://icecreamfinance.app',
    buyLink: 'https://traderjoexyz.com/trade?outputCurrency=0x155f794b56353533E0AfBF76e1B1FC57DFAd5Bd7#/',
    sort: 2,
    closedForStaking: true,
  },
  CreamWavaxLPRewardPool: {
    name: 'Earn CREAM with CREAM/AVAX LP',
    poolId: 2,
    sectionInUI: 0,
    contract: 'CreamWavaxLPRewardPool',
    depositTokenName: 'CREAM-AVAX-LP',
    earnTokenName: 'CREAM',
    finished: true,
    multiplier: '1000x',
    site: 'https://icecreamfinance.app',
    buyLink: 'https://traderjoexyz.com/trade?outputCurrency=0x155f794b56353533E0AfBF76e1B1FC57DFAd5Bd7#/',
    sort: 1,
    closedForStaking: true,
  },

  CreamAvaxLPCshareRewardPool: {
    name: 'Earn CSHARE with CREAM/AVAX LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'CreamWavaxLPCshareRewardPool',
    depositTokenName: 'CREAM-AVAX-LP',
    earnTokenName: 'CSHARE',
    finished: false,
    multiplier: '16400x',
    site: 'https://icecreamfinance.app',
    buyLink: 'https://traderjoexyz.com/trade?outputCurrency=0x155f794b56353533E0AfBF76e1B1FC57DFAd5Bd7#/',
    sort: 0,
    closedForStaking: false,
  },
  
  CshareAvaxLPCshareRewardPool: {
    name: 'Earn CSHARE with CSHARE/AVAX LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'CshareWavaxLPCshareRewardPool',
    depositTokenName: 'CSHARE-AVAX-LP',
    earnTokenName: 'CSHARE',
    finished: false,
    multiplier: '7790x',
    site: 'https://icecreamfinance.app',
    buyLink: 'https://traderjoexyz.com/trade?outputCurrency=0x155f794b56353533E0AfBF76e1B1FC57DFAd5Bd7#/',
    sort: 1,
    closedForStaking: false,
  },

  CreamCshareLPCshareRewardPool: {
    name: 'Earn CSHARE with CREAM/CSHARE LP',
    poolId: 2,
    sectionInUI: 2,
    contract: 'CreamCshareLPCshareRewardPool',
    depositTokenName: 'CREAM-CSHARE-LP',
    earnTokenName: 'CSHARE',
    finished: false,
    multiplier: '410x',
    site: 'https://icecreamfinance.app',
    buyLink: 'https://traderjoexyz.com/trade?outputCurrency=0x155f794b56353533E0AfBF76e1B1FC57DFAd5Bd7#/',
    sort: 2,
    closedForStaking: false,
  },

  CreamStaking: {
    name: 'Earn CSHARE with CREAM',
    poolId: 3,
    sectionInUI: 2,
    contract: 'CreamStaking',
    depositTokenName: 'CREAM',
    earnTokenName: 'CSHARE',
    finished: false,
    multiplier: '16400x',
    site: 'https://icecreamfinance.app',
    buyLink: 'https://traderjoexyz.com/trade?outputCurrency=0x155f794b56353533E0AfBF76e1B1FC57DFAd5Bd7#/',
    sort: 2,
    closedForStaking: false,
  },

 
  //Tomb3SHARESFTMRebates: {
  // name: 'Bond 3SHARES-WFTM LP, earn 3OMB',
  // poolId: 4,
  // sectionInUI: 3,
  //  contract: 'TombFtmRewardPool',
  //  depositTokenName: '3SHARES-WFTM LP',
  //  earnTokenName: '3OMB',
  //  finished: false,
  //  multiplier: '6000x',
  //  buyLink: '',
  //   site: '',
  //   sort: 2,
  //   closedForStaking: false,
  // },
};

export default configurations['production'];
