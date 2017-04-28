import React from 'react';
import { render } from 'react-dom';
import TwitterIcon from '../assets/twitter.svg';

document.addEventListener('DOMContentLoaded', () => {
  render(
    <div>
      <TwitterIcon width="100" />
      <TwitterIcon fill="red" style={{width: 300}} />
      <TwitterIcon fill="blue" style={{width: 600}} />
    </div>,
    document.querySelector('.app')
  );
});
