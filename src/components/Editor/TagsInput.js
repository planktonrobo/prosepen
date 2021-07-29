import { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
const TagsInput = ({ tags, setTags }) => {
  const [tagState, setTagState] = useState("");
  const removeTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
  };
  const addTags = (event) => {
    if (event.target.value !== "") {
      if (tags.length < 2) {
        setTags([...tags, event.target.value]);
        event.target.value = "";
        setTagState("");
      }
    }
  };
  function handleChange(event) {
    setTagState(event.target.value);
  }
  useEffect(() => {
    if (tagState === "") {
      setTagState(null);
    }
  }, [tagState]);
  return (
    <div className="tags-input">
      <ul id="tags">
        {tags.map((tag, index) => (
          <li key={index} className="tag">
            <span className="tag-title">{tag}</span>
            <span className="tag-close-icon" onClick={() => removeTags(index)}>
              <BsX />
            </span>
          </li>
        ))}
      </ul>
      <input
        type="text"
        maxLength={20}
        onKeyDown={(event) =>
          event.key === "Enter"
            ? addTags(event)
            : event.key === "Backspace" && tagState === null
            ? removeTags(tags.length - 1)
            : null
        }
        placeholder={tags.length < 2 ? "Press enter to add tags" : ""}
        onChange={handleChange}
      />
    </div>
  );
};
export default TagsInput;
