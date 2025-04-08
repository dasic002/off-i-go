import React from "react";
import styles from "../styles/Post.module.css";

// Helper function to map reaction types to FontAwesome icons
// This function takes a reaction type (number) and returns the
// corresponding FontAwesome icon class name
const reactionToIcon = (reaction) => {
  switch (reaction) {
    case 0:
      return "fa-thumbs-up"; // Like
    case 1:
      return "fa-heart"; // Love
    case 2:
      return "fa-face-grin-tears"; // Funny
    case 3:
      return "fa-face-grin-stars"; // Amazing
    case 4:
      return "fa-hand-holding-heart"; // Care
    case 5:
      return "fa-face-sad-tear"; // Sad
    case 6:
      return "fa-thumbs-down"; // Dislike
    case 7:
      return "fa-face-angry"; // Angry
    default:
      return null;
  }
};

const concatReactionStyles = (index) => {
  switch (index) {
    case 0:
      return styles.PopularReactions1;
    case 1:
      return styles.PopularReactions2;
    case 2:
      return styles.PopularReactions3;
    default:
      return styles.PopularReactions;
  }
};

// PopularReactions component
// This component displays the popular reactions for a post
const PopularReactions = ({ popular_reactions = [], count = 0 }) => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-center">
        {popular_reactions.map(({ reaction }, index) => {
          // Only show the first three reactions
          const icon = index < 3 ? reactionToIcon(reaction) : null;

          // Only render the icon if it exists
          return icon ? (
            <span
              key={`emoji_${index}`}
              className={concatReactionStyles(index)}
            >
              <i className={`fa-solid ${icon}`} />
            </span>
          ) : null;
        })}
      </div>
      <span>{count}</span>
    </>
  );
};

export default PopularReactions;
