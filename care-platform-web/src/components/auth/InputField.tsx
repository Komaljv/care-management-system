interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
}

export default function InputField({
  label,
  type = "text",
  placeholder,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}