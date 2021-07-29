import { useState, useEffect, useRef, useContext } from "react";
import {
  BsPlusCircle,
  BsBlockquoteLeft,
  BsThreeDots,
  BsImage,
  BsTypeBold,
  BsTypeItalic,
  BsTypeStrikethrough,
} from "react-icons/bs";
import { BiHeading } from "react-icons/bi";
import {
  useEditor,
  EditorContent,
  BubbleMenu,
  FloatingMenu,
  isTextSelection,
} from "@tiptap/react";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import StarterKit from "@tiptap/starter-kit";
import "./styles.scss";
import Placeholder from "@tiptap/extension-placeholder";
import { Container, Popover, OverlayTrigger, Button } from "react-bootstrap";
import { useDebounce } from "use-debounce";
import EditorHeader from "./EditorHeader";
import { updateDraftContent } from "../../services/writing";
import Title from "./Title";
import FireBaseContext from "../../context/firebase";
import { removeHTMLTags } from "../../helpers";
const Editor = ({ piece, docId }) => {
  const { storage } = useContext(FireBaseContext);
  const [title, setTitle] = useState(piece.title || '')
  const [saving, setSaving] = useState("Saved");
  const editor = useEditor({
    extensions: [
      Image,
      Dropcursor,
      StarterKit,
      Placeholder.configure({ placeholder: "Everyone loves a nice read..." }),
    ],
    content: `${piece.content}`,
    autofocus: removeHTMLTags(piece.content)  ? 'end' : 0,
  });
  const html = editor ? editor.getHTML() : null;
  const [value] = useDebounce(html, 800);

  const handleFocus = () => editor.view.focus();
  useEffect(() => {
    async function update() {
      setSaving(true);
      await updateDraftContent(docId, value);
      setTimeout(() => {
        setSaving(false);
      }, 800);
    }
    update();
  }, [value, docId]);
  const inputFile = useRef(null);
  function handleImage() {
    inputFile.current.click();
  }
  async function handlleImageUpload(event) {
    const photo = inputFile.current.files[0];
    const storageRef = storage.ref();
    const imageRef = storageRef.child(
      `pieceImages/${docId}/${piece.userId}/${photo.name}`
    );
    await imageRef.put(photo);
    await imageRef.getDownloadURL().then(function (url) {
      editor.chain().focus().setImage({ src: url }).run();
    });
  }
  const popover = editor && (
    <Popover className="d-none d-md-block" id="popover-basic">
      <Popover.Content>
        <Button
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 4 }).run();
            document.body.click();
          }}
          variant={editor.isActive("heading", { level: 4 }) ? "dark" : "none"}
        >
          <BiHeading />
        </Button>
        <Button
          variant="none"
          onClick={() => {
            editor.chain().focus().setHorizontalRule().run();
            document.body.click();
          }}
        >
          <BsThreeDots />
        </Button>
        <Button onClick={handleImage} variant="none">
          <BsImage />
        </Button>
        <Button
          onClick={() => {
            editor.chain().focus().toggleBlockquote().run();
            document.body.click();
          }}
          variant="none"
        >
          <BsBlockquoteLeft />
        </Button>
      </Popover.Content>
    </Popover>
  );
  return (
    <div className="wrapper">
      <EditorHeader docId={docId} title={title} saving={saving} />
      <Container
        style={{
          paddingTop: 80,
          padding: "80px auto auto",
          minHeight: "100vh",
          maxWidth: 700,
        }}
      >
        {editor && (
          <BubbleMenu editor={editor}>
            {isTextSelection(editor.state.selection) && (
              <div className="d-none d-md-block">
                {" "}
                <Button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  variant={editor.isActive("bold") ? "dark" : "none"}
                >
                  <BsTypeBold />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  variant={editor.isActive("italic") ? "dark" : "none"}
                >
                  <BsTypeItalic />
                </Button>
                <Button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  variant={editor.isActive("strike") ? "dark" : "none"}
                >
                  <BsTypeStrikethrough />
                </Button>{" "}
              </div>
            )}
          </BubbleMenu>
        )}
        {editor && (
          <FloatingMenu editor={editor}>
            <OverlayTrigger
              transition={false}
              rootClose={true}
              trigger="click"
              placement="bottom"
              overlay={popover}
            >
              <Button
                className="toleft d-none d-md-block rounded-circle"
                variant="none"
              >
                <BsPlusCircle />
              </Button>
            </OverlayTrigger>
          </FloatingMenu>
        )}
        <div className="py-3">
          <Title
            title={title}
            setTitle={setTitle}
            docId={docId}
            setSaving={setSaving}
            handleFocus={handleFocus}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          id="file"
          ref={inputFile}
          style={{ display: "none" }}
          onChange={handlleImageUpload}
        />
        <EditorContent editor={editor} />
      </Container>
    </div>
  );
};

export default Editor;
