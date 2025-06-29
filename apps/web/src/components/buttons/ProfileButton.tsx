type props = {
  className?: string;
  label?: string;
  avatarUrl?: string;
};

export default function ProfileButton({
  className = "",
  label,
  avatarUrl,
}: props) {
  return (
    <button
      className={`flex items-center cursor-pointer gap-3 p-2 pr-3 pl-3 bg-white/5 rounded-sm transition ${className}`}
    >
      <img
        className="w-8 h-8 rounded-full"
        src={avatarUrl}
        alt="Rounded avatar"
      ></img>
      <div className="font-medium dark:text-white">
        {label && <span>{label}</span>}
      </div>
    </button>
  );
}
