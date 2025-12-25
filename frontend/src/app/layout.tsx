import './globals.css';
import { UserProvider } from '@/context/UserContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
