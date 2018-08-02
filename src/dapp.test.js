import React from 'react';
import ReactDOM from 'react-dom';
import Dapp from './dapp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Dapp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
