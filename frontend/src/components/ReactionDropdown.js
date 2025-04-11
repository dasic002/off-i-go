import React from "react";
import styles from "../styles/Post.module.css";
import Dropdown from "react-bootstrap/Dropdown";

// Helper function to map reaction types to FontAwesome icons
// This function takes a reaction type (number) and returns the
// corresponding FontAwesome icon class name
const reactionToIcon = (reaction) => {
  switch (reaction) {
    case 0:
      return "fa-solid fa-thumbs-up"; // Like
    case 1:
      return "fa-solid fa-heart"; // Love
    case 2:
      return "fa-solid fa-face-grin-tears"; // Funny
    case 3:
      return "fa-solid fa-face-grin-stars"; // Amazing
    case 4:
      return "fa-solid fa-hand-holding-heart"; // Care
    case 5:
      return "fa-solid fa-face-sad-tear"; // Sad
    case 6:
      return "fa-solid fa-thumbs-down"; // Dislike
    case 7:
      return "fa-solid fa-face-angry"; // Angry
    default:
      return `fa-regular fa-thumbs-up`; // Default to thumbs up
  }
};

const reactionOptions = [
  { reaction: 0, icon: "fa-solid fa-thumbs-up", meaning: "Like" },
  { reaction: 1, icon: "fa-solid fa-heart", meaning: "Love" },
  { reaction: 2, icon: "fa-solid fa-face-grin-tears", meaning: "Funny" },
  { reaction: 3, icon: "fa-solid fa-face-grin-stars", meaning: "Amazing" },
  { reaction: 4, icon: "fa-solid fa-hand-holding-heart", meaning: "Care" },
  { reaction: 5, icon: "fa-solid fa-face-sad-tear", meaning: "Sad" },
  { reaction: 6, icon: "fa-solid fa-thumbs-down", meaning: "Dislike" },
  { reaction: 7, icon: "fa-solid fa-face-angry", meaning: "Angry" },
];

const ThumbsUp = React.forwardRef(({ onClick }, ref) => (
  <i
    className={`fa-regular fa-thumbs-up`}
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

export const ReactionDropdown = ({ handleReaction }) => {
  return (
    <Dropdown className="ml-auto px-1" drop="right" as="span">
      <Dropdown.Toggle as={ThumbsUp} />

      <Dropdown.Menu
        className="text-center"
        popperConfig={{ strategy: "fixed" }}
      >
        {reactionOptions.map(({ reaction: reactionType, icon, meaning }) => (
          <Dropdown.Item
            key={reactionType}
            className={styles.DropdownItem}
            onClick={() => handleReaction(reactionType)}
            aria-label={`reaction-${meaning.toLowerCase()}`}
          >
            <i className={icon} />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export const ReactionIcon = ({ reaction }) => {
  const icon = reactionToIcon(reaction);
  return <i className={`${icon} ${styles.Reaction}`} />;
};
