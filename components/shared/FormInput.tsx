"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  labelClassName?: string;
  wrapperClassName?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, className, labelClassName, wrapperClassName, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        <Label
          htmlFor={inputId}
          className={cn("text-sm font-medium text-neutral-700", labelClassName)}
        >
          {label}
        </Label>
        <Input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 rounded-xl border-neutral-200 bg-white px-4 text-sm",
            "placeholder:text-neutral-400",
            "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary",
            "transition-all duration-150",
            error && "border-danger focus-visible:ring-danger/30",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-neutral-400">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-danger font-medium">{error}</p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export default FormInput;
