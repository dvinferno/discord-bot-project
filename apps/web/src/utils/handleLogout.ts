/**
 * Handles the user logout process.
 * This function redirects the user to the backend logout endpoint.
 * Any errors during the redirection are caught and logged to the console.
 */
const handleLogout = async (apiEndpoint: string) => {
    try {
        // Redirect the user to the backend's logout endpoint.
        // This assumes the backend handles session invalidation and potential further redirects.
        window.location.href = `${apiEndpoint}/api/auth/logout`;
    } catch (error) {
        // Log any errors that occur during the redirection attempt.
        console.error("Failed to redirect for logout:", error);
    }
};

export default handleLogout;