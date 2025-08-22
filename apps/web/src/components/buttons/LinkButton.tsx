// Define the props for the LinkButton component
type props = {
  text: string; // The text to display on the button
  redirectUri: string; // The URL to redirect to when the button is clicked
  className?: string; // Optional CSS class names for custom styling
};

/**
 * A reusable button component that redirects the user to a specified URI.
 * It's typically used for external links or authentication redirects.
 *
 * @param {Object} props - The component's properties.
 * @param {string} props.text - The text content of the button.
 * @param {string} props.redirectUri - The URL to navigate to on click.
 * @param {string} [props.className=""] - Optional CSS classes to apply to the button.
 */
function LinkButton({ text, redirectUri, className = "" }: props) {
  // Handler function for the button click event
  const handleLogin = () => {
    window.location.href = redirectUri;
  };

  return (
    <button
      className={`btn p-2 pr-4 pl-4 cursor-pointer text-sm rounded-sm transition ${className}`}
      onClick={handleLogin}
    >
      {text}
    </button>
  );
}

export default LinkButton;
