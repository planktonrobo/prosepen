import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import { updateDraftTitle } from "../../services/writing";

const Title = ({ docId, setSaving, title, setTitle, handleFocus }) => {
  const textAreaRef = useRef(null);
  const [textAreaHeight, setTextAreaHeight] = useState("auto");
  const [parentHeight, setParentHeight] = useState("auto");
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
      setParentHeight(`${textAreaRef.current.scrollHeight}px`);
      setTextAreaHeight(`${textAreaRef.current.scrollHeight}px`);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setParentHeight(`${textAreaRef.current.scrollHeight}px`);
    setTextAreaHeight(`${textAreaRef.current.scrollHeight}px`);
    document.title = `(draft) - '${title}'`;
  }, [title]);

  const onChangeHandler = (event) => {
    setTextAreaHeight("auto");
    setParentHeight(`${textAreaRef.current.scrollHeight}px`);
    setTitle(event.target.value);
  };

  const [value] = useDebounce(title, 800);

  useEffect(() => {
    async function update() {
      setSaving(true);
      await updateDraftTitle(docId, value);
      setTimeout(() => {
        setSaving(false);
      }, 800);
    }
    update();
  }, [value]);
  return (
    <div
      style={{
        minHeight: parentHeight,
      }}
    >
      <textarea
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleFocus();
          }
        }}
        className="an"
        ref={textAreaRef}
        maxLength={100}
        rows={1}
        placeholder="Title"
        value={title}
        style={{
          height: textAreaHeight,
        }}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default Title;
