import React from 'react';
import cx from 'classnames';
export const ItemControlButton = ({onClick, bold, children}) => (
  <span className={cx('f8 underline pointer', {b: bold})} onClick={onClick}>
    {children}
  </span>
);
