import clsx from "clsx";
import React, { useState } from "react";

interface EditableTextProps {
  text: string;
  onSave: (name: string) => void;
}

export const EditableText = (props: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(props.text);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      setIsEditing(false);
      props.onSave(text);
    }
  };
  const onBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      setText(text);
    }
  };

  if (isEditing) {
    return (
      <input
        className={clsx([
          "w-[10rem]",
          "flex",
          "items-center",
          "h-[2rem]",
          "outline-none",
          "border-0",
        ])}
        type="text"
        value={text}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        autoFocus
      ></input>
    );
  } else {
    return (
      <div
        className={clsx([
          "leading-9",
          "w-[10rem]",
          "h-[2rem]",
          "overflow-hidden",
          "text-ellipsis",
          "whitespace-nowrap",
        ])}
        onDoubleClick = {() => setIsEditing(true)}
      >
        {text}
      </div>
    );
  }
};
