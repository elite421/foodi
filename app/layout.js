import './globals.css';
import { CartProvider } from './components/CartContext';

export const metadata = {
  title: 'FoodiClub - Your Favorite Restaurant, Online',
  description: 'FoodiClub is your premium food destination. Order our exclusive menu online with fast delivery.',
  keywords: 'food delivery, order food online, restaurants, biryani, pizza, burger, FoodiClub',
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
