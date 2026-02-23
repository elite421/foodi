import './globals.css';
import { CartProvider } from './components/CartContext';

export const metadata = {
  title: 'FooodieClub - Your Favorite Restaurant, Online',
  description: 'FooodieClub is your premium food destination. Order our exclusive menu online with fast delivery.',
  keywords: 'food delivery, order food online, restaurants, biryani, pizza, burger, FooodieClub',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
