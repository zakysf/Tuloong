"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  showToggleLabel?: string; // Label for the toggle button (default: "Lihat")
  labelClassName?: string;
  wrapperClassName?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      error,
      showToggleLabel = "Lihat",
      className,
      labelClassName,
      wrapperClassName,
      id,
      ...props
    },
    ref
  ) => {
    const [show, setShow] = useState(false);
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        <div className="flex items-center justify-between">
          <Label
            htmlFor={inputId}
            className={cn("text-sm font-medium text-neutral-700", labelClassName)}
          >
            {label}
          </Label>
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="text-xs text-neutral-400 hover:text-primary transition-colors duration-150 select-none"
            tabIndex={-1}
          >
            {show ? "Sembunyikan" : showToggleLabel}
          </button>
        </div>
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type={show ? "text" : "password"}
            className={cn(
              "h-11 rounded-full border-neutral-200 bg-white px-4 pr-10 text-sm",
              "placeholder:text-neutral-400",
              "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary",
              "transition-all duration-150",
              error && "border-danger focus-visible:ring-danger/30",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && (
          <p className="text-xs text-danger font-medium">{error}</p>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
