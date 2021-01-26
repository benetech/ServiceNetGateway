import ReactGA from 'react-ga';

export const sendAction = action => {
  ReactGA.event(action);
};

export const sendActionOnEvt = action => evt => {
  sendAction(action);
};
