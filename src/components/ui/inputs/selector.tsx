import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ValidationError from "@/components/ui/error/validation-error";
import { SelectorProps } from "@/types/component.types";
import { Controller, FieldError, FieldValues } from "react-hook-form";

export default function Selector<T extends FieldValues>({
  label,
  name,
  control,
  errors,
  placeholder,
  list,
  disabled = false,
}: SelectorProps<T>) {
  const errorMessage = errors ? (errors[name] as FieldError)?.message : "";

  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="text-default mb-1.5 block text-sm font-medium"
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {list.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errorMessage && <ValidationError errorMessage={errorMessage} />}
    </div>
  );
}
