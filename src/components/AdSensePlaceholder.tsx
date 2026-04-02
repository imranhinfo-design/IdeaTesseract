import React from 'react';

interface AdSensePlaceholderProps {
  adId: string;
  className?: string;
}

const AdSensePlaceholder: React.FC<AdSensePlaceholderProps> = ({ adId, className }) => {
  if (!adId || adId.trim() === '') {
    return null;
  }
  return (
    <div className={`bg-gray-800 border border-gray-700 p-4 rounded-lg flex items-center justify-center text-gray-500 ${className}`}>
      <p className="text-sm">AdSense Ad: {adId}</p>
    </div>
  );
};

export default AdSensePlaceholder;
