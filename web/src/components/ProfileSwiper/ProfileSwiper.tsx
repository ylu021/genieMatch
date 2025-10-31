import { useState } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import Users from '@/constants/profile.json';
import Icons from '@/constants/icons';
import { Card } from '@/components';
import IconWrapper from '../IconWrapper';

interface ProfileSwiperProps {
  setUserSelection: (selection: number) => void;
  handleSwiped: () => void;
}

const ProfileSwiper = ({ setUserSelection, handleSwiped }: ProfileSwiperProps) => {
  const [currentIndex, setCurrentIndex] = useState(Users.length - 1);
  const [exitingCard, setExitingCard] = useState<number | null>(null);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'down' | null>(null);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, cardIndex: number) => {
    const threshold = 50;
    const swipeVelocity = 500;

    // Check if dragged far enough or fast enough
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > swipeVelocity) {
      // Determine direction
      if (info.offset.x > 0 || info.velocity.x > 0) {
        // Swiped right (like)
        setExitDirection('right');
        setUserSelection(2);
        handleSwiped();
        setExitingCard(cardIndex);
        setTimeout(() => {
          setCurrentIndex((prev) => Math.max(0, prev - 1));
          setExitingCard(null);
          setExitDirection(null);
        }, 300);
      } else {
        // Swiped left (nope)
        setExitDirection('left');
        setUserSelection(-1);
        handleSwiped();
        setExitingCard(cardIndex);
        setTimeout(() => {
          setCurrentIndex((prev) => Math.max(0, prev - 1));
          setExitingCard(null);
          setExitDirection(null);
        }, 300);
      }
    } else if (Math.abs(info.offset.y) > threshold || Math.abs(info.velocity.y) > swipeVelocity) {
      // Swiped down (super like)
      if (info.offset.y > 0 || info.velocity.y > 0) {
        setExitDirection('down');
        setUserSelection(1);
        handleSwiped();
        setExitingCard(cardIndex);
        setTimeout(() => {
          setCurrentIndex((prev) => Math.max(0, prev - 1));
          setExitingCard(null);
          setExitDirection(null);
        }, 300);
      }
    }
  };

  const updateSwipe = (iconIndex: number) => {
    if (currentIndex < 0) return;
    
    const topCardIndex = currentIndex;
    
    // Trigger swipe programmatically
    if (iconIndex === 0) {
      // Swipe left (nope)
      setExitDirection('left');
      setUserSelection(-1);
      handleSwiped();
      setExitingCard(topCardIndex);
      setTimeout(() => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
        setExitingCard(null);
        setExitDirection(null);
      }, 300);
    } else if (iconIndex === 2) {
      // Swipe right (like)
      setExitDirection('right');
      setUserSelection(2);
      handleSwiped();
      setExitingCard(topCardIndex);
      setTimeout(() => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
        setExitingCard(null);
        setExitDirection(null);
      }, 300);
    }
  };

  // Get cards to display (top card and one behind it)
  const getCardToShow = (stackPosition: number) => {
    const index = currentIndex - stackPosition;
    if (index < 0 || index >= Users.length) return null;
    return { user: Users[index], index };
  };

  const getExitAnimation = (cardIndex: number) => {
    if (exitingCard !== cardIndex || !exitDirection) return {};
    
    const exitDistance = 1000;
    return {
      x: exitDirection === 'left' ? -exitDistance : exitDirection === 'right' ? exitDistance : 0,
      y: exitDirection === 'down' ? exitDistance : 0,
      opacity: 0,
      scale: 0.8,
      rotate: exitDirection === 'left' ? -20 : exitDirection === 'right' ? 20 : 0,
    };
  };

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '630px',
          marginTop: '-50px',
        }}
      >
        {[0, 1].map((stackPosition) => {
          const cardData = getCardToShow(stackPosition);
          if (!cardData) return null;
          
          const { user, index } = cardData;
          const isTop = stackPosition === 0;
          const isExiting = exitingCard === index;

          return (
            <motion.div
              key={`${user.name}-${index}`}
              drag={isTop && !isExiting}
              dragDirectionLock
              dragElastic={0.1}
              onDragEnd={isTop && !isExiting ? (e, info) => handleDragEnd(e, info, index) : undefined}
              whileDrag={{ 
                cursor: 'grabbing',
                scale: 1.05,
                zIndex: 1000,
              }}
              animate={
                isExiting
                  ? getExitAnimation(index)
                  : {
                      x: 0,
                      y: 0,
                      opacity: 1,
                      scale: isTop ? 1 : 0.95 - stackPosition * 0.05,
                      rotate: 0,
                    }
              }
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              style={{
                position: 'absolute',
                width: '100%',
                top: stackPosition * 10,
                left: 0,
                zIndex: Users.length - index,
                cursor: isTop && !isExiting ? 'grab' : 'default',
              }}
            >
              <Card user={user} />
            </motion.div>
          );
        })}
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          marginTop: '20px',
          justifyContent: 'center',
        }}
      >
        {Icons.map((icon, index) => (
          <IconWrapper
            icon={icon}
            index={index}
            key={icon.id}
            updateSwipe={updateSwipe}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileSwiper;

