import React from "react";

interface NoteTitleInputProps {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const NoteTitleInput: React.FC<NoteTitleInputProps> = ({
  title,
  onChange,
  onFocus,
}) => {
  return (
    <input
      type="text"
      value={title}
      onChange={onChange}
      onFocus={onFocus}
      className="text-xl font-semibold bg-transparent border-none focus:outline-none rounded px-2 py-1 flex-1 min-w-0"
      placeholder="Note title..."
    />
  );
};

export default NoteTitleInput;
