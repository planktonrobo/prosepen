import { useState, useContext } from "react";
import { Button, Modal} from "react-bootstrap";
import {useHistory} from 'react-router-dom'
import Caption from "./Caption";
import TagsInput from "./TagsInput";
import LoggedInUserContext from "../../context/logged-in-user";
import {publishDraft} from '../../services/writing'
import {invalidateCategory} from '../../redux/actions/posts'
import {useDispatch} from 'react-redux'
import slugify from "react-slugify";
const PublishButton = ({ title, docId, saving }) => {
  const [modalShow, setModalShow] = useState(false);
  function PublishModal(props) {
      const history = useHistory()
      const dispatch = useDispatch()
    const { userfire } = useContext(LoggedInUserContext);
    const { user: { username } = {} } = userfire;
    const [category, setCategory] = useState(null);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false)
    const [caption, setCaption] = useState(null)
    async function handlePublish() {
        setLoading(true)
        await publishDraft(docId, tags, category, caption).then(dispatch(invalidateCategory()))

        
        setTimeout(() => {
            props.onHide()
            history.push(`/${username}/${slugify(title)}/${docId}`)
        }, 500);
        

    }
    return (
      <Modal animation={false} size="lg" {...props} centered>
        <Modal.Header closeButton>
          <Modal.Title>Publish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxWidth: 700 }}>
            <div className="py-2 px-3">
              <h5>Choose a category:</h5>
              {["Poetry", "Short Stories", "Journals", "Essays"].map(
                (direction) => (
                  <Button
                    variant={category === direction ? "dark" : "outline-dark"}
                    className="m-1 "
                    key={direction}
                    onClick={() => setCategory(direction)}
                  >
                    {direction}
                  </Button>
                )
              )}
            </div>
            <div className="py-2 px-3">
              <h5>
                Add up to 2 tags{" "}
                <span className="text-muted">(eg: haiku, science-fiction)</span>
                :
              </h5>
              <TagsInput tags={tags} setTags={setTags} />
            </div>
            <div className="py-2 px-3">
              <h5>Write a caption or use an excerpt:</h5>
              <Caption caption={caption} setCaption={setCaption}/>
            </div>
          </div>
          {!title && <span className="text-danger p-3">Don't forget to add a title!</span>}
        </Modal.Body>
       
        <Modal.Footer>
          <Button variant="none-outline" onClick={props.onHide}>
            Close
          </Button>
          <Button  disabled={!category || loading || !title} onClick={handlePublish} variant="success">
            {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Publish'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  return (
    <>
      <Button onClick={() => !saving && setModalShow(true)} variant="outline-success">
        Publish
      </Button>
      <PublishModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
};

export default PublishButton;
