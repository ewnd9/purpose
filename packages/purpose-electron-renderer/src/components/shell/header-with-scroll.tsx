import React from "react";
export const HeaderWithScroll = ({ header, content, footer }) => (
  <div className="flex flex-column h-100">
    <div className="mt1 pa1 pb2 bb-m b--moon-gray">{header}</div>

    <div className="flex-auto pv3 ph1 overflow-y-auto bg-white">{content}</div>

    {footer && <div className="pv2 ph1 bt-m b--moon-gray mb0">{footer}</div>}
  </div>
);
