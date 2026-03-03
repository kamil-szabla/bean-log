import { createClient } from '@supabase/supabase-js';

type Roaster = {
  name: string;
  city: string;
  country: string;
  website: string;
  instagram: string;
  address: string;
  lat?: number;
  lng?: number;
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const roasters: Roaster[] = [
  { name: 'Assembly Coffee', city: 'London', country: 'UK', website: 'https://assemblycoffee.co.uk', instagram: '@assemblycoffee', address: 'Brixton, London', lat: 51.4626, lng: -0.1163 },
  { name: 'Square Mile Coffee', city: 'London', country: 'UK', website: 'https://shop.squaremilecoffee.com', instagram: '@squaremilecoffee', address: 'Hackney, London', lat: 51.545, lng: -0.055 },
  { name: 'Workshop Coffee', city: 'London', country: 'UK', website: 'https://workshopcoffee.com', instagram: '@workshopcoffee', address: 'Clerkenwell, London', lat: 51.5247, lng: -0.1042 },
  { name: 'Nude Coffee Roasters', city: 'London', country: 'UK', website: 'https://nudecoffee.com', instagram: '@nudecoffee', address: 'East London', lat: 51.5465, lng: -0.0576 },
  { name: 'Hasbean', city: 'Stafford', country: 'UK', website: 'https://www.hasbean.co.uk', instagram: '@hasbean', address: 'Stafford, UK' },
  { name: 'Origin Coffee', city: 'London', country: 'UK', website: 'https://www.origincoffee.co.uk', instagram: '@origincoffee', address: 'Shoreditch, London', lat: 51.5255, lng: -0.0785 },
  { name: 'Climpson & Sons', city: 'London', country: 'UK', website: 'https://climpsonandsons.com', instagram: '@climpsonandsons', address: 'Broadway Market, London', lat: 51.5368, lng: -0.0564 },
  { name: 'Colonna Coffee', city: 'Bath', country: 'UK', website: 'https://colonnacoffee.com', instagram: '@colonnacoffee', address: 'Bath, UK' },
  { name: 'Pact Coffee', city: 'London', country: 'UK', website: 'https://www.pactcoffee.com', instagram: '@pactcoffee', address: 'Bermondsey, London', lat: 51.498, lng: -0.0717 },
  { name: 'Dark Woods Coffee', city: 'Huddersfield', country: 'UK', website: 'https://darkwoodscoffee.co.uk', instagram: '@darkwoodscoffee', address: 'Huddersfield, UK' },
];

const origins = ['Ethiopia', 'Colombia', 'Kenya', 'Rwanda', 'Guatemala', 'Brazil', 'Costa Rica'];
const regions = ['Yirgacheffe', 'Huila', 'Nyeri', 'Kayonza', 'Antigua', 'Sul de Minas', 'Tarrazú'];
const processes = ['washed', 'natural', 'honey', 'anaerobic'];
const varietals = ['Bourbon', 'Caturra', 'SL28', 'Heirloom', 'Geisha', 'Typica'];
const roastLevels = ['light', 'medium', 'dark'];
const noteSets = [
  ['citrus', 'jasmine', 'tea-like'],
  ['chocolate', 'caramel', 'hazelnut'],
  ['berry', 'floral', 'stone fruit'],
  ['tropical', 'boozy', 'jammy'],
  ['toffee', 'apple', 'almond'],
];

async function run() {
  const { data: insertedRoasters, error: roasterError } = await supabase
    .from('roasters')
    .upsert(roasters, { onConflict: 'name' })
    .select('id,name');

  if (roasterError) throw roasterError;
  if (!insertedRoasters?.length) throw new Error('No roasters inserted');

  const beans = Array.from({ length: 50 }).map((_, i) => {
    const roaster = insertedRoasters[i % insertedRoasters.length];
    return {
      roaster_id: roaster.id,
      name: `${roaster.name.split(' ')[0]} Seasonal Lot ${i + 1}`,
      origin_country: origins[i % origins.length],
      origin_region: regions[i % regions.length],
      process: processes[i % processes.length],
      varietal: varietals[i % varietals.length],
      altitude_m: 1400 + (i % 8) * 100,
      roast_level: roastLevels[i % roastLevels.length],
      tasting_notes: noteSets[i % noteSets.length],
      description: 'Balanced cup for espresso and filter with clean sweetness.',
    };
  });

  const { error: beanError } = await supabase.from('beans').upsert(beans, { onConflict: 'roaster_id,name' });
  if (beanError) throw beanError;

  console.log(`Seeded ${insertedRoasters.length} roasters and ${beans.length} beans.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
