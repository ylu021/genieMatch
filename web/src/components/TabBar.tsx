import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useColorScheme } from '@/hooks/useColorScheme';

const greyColor = '#737373';

interface TabBarItem {
  name: string;
  route: string;
  icon: React.ComponentType<{ color?: string; size?: number }>;
}

const tabs: TabBarItem[] = [
  {
    name: 'Home',
    route: '/main',
    icon: Home,
  },
];

export default function TabBar() {
  const location = useLocation();
  const colorScheme = useColorScheme();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'black',
        marginLeft: '20px',
        marginRight: '20px',
        marginBottom: '20px',
        paddingTop: '16px',
        paddingBottom: '16px',
      }}
    >
      {tabs.map((tab) => {
        const isFocused = location.pathname === tab.route;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.name}
            to={tab.route}
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Icon
              color={isFocused ? greyColor : 'white'}
              size={26}
            />
          </Link>
        );
      })}
    </div>
  );
}

