import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import appStyles from "../../../App.module.css";

export default function TitleCard(props) {
  let authorized = props.authorized;
  const { image, buttonText, link, user, title } = props;
  const { buttonCenter, imageCenter, title: appTitle, linkColor } = appStyles;
  return (
    <>
      <h2 className={appTitle}>{title}</h2>

      <img src={image} className={imageCenter} alt={"title card"} />
      {authorized ? (
        <Link to={link}>
          <div className={buttonCenter}>
            <Button variant="info">{buttonText}</Button>
          </div>
        </Link>
      ) : user.accountType !== "guest" ? (
        <Link to={link}>
          <div className={buttonCenter}>
            <Button variant="info">{buttonText}</Button>
          </div>
        </Link>
      ) : (
        <Link to={"/login"}>
          <p className={linkColor}>Log in to use this feature</p>
        </Link>
      )}
    </>
  );
}
