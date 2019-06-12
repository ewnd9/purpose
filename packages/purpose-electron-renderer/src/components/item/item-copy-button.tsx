import React from 'react';
import copy from 'copy-to-clipboard';
import {ItemControlButton} from './item-control-button';
import {getFirstLine} from '../../utils/text';
export const ItemCopyButton = ({text}) => (
  <ItemControlButton
    onClick={() =>
      copy(
        getFirstLine(text)
          .split(':')
          .slice(1)
          .join(':')
          .trim(),
      )
    }
  >
    copy
  </ItemControlButton>
);
