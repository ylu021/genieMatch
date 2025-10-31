import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | 'default'
    | 'title'
    | 'defaultSemiBold'
    | 'subtitle'
    | 'link'
    | 'largeText'
    | 'warning'
    | 'sliderText';
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
};

const typeStyles: Record<string, React.CSSProperties> = {
  default: {
    fontSize: '12px',
    lineHeight: '24px',
  },
  defaultSemiBold: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '600',
  },
  sliderText: {
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: '600',
  },
  largeText: {
    fontSize: '38px',
    lineHeight: '44px',
    fontFamily: "'Source Sans Pro', sans-serif",
    fontWeight: '700',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    lineHeight: '32px',
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  link: {
    lineHeight: '30px',
    fontSize: '16px',
    color: '#0a7ea4',
  },
  warning: {
    color: '#FE2042',
    fontSize: '12px',
    fontFamily: "'Open Sans', sans-serif",
  },
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  as: Component = 'span',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Component
      style={{
        color,
        fontFamily: "'Open Sans', sans-serif",
        ...typeStyles[type],
        ...style,
      }}
      {...rest}
    />
  );
}

