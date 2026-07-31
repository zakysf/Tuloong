"use client";

import { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  labelClassName?: string;
  wrapperClassName?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    { label, error, hint, className, labelClassName, wrapperClassName, id, ...props },
    ref
  ) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        <Label
          htmlFor={inputId}
          className={cn("text-sm font-medium text-neutral-700", labelClassName)}
        >
          {label}
        </Label>
        <Textarea
          ref={ref}
          id={inputId}
          className={cn(
            "rounded-xl border-neutral-200 bg-white px-4 py-3 text-sm min-h-[100px]",
            "placeholder:text-neutral-400 resize-none",
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
FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
