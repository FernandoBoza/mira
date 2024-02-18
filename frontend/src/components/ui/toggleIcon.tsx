import { useState } from 'react';

type ToggleIconProps = {
  getValue: (value: boolean) => void;
  label?: string;
};

export const ToggleIcon = ({ getValue, label }: ToggleIconProps) => {
  const [isTrue, setIsTrue] = useState(false);

  const handleToleranceWindow = () => {
    setIsTrue((prev) => !prev);
    getValue(!isTrue);
  };

  const containerStyle = `w-8 h-4 rounded-full cursor-pointer relative mr-2 bg-blue-800 ${isTrue ? 'bg-primary' : 'bg-gray-400'}`;
  const toggleStyle = `w-4 h-4 bg-white rounded-full scale-90 ${isTrue ? 'translate-x-4' : 'translate-x-0'}`;

  return (
    <div className="flex items-center">
      <div className={containerStyle} onClick={handleToleranceWindow}>
        <div className={toggleStyle}></div>
      </div>
      <span>{label ?? (isTrue ? 'ON' : 'OFF')}</span>
    </div>
  );
};
