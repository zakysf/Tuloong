"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FormSelectProps {
  label: string;
  id?: string;
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  wrapperClassName?: string;
}

export default function FormSelect({
  label,
  id,
  placeholder,
  options,
  value,
  onChange,
  error,
  disabled,
  wrapperClassName,
}: FormSelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
      <Label
        htmlFor={selectId}
        className="text-sm font-medium text-neutral-700"
      >
        {label}
      </Label>
      <Select value={value} onValueChange={(val) => onChange(val || "")} disabled={disabled}>
        <SelectTrigger
          id={selectId}
          className={cn(
            "!h-11 rounded-xl border-neutral-200 bg-white px-4 text-sm",
            "focus:ring-2 focus:ring-primary/40 focus:border-primary",
            "transition-all duration-150",
            !value && "text-neutral-400",
            error && "border-danger focus:ring-danger/30",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <SelectValue placeholder={placeholder ?? `Pilih ${label}`} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-neutral-200 shadow-lg">
          {options.map((opt) => (
            <SelectItem
              key={opt}
              value={opt}
              className="rounded-lg text-sm cursor-pointer"
            >
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-danger font-medium">{error}</p>
      )}
    </div>
  );
}
