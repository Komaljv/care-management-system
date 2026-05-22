import { ButtonHTMLAttributes } from "react";

interface AuthButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export default function AuthButton({
  text,
  ...props
}: AuthButtonProps) {
  return (
    <button
      {...props}
      className="w-full rounded-xl py-3 font-medium transition-all bg-primary text-primary-foreground hover:opacity-90"
    >
      {text}
    </button>
  );
}