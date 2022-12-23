import logoData from "data-base64:~/assets/icon.svg";
import React from "react";

import "./logo.less";

type Props = {
  className?: string;
};

const Logo: React.FC<Props> = ({ className }) => {
  let logoClassName = "logo";
  if (className) {
    logoClassName = `logo ${className}`;
  }

  return (
    <div
      className={logoClassName}
      style={{ backgroundImage: `url(${logoData})` }}
    />
  );
};

export default Logo;
