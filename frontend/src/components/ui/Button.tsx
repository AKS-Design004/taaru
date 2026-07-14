import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  const variants = {
    primary:
      "liquid-glass-strong text-white font-medium hover:bg-white/10 transition-colors",
    secondary:
      "bg-white text-black font-medium hover:bg-white/90",
    outline:
      "liquid-glass text-white/80 font-medium hover:text-white hover:bg-white/5",
    ghost: "text-white/40 hover:text-white/80 font-normal",
  };

  const base =
    "inline-flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none font-body text-sm";

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          <span className="text-white/60">Chargement...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
