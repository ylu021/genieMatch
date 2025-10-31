import { Link } from 'react-router-dom';
import GradientButton from './GradientButton';

interface ButtonProps {
  href?: string;
  type?: 'primary' | 'secondary';
  children: React.ReactNode;
  push?: boolean;
  style?: React.CSSProperties;
  onPress?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const Button = ({
  href,
  type = 'primary',
  children,
  style,
  onPress,
  disabled,
  ...props
}: ButtonProps) => {
  const buttonStyles: React.CSSProperties = {
    backgroundColor: 'white',
    width: '263px',
    height: '56px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '6px',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '15px',
    paddingBottom: '15px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...style,
  };

  if (type === 'secondary') {
    const SecondaryButton = (
      <GradientButton style={buttonStyles} color="white" onClick={onPress} disabled={disabled} {...props}>
        {children}
      </GradientButton>
    );
    return href ? (
      <Link to={href} style={{ textDecoration: 'none' }}>
        {SecondaryButton}
      </Link>
    ) : (
      SecondaryButton
    );
  }

  if (!href) {
    return (
      <button
        style={buttonStyles}
        onClick={onPress}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <Link to={href} style={{ textDecoration: 'none' }}>
      <button style={buttonStyles} {...props}>
        {children}
      </button>
    </Link>
  );
};

export default Button;

