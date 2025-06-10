import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-T0LMEHJ9VS'); // Replace with your actual Measurement ID
};

export const logPageView = () => {
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};
