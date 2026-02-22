import HomeWrapper from './components/HomeWrapper';
import { readData } from './lib/dataManager';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await readData();
  return <HomeWrapper data={data} />;
}
