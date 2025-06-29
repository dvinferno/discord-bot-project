type props = {
  text: string;
  redirectUri: string;
  className?: string;
};

function LinkButton({ text, redirectUri, className = "" }: props) {
  const handleLogin = () => {
    window.location.href = redirectUri;
  };

  return (
    <button
      className={`btn rounded-sm transition ${className}`}
      onClick={handleLogin}
    >
      {text}
    </button>
  );
}

export default LinkButton;