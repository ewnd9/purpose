import React from "react";
import cx from "classnames";
export const Button = ({
  className = "",
  isDisabled = false,
  onClick,
  children
}) => (
  <button
    className={cx(
      "bg-dark-blue white fw6 pv2 ph3 br2 bn f5 pointer",
      className
    )}
    disabled={isDisabled}
    onClick={onClick}
  >
    {children}
  </button>
);
