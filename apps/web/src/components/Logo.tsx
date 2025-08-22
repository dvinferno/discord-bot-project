// Define the props for the Logo component
type Props = {
  label?: string; // Optional text label to display next to the logo
  className?: string; // Optional CSS class names for the image element
};

// Logo component displays a bot logo and an optional text label.
export default function Logo({ label, className = "" }: Props) {
  return (
    // Container div for the logo and label, uses flexbox for alignment.
    // Adds a gap between items only if a label is provided.
    <div className={`flex items-center ${label ? "gap-2" : ""}`}>
      {/* Image element for the bot's icon */}
      <img
        src="/src/assets/icon.png" // Source path for the logo image
        className={className} // Apply any provided custom CSS classes
        alt="Bot Logo" // Accessible alt text for the image
      />
      {/* Conditionally render the label if it's provided */}
      {label && (
        <p className="text-xl font-bold text-white">{label}</p> // Stylized text label
      )}
    </div>
  );
}
