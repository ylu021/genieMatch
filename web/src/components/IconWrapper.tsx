import { useState } from 'react';
import { X, Smile, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface IconWrapperProps {
  icon: { id: number; name: string; color: string; size: number };
  index: number;
  updateSwipe: (index: number) => void;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  meho: X,
  'smile-circle': Smile,
  heart: Heart,
};

const colorMap: Record<string, string> = {
  gray: '#808080',
  orange: '#FF9509',
  red: '#FE2042',
};

const IconWrapper = ({ icon, index, updateSwipe }: IconWrapperProps) => {
  const [scale, setScale] = useState(1);
  const IconComponent = iconMap[icon.name] || X;
  const iconColor = colorMap[icon.color] || icon.color;

  const handlePressIn = () => {
    setScale(1.3);
  };

  const handlePressOut = () => {
    setScale(1);
    setTimeout(() => {
      updateSwipe(index);
    }, 100);
  };

  return (
    <div
      onMouseDown={handlePressIn}
      onMouseUp={handlePressOut}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      style={{
        marginLeft: '25px',
        marginRight: '25px',
        cursor: 'pointer',
      }}
    >
      <motion.div
        animate={{ scale }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <IconComponent size={icon.size || 40} color={iconColor} />
      </motion.div>
    </div>
  );
};

export default IconWrapper;

