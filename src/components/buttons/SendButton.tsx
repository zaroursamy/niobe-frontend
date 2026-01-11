type SendButtonProps = {
  className?: string;
  label?: string;
  type?: "button" | "submit" | "reset";
};

export default function SendButton({
  className = "",
  label = "Send",
  type = "submit",
}: SendButtonProps) {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-lg font-semibold transition-all text-primary-foreground bg-primary hover:brightness-95 cursor-pointer ${className}`}
    >
      {label}
    </button>
  );
}
