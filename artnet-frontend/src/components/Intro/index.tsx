import React from "react";
import styles from "./Intro.module.css";
import IntroAnimation from "./intro_animation";
type Props = {
  description: string;
};

const intro = (props: Props) => {
  const { description } = props;

  return (
    <div className={styles.intro_container}>
      <figure className={styles.figure}>ArtNet</figure>
      <div className={styles.content_container}>
        <p
          className={styles.intro_description}
          style={{ whiteSpace: "pre-line" }}
        >
          {description}
        </p>
        <IntroAnimation />
      </div>
    </div>
  );
};

export default intro;
export { type Props as IntroProps };
