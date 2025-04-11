import React from "react";
// import React, { useState } from "react";
import styles from "../styles/MoreDropdown.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
// import { Button, Modal } from "react-bootstrap";

const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <i
    className="fa-solid fa-ellipsis-vertical"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

export const MoreDropdown = ({ handleEdit, handleDelete }) => {
  return (
    <Dropdown className="ml-auto px-1" drop="left">
      <Dropdown.Toggle as={ThreeDots} />

      <Dropdown.Menu
        className="text-center"
        popperConfig={{ strategy: "fixed" }}
      >
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={handleEdit}
          aria-label="edit"
        >
          <i className="fa-solid fa-pen-to-square" />
        </Dropdown.Item>
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={handleDelete}
          aria-label="delete"
        >
          <i className="fa-solid fa-trash" />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

// export function ProfileEditDropdown({ id, handleDelete }) {
export function ProfileEditDropdown({ id }) {
  const history = useHistory();
  // const item = "account";
  return (
    <Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="left">
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit`)}
          aria-label="edit-profile"
        >
          <i className="fas fa-edit" /> edit profile
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/username`)}
          aria-label="edit-username"
        >
          <i className="far fa-id-card" />
          change username
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/password`)}
          aria-label="edit-password"
        >
          <i className="fas fa-key" />
          change password
        </Dropdown.Item>
        {/* <DeleteModal handleDelete={handleDelete} item={item} /> */}
      </Dropdown.Menu>
    </Dropdown>
  );
}

// dj-rest-auth does not allow deleting the user account via the API
// function DeleteModal(props) {
//   const { handleDelete, item } = props;
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   return (
//     <>
//       <Dropdown.Item onClick={handleShow} aria-label={`delete-${item}`}>
//         <i className="fa-solid fa-trash" />
//         delete {item}
//       </Dropdown.Item>

//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Modal heading</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>{`Are you sure you want to delete your ${item}?`}</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleDelete}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }
