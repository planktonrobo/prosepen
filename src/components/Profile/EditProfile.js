import { useState, createRef, useContext } from "react";
import { Button, Form, Modal, FormControl } from "react-bootstrap";
import ProfilePicture from "@dsalvagni/react-profile-picture";
import { useDispatch } from "react-redux";
import { invalidateCategory } from "../../redux/actions/posts";
import "./styles.scss";
import FireBaseContext from "../../context/firebase";
import { updateImage, updateFullName, updateBio } from "../../services/firebase";
const EditProfile = ({ docId, fullName, bio }) => {
  const [modalShow, setModalShow] = useState(false);
  const profilePictureRef = createRef();
  function EditModal(props) {
    const [loading, setLoading] = useState(false);
    const [fullname, setFullname] = useState(fullName);
    const [bioState, setBioState] = useState(bio);
    const { storage } = useContext(FireBaseContext);
    const dispatch = useDispatch();
    async function handleSubmit(e) {
      e.preventDefault();
      setLoading(true);
      const PP = profilePictureRef.current;
      if (PP.state.status === "LOADED") {
        const imageAsDataURL = PP.getImageAsDataUrl();
        const storageRef = storage.ref("/profileImages");
        const imageRef = storageRef.child(docId);
        await imageRef.putString(imageAsDataURL, "data_url");
        const url = await imageRef.getDownloadURL()
        await updateImage(docId, url);
        
      }
      if (fullname !== fullName && fullname !== "") {
        await updateFullName(docId, fullname)
      }
      if (bioState !== bio ){
        await updateBio(docId, bioState)
      }
      dispatch(invalidateCategory());
      props.onHide();
      window.location.reload();
    }

    return (
      <Modal {...props} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <ProfilePicture
              ref={profilePictureRef}
              useHelper={true}
              debug={false}
              frameFormat="circle"
              cropSize={120}
            />
          </div>
          <Form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center">
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <FormControl
                  value={fullname}
                  onChange={({ target }) => setFullname(target.value)}
                  placeholder="Full Name"
                  type="text"
                  spellCheck={false}
                />
              </Form.Group>
            </div>
            <div className="d-flex justify-content-center">
              <Form.Group>
                <Form.Label>Bio</Form.Label>
                <FormControl
                  as="textarea"
                  maxLength={140}
                  value={bioState}
                  onChange={({ target }) => setBioState(target.value)}
                  rows={2}
                />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="none" onClick={props.onHide}>
            Close
          </Button>
          <Button disabled={!fullname || loading} onClick={handleSubmit}>
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              "Save"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <div
      className="d-flex justify-content-center mx-1"
      style={{ minWidth: 250 }}
    >
      <Button
        variant="outline-dark"
        className="w-100 mx-auto m-3"
        onClick={() => setModalShow(true)}
      >
        Edit Profile
      </Button>
      <EditModal show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

export default EditProfile;
