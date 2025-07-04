type Props = {
  label?: string;
  className?: string;
};

export default function Logo({ label, className = "" }: Props) {
  return (
    <div className={`flex items-center ${label ? "gap-2" : ""}`}>
      <img src="/src/assets/icon.png" className={className} alt="Bot Logo" />
      {label && <p className="text-xl font-bold text-white">{label}</p>}
    </div>
  );
}
