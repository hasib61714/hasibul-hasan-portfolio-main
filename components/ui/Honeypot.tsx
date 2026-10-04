import { forwardRef } from "react";

/**
 * Hidden spam trap. Humans never see or fill it; naive bots fill every field.
 * The API silently discards any submission where it has a value.
 */
export const Honeypot = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => (
    <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
      <label>
        Website
        <input ref={ref} type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  )
);

Honeypot.displayName = "Honeypot";
