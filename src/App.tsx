import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider as TP } from '@material-ui/core/styles';
import { ThemeProvider as TP1 } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';
import usePromptNetwork from './hooks/useNetworkPrompt';
import BanksProvider from './contexts/Banks';
import TombFinanceProvider from './contexts/TombFinanceProvider';
import ModalsProvider from './contexts/Modals';
import store from './state';
import theme from './theme';
import newTheme from './newTheme';
import config from './config';
import Updaters from './state/Updaters';
import Loader from './components/MiniLoader';
import Popups from './components/Popups';
import { RefreshContextProvider } from './contexts/RefreshContext';
import Particles from 'react-tsparticles'; //'react-particles-js';

const Home = lazy(() => import('./views/Home'));
const Farms = lazy(() => import('./views/Cemetery'));
const Boardroom = lazy(() => import('./views/Masonry'));
const Rebates = lazy(() => import('./views/Rebates'));
const Bonds = lazy(() => import('./views/Pit'));
const Treasury = lazy(() => import('./views/Treasury'));
// const SBS = lazy(() => import('./views/Sbs'));
// const Liquidity = lazy(() => import('./views/Liquidity'));

const NoMatch = () => (
  <h3 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    URL Not Found. <a href="/">Go back home.</a>
  </h3>
);

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Clear localStorage for mobile users
  if (typeof localStorage.version_app === 'undefined' || localStorage.version_app !== '1.1') {
    localStorage.clear();
    localStorage.setItem('connectorId', '');
    localStorage.setItem('version_app', '1.1');
  }

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  usePromptNetwork();

  return (
    <div>
     {/*  <Particles
        id="tsparticles"
        options={{
          background: {
            image: 'public/background1.png',
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: 'push',
              },
              onHover: {
                enable: true,
                mode: 'repulse',
              },
              resize: true,
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 15,
              },
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: '#ffffff',
            },

            move: {
              direction: 'none',
              enable: true,
              outMode: 'bounce',
              random: false,
              speed: 1.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 2000,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: 'circle',
            },
            size: {
              random: true,
              value: 5,
            },
          },
          detectRetina: true,
        }}
      /> */}
      <Providers>
      {loading ? (
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            height: '100vh',
          }}
        >
          <img src={require('./assets/img/loader.gif')} alt="loading..." style={{ width: '8%' }} />
          {/*<DotLoader
        size={200} 
        color={'#fe5f80'}
        loading={loading}
        />**/}
        </div>
      ) : (
        <Router>
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/farms" component={Farms} />
              <Route path="/boardroom" component={Boardroom} />
              {/* <Route path="/rebates">
              <Rebates />
            </Route> */}
              <Route path="/bonds" component={Bonds} />
              <Route path="/treasury" component={Treasury} />
              {/* <Route path="/sbs">
              <SBS />
            </Route>
            <Route path="/regulations">
              <Regulations />
            </Route>
            <Route path="/liquidity">
              <Liquidity />
            </Route> */}
              <Route path="*" component={NoMatch} />
            </Switch>
          </Suspense>
        </Router>
      )}
      </Providers>
    </div>
  );
};

const Providers: React.FC = ({ children }) => {
  return (
    <TP1 theme={theme}>
      <TP theme={newTheme}>
        <UseWalletProvider
          chainId={config.chainId}
          connectors={{
            walletconnect: { rpcUrl: config.defaultProvider },
            walletlink: {
              url: config.defaultProvider,
              appName: 'Sundae Finance',
              appLogoUrl: './sundaelogo.png',
            },
          }}
        >
          <Provider store={store}>
            <Updaters />
            <RefreshContextProvider>
              <TombFinanceProvider>
                <ModalsProvider>
                  <BanksProvider>
                    <>
                      <Popups />
                      {children}
                    </>
                  </BanksProvider>
                </ModalsProvider>
              </TombFinanceProvider>
            </RefreshContextProvider>
          </Provider>
        </UseWalletProvider>
      </TP>
    </TP1>
  );
};

export default App;
