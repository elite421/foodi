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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
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
