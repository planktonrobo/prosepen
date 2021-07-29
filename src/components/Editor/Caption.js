import { useEditor, EditorContent } from "@tiptap/react";
import CharacterCount from "@tiptap/extension-character-count";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import {removeHTMLTags} from '../../helpers'
const Caption = ({setCaption}) => {
  const limit = 200;
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "optional..." }),
      CharacterCount.configure({
        limit,
      }),
    ],
    content: ``,
  });
  const text = editor && editor.getHTML()
  useEffect(() => { 
    setCaption(text && removeHTMLTags(text))
  }, [text, setCaption])
  return (
    <div className="border rounded p-2 small">
      <EditorContent editor={editor} />
      {editor && (
        <div
          className={`character-count ${
            editor.getCharacterCount() === limit
              ? "character-count--warning"
              : ""
          }`}
        >
          <div className="character-count__text">
            {editor.getCharacterCount()}/{limit} characters
          </div>
        </div>
      )}
    </div>
  );
};

export default Caption;
