import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
const ContentShit = ({ content }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: `${content ?content : ''}`,
    editable: false,
  });
  return (
    <div className=" py-2 text-center">
      <EditorContent editor={editor} />
    </div>
  );
};

export default ContentShit;
