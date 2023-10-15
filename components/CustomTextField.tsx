import React, { Dispatch, SetStateAction } from "react";
import { Input } from "./ui/input";

const CustomTextField = ({
  name,
  value,
  setCustomText,
}: {
  name: string;
  value: string;
  setCustomText: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div>
      <Input
        onChange={(e) => setCustomText(e.target.value)}
        placeholder={name}
        value={value}
      ></Input>
    </div>
  );
};

export default CustomTextField;
