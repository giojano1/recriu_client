import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  UseFormReturn,
} from "react-hook-form";

export type InputProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  LeftComponent?: React.ReactNode;
  RightComponent?: React.ReactNode;
  placeholder?: string;
  register?: UseFormRegister<T>;
  validation?: RegisterOptions<T, Path<T>>;
  value?: string;
  errors?: FieldErrors<T>;
  type?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

export type FormWrapperProps<T extends FieldValues> = {
  onSubmit: (data: T) => void;
  formMethods: UseFormReturn<T>;
  isPending?: boolean;
  ariaLabel: string;
  submitButtonLabel: string;
  submitButtonLoadingLabel: string;
  children: React.ReactNode;
  secondaryBtn?: React.ReactNode;
};
export type SelectorProps<T extends FieldValues> = {
  name: Path<T>;
  placeholder: string;
  list: { value: string; label: string }[];
  control: Control<T>;
  errors: FieldErrors<T>;
  disabled?: boolean;
  label?: string;
  required?: boolean;
};
