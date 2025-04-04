import React from "react";
import { Spinner } from "react-bootstrap";
import styles from "../styles/Assets.module.css";

const Assets = ({ spinner, src, icon, message }) => {
  return (
    <div className={`${styles.Asset} p-4`}>
      {spinner && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
      {src && <img src={src} alt={message} />}
      {icon && <span alt={message} className={styles.Icon}>{icon}</span>}
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Assets;
