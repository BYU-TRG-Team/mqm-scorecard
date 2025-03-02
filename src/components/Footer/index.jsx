import React from "react";
import "./Footer.css";

const Footer = () => (
  <div className="footer">
    Version 4.2.3
    <br />
    (c)2015 DFKI GMbH.
    <br />
    <a href="/about">Contributors</a>
    <br />
    For more information about this tool, please contact
    {" "}
    <a href="mailto:info@qt21.eu">info@qt21.eu</a>
    .
    Scorecard is published under
    {" "}
    <a href="https://github.com/BYU-TRG-Team/scorecard/blob/main/LICENSE" target="_blank" rel="noreferrer">Apache 2.0 License</a>
    {" "}
    on
    {" "}
    <a href="https://github.com/BYU-TRG-Team/scorecard" target="_blank" rel="noreferrer">GitHub</a>
    {" "}
    .
  </div>
);

export default Footer;
