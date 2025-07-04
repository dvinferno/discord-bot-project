import React from "react";

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-indigo-500/20">
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-indigo-500/10 text-indigo-400 rounded-lg mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

export default FeatureCard;
