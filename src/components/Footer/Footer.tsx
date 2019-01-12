import * as React from "react";

import { Button, SocialMediaIcon } from "..";
import { SOCIAL_MEDIA } from "../../core/config";
import Nav from "./Nav";

import "./scss/index.scss";

const Footer: React.SFC = () => (
  <div className="footer" id="footer">
    <div className="footer__favicons container">
      {SOCIAL_MEDIA.map(medium => (
        <SocialMediaIcon medium={medium} key={medium.ariaLabel} />
      ))}
    </div>
    <Nav />
  </div>
);

export default Footer;
