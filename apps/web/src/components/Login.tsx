import LinkButton from "./buttons/LinkButton";

const Login = () => {
  const handleLogout = async () => {
    try {
      window.location.href = "http://localhost:3002/logout"; // Redirect the user
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div id="login" className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-lg w-full mb-50 ">
        <h1 className="text-4xl font-bold text-white mb-6">
          Welcome to "Untitled Bot" Dashboard
        </h1>
        <p className="text-lg text-gray-300 mb-4">
          Log in to manage bot and settings easily.
        </p>
        <div className="flex items-center justify-center gap-3 pb-8">
          <LinkButton
            text="Add to Discord"
            redirectUri="https://discord.com/oauth2/authorize?client_id=1337861308166438932"
            className="bg-indigo-600 hover:bg-indigo-700/80"
          />
          <LinkButton
            text="Learn More"
            redirectUri="/"
            className="bg-gray-300/20 hover:bg-gray-500/80"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;