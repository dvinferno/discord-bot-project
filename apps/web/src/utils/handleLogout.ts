const handleLogout = async () => {
    try {
        window.location.href = "http://localhost:3001/api/auth/logout"; // Redirect the user
    } catch (error) {
        console.error("Error logging out:", error);
    }
};

export default handleLogout;