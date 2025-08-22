import React from "react";

interface SpinnerProps {
  /**
   * The size of the spinner.
   * 'sm' for small, 'md' for medium, 'lg' for large.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg"; // Defines the possible sizes for the spinner
}

/**
 * A simple loading spinner component.
 * It displays a rotating circle with a customizable size.
 */
const Spinner: React.FC<SpinnerProps> = ({ size = "md" }) => {
  // Define CSS classes based on the 'size' prop
  const sizeClasses = {
    sm: "w-5 h-5", // Small spinner dimensions
    md: "w-8 h-8", // Medium spinner dimensions
    lg: "w-12 h-12", // Large spinner dimensions
  };

  return (
    // The spinner element with animation, border, and dynamic sizing
    <div className={`animate-spin rounded-full border-4 border-gray-600 border-t-indigo-400 ${sizeClasses[size]}`} />
  );
};

export default Spinner;
