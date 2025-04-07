import React, { useEffect, useState } from "react";
import styles from "../styles/Post.module.css";

const PopularReactions = (props) => {
  const { popular_reactions, count } = props;

  const [reactionsData, setReactionsData] = useState({
    emojis: [],
  });

  //   const { first, second, third } = reactionsData.emojis;
  const { emojis } = reactionsData;

  useEffect(() => {
    const handleMount = async () => {
      if (popular_reactions.length > 0) {
        setReactionsData({
          emojis: popular_reactions.map(({ reaction }) =>
            reaction === 0 ? ( // Like
              <i className="fa-solid fa-thumbs-up"></i>
            ) : reaction === 1 ? ( // Love
              <i className="fa-solid fa-heart"></i>
            ) : reaction === 2 ? ( // Funny
              <i className="fa-solid fa-face-grin-tears"></i>
            ) : reaction === 3 ? ( // Amazing
              <i className="fa-solid fa-face-grin-stars"></i>
            ) : reaction === 4 ? ( // Care
              <i className="fa-solid fa-hand-holding-heart"></i>
            ) : reaction === 5 ? ( // Sad
              <i className="fa-solid fa-face-sad-tear"></i>
            ) : reaction === 6 ? ( // Dislike
              <i className="fa-solid fa-thumbs-down"></i>
            ) : reaction === 7 ? ( // Angry
              <i className="fa-solid fa-face-angry"></i>
            ) : null
          ),

          count: popular_reactions.length,
        });
      }
    };
    handleMount();
  }, [popular_reactions]);

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        {emojis.map((emoji, index) => (
          <span key={`emoji_${index}`} className={styles.PopularReactions}>
            {emoji}
          </span>
        ))}
      </div>
      <span>{count}</span>
    </div>
  );
};

export default PopularReactions;
