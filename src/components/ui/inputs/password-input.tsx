import { InputProps } from "@/types/component.types";
import { useState } from "react";
import { FieldValues } from "react-hook-form";

import Eye from "../icons/Eye";
import FormInput from "./form-input";

export default function PasswordInput<T extends FieldValues>(
  props: InputProps<T>
) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleVisibilityToggle = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <FormInput
      {...props}
      type={isPasswordVisible ? "text" : "password"}
      RightComponent={
        <Eye
          isPasswordVisible={isPasswordVisible}
          onClick={handleVisibilityToggle}
        />
      }
    />
  );
}
