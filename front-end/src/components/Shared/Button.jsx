export default function Button({
  children,
  rounded = "full",
  padding = "px-6 py-2",
}) {
  const roundedMap = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",

    "2xl": "rounded-2xl",
  };
  return (
    <button
      className={`
        bg-gradient-to-r from-[#189EFE] to-[#0E5F98]
        text-white ${padding} font-medium ${roundedMap[rounded]}

       }
      transition-all
      `}
    >
      {children}
    </button>
  );
}
