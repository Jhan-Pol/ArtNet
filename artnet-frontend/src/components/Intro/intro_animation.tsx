import React from "react";
import Lottie from "lottie-react";
import animationData from "../../animations/intro_animation.json";
import styles from "./Intro.module.css";
const IntroAnimation = () => {
  return (
    <div className={styles.intro_animation}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default IntroAnimation;
