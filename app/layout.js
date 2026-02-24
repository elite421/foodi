import './globals.css';
import { CartProvider } from './components/CartContext';
import { LocationProvider } from './components/LocationContext';
import { readData } from './lib/dataManager';

export const metadata = {
  title: 'FooodieClub - Your Favorite Restaurant, Online',
  description: 'FooodieClub is your premium food destination. Order our exclusive menu online with fast delivery.',
  keywords: 'food delivery, order food online, restaurants, biryani, pizza, burger, FooodieClub',
};

export default async function RootLayout({ children }) {
  let settings = {};
  try {
    const data = await readData();
    settings = data?.settings || {};
  } catch (e) {
    console.error('Failed to load settings in RootLayout:', e);
  }

  return (
    <html lang="en">
      <body>
        <CartProvider>
          <LocationProvider settings={settings}>
            {children}
          </LocationProvider>
        </CartProvider>
      </body>
    </html>
  );
}
