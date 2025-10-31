import { ThemedText } from '../ThemedText';

const ProfileNameText = ({
  children,
  ...otherProps
}: {
  children: React.ReactNode;
  lightColor?: string;
  darkColor?: string;
}) => {
  return (
    <ThemedText
      style={{
        fontSize: '34px',
        fontFamily: "'Source Sans Pro', sans-serif",
        fontWeight: '700',
        lineHeight: '44px',
      }}
      {...otherProps}
    >
      {children}
    </ThemedText>
  );
};

export default ProfileNameText;

