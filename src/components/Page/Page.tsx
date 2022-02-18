import React from 'react';
import { Container } from '@material-ui/core';
import bg from '../../assets/img/background.jpg';
import useEagerConnect from '../../hooks/useEagerConnect';

import Footer from '../Footer';
import Nav from '../Nav';

const Page: React.FC = ({ children }) => {
  useEagerConnect();
  return (
    <div>
      <div style={{ minHeight: '100vh' }}>
        <Nav />
        <Container maxWidth="lg" style={{ paddingBottom: '5rem' }}>
          {children}
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
