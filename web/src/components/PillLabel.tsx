import { ThemedText } from './ThemedText';

interface PillLabelProps {
  text: React.ReactNode;
  bgColor?: string;
  outline?: string;
  fat?: boolean;
  onPress?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const PillLabel = ({ text, bgColor, fat, outline, onPress }: PillLabelProps) => {
  return (
    <div
      onClick={onPress}
      style={{
        borderRadius: '20px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: fat ? '4px' : '0',
        paddingBottom: fat ? '4px' : '0',
        borderColor: outline || 'transparent',
        borderWidth: outline ? '1px' : '0',
        borderStyle: 'solid',
        backgroundColor: bgColor || 'rgba(255,255,255, 0.25)',
        alignSelf: 'center',
        cursor: onPress ? 'pointer' : 'default',
      }}
    >
      <ThemedText style={{ color: 'white' }}>{text}</ThemedText>
    </div>
  );
};

export default PillLabel;

