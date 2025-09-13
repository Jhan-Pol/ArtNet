// src/components/Feed.jsx o Feed.tsx
import styles from "./Feed.module.css";
import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Feed = ({ Component }) => {
  const [navState, setNavState] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      className={`${styles.feed_container}${
        navState ? " " + styles.feed_container_hover : ""
      }`}
      onMouseOut={() => setNavState(false)}
    >
      <div onMouseOver={() => setNavState(true)} className={styles.sidebar}>
        <div className={styles.sidebar_item} onClick={() => navigate("/feed")}>
          <FaHome className={styles.icon} />
          <span className={styles.label}>Home</span>
        </div>
        <div
          className={styles.sidebar_item}
          onClick={() => navigate("/profile")}
        >
          <FaUser className={styles.icon} />
          <span className={styles.label}>Profile</span>
        </div>
        <div className={styles.sidebar_item}>
          <FaCog className={styles.icon} />
          <span className={styles.label}>Settings</span>
        </div>
        <div
          className={styles.sidebar_item}
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          <FaSignOutAlt className={styles.icon} />
          <span className={styles.label}>Logout</span>
        </div>
      </div>
      <Component />
    </div>
  );
};

export default Feed;
