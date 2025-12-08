import { InputProps } from "@/types/component.types";
import { cn } from "@/lib/utils/utils";
import React from "react";
import { FieldError, FieldValues } from "react-hook-form";
import { Input } from "../input";
import ValidationError from "../error/validation-error";

export default function FormInput<T extends FieldValues>({
  label,
  name,
  LeftComponent,
  RightComponent,
  placeholder,
  register,
  validation,
  onChange,
  onFocus,
  onBlur,
  onClick,
  value,
  errors,
  type = "text",
  readOnly,
  disabled,
  className,
}: InputProps<T>) {
  const errorMessage = errors ? (errors[name] as FieldError)?.message : "";
  const errorId = errorMessage ? `${name}-error` : undefined;

  // react hook form register
  const registerField = register ? register(name, validation) : undefined;

  // chain events correctly
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    registerField?.onChange?.(e);
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    registerField?.onBlur?.(e);
    onBlur?.(e);
  };
  return (
    <div className="relative w-full">
      {/* label */}
      {label && (
        <label
          htmlFor={name}
          className="text-default mb-1.5 block text-sm font-medium"
        >
          {label}
        </label>
      )}
      {/* input */}
      <div className="relative w-full" onClick={onClick}>
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          readOnly={readOnly}
          value={value}
          aria-invalid={!!errorMessage}
          aria-describedby={errorId}
          className={cn(
            LeftComponent && "pl-10",
            RightComponent && "pr-10",
            errorMessage && "border-error-base",
            className
          )}
          {...registerField}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={onFocus}
          disabled={disabled}
        />
        {/* Left component */}
        {LeftComponent && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            {LeftComponent}
          </div>
        )}

        {/* Right component */}
        {RightComponent && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {RightComponent}
          </div>
        )}
      </div>
      {/* Error message */}
      {errorMessage && <ValidationError errorMessage={errorMessage} />}
    </div>
  );
}
