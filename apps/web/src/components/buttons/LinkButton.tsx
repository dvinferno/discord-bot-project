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
      className={`btn p-2 pr-4 pl-4 cursor-pointer text-sm rounded-sm transition ${className}`}
      onClick={handleLogin}
    >
      {text}
    </button>
  );
}

export default LinkButton;
