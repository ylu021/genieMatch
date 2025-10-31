import Overlay from './Overlay';
import ProfileNameText from './ui/ProfileNameText';
import { ThemedText } from './ThemedText';
import PillLabel from './PillLabel';

const getProfileImage = (imageName: string): string => {
  const images: Record<string, string> = {
    user1: '/images/profiles/user1.png',
    user2: '/images/profiles/user2.png',
    user3: '/images/profiles/user3.png',
    user4: '/images/profiles/user4.png',
    user5: '/images/profiles/user5.png',
  };

  return images[imageName] || images['user1'];
};

interface User {
  name: string;
  age: number;
  bio: string;
  interests: string[];
  image: string;
}

interface CardProps {
  user: User;
}

const Card = ({ user }: CardProps) => {
  return (
    <div
      style={{
        width: 'calc(100vw - 10px)',
        maxWidth: '100%',
        justifyContent: 'center',
        alignSelf: 'center',
        height: '580px',
        backgroundColor: 'white',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${getProfileImage(user.image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Overlay type="white" />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            padding: '16px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              gap: '6px',
            }}
          >
            <ProfileNameText lightColor="white">{user.name}</ProfileNameText>
            <ThemedText type="largeText" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {user.age}
            </ThemedText>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '5px',
              marginTop: '5px',
              marginBottom: '5px',
            }}
          >
            {user.interests.map((interest) => (
              <PillLabel key={interest} text={interest} />
            ))}
          </div>
          <ThemedText lightColor="white">{user.bio}</ThemedText>
        </div>
      </div>
    </div>
  );
};

export default Card;

