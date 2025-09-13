import React from "react";
import Lottie from "lottie-react";
import animationData from "../../animations/intro_animation.json";

const IntroAnimation = () => {
  return (
    <div style={{ width: "100%", height: "100%", paddingTop: "3rem" }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default IntroAnimation;
