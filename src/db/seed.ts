import { db } from './index.js';
import {
  roles, permissions, rolePermissions,
  serviceCategories, assetCategories, exchangeRates, platformFeeSettings,
  users, userRoles, clientProfiles, developerProfiles,
  services, assets, assetFiles, assetDocumentationBlocks
} from './schema/index.js';

export async function seedDatabase() {
  console.log('🌱 Seeding KAEVY STUDIO PostgreSQL database...');

  // 1. Roles Seed
  const rolesData = await db.insert(roles).values([
    { id: '10000000-0000-0000-0000-000000000001', code: 'CLIENT', name: 'Client', description: 'Can order services, message developers, view warranty' },
    { id: '10000000-0000-0000-0000-000000000002', code: 'DEVELOPER', name: 'Developer', description: 'Can list services, fulfill orders, upload assets' },
    { id: '10000000-0000-0000-0000-000000000003', code: 'ADMIN', name: 'Admin', description: 'Platform administration, verification, escrow & disputes' },
  ]).onConflictDoNothing().returning();

  // 2. Service Categories Seed
  await db.insert(serviceCategories).values([
    { id: '20000000-0000-0000-0000-000000000001', name: 'Lua / Luau Scripting', slug: 'lua-scripting', description: 'Backend game logic, Datastores, Anti-cheat', iconName: 'Code2', displayOrder: 1 },
    { id: '20000000-0000-0000-0000-000000000002', name: 'Environment / Map Building', slug: 'map-building', description: 'PBR maps, terrain, architecture', iconName: 'Map', displayOrder: 2 },
    { id: '20000000-0000-0000-0000-000000000003', name: 'UI/UX Interface Systems', slug: 'ui-ux', description: 'Animated HUDs, shop menus, responsive UI', iconName: 'Layout', displayOrder: 3 },
    { id: '20000000-0000-0000-0000-000000000004', name: '3D Modeling & Assets', slug: '3d-modeling', description: 'Low-poly & high-detail Roblox mesh models', iconName: 'Box', displayOrder: 4 },
  ]).onConflictDoNothing();

  // 3. Asset Categories Seed
  await db.insert(assetCategories).values([
    { id: '25000000-0000-0000-0000-000000000001', name: 'Lua Scripts & Modules', slug: 'lua-modules' },
    { id: '25000000-0000-0000-0000-000000000002', name: '3D Models & Meshes', slug: '3d-models' },
    { id: '25000000-0000-0000-0000-000000000003', name: 'UI Elements & Kits', slug: 'ui-kits' },
  ]).onConflictDoNothing();

  // 4. Initial Exchange Rate Seed (USD -> IDR = 16,200)
  await db.insert(exchangeRates).values([
    { id: '30000000-0000-0000-0000-000000000001', baseCurrency: 'USD', quoteCurrency: 'IDR', rate: '16200.000000', source: 'INITIAL_CONFIG' },
  ]).onConflictDoNothing();

  // 5. Initial Platform Fee Seed (10%)
  await db.insert(platformFeeSettings).values([
    { id: '40000000-0000-0000-0000-000000000001', feePercentage: '0.1000' },
  ]).onConflictDoNothing();

  // 6. Users Seed
  const adminUser = await db.insert(users).values({
    id: '50000000-0000-0000-0000-000000000001',
    email: 'admin@kaevy.studio',
    displayName: 'Kaevy Administrator',
    status: 'ACTIVE',
  }).onConflictDoNothing().returning();

  const clientUser = await db.insert(users).values({
    id: '50000000-0000-0000-0000-000000000002',
    email: 'client@kaevy.studio',
    displayName: 'Kaelen Client',
    status: 'ACTIVE',
  }).onConflictDoNothing().returning();

  const devVerifiedUser = await db.insert(users).values({
    id: '50000000-0000-0000-0000-000000000003',
    email: 'dev.verified@kaevy.studio',
    displayName: 'NexusScripting (Verified Dev)',
    status: 'ACTIVE',
  }).onConflictDoNothing().returning();

  const devEliteUser = await db.insert(users).values({
    id: '50000000-0000-0000-0000-000000000004',
    email: 'dev.elite@kaevy.studio',
    displayName: 'AetheriaStudio (Elite Dev)',
    status: 'ACTIVE',
  }).onConflictDoNothing().returning();

  // 7. User Roles Mapping
  await db.insert(userRoles).values([
    { userId: '50000000-0000-0000-0000-000000000001', roleId: '10000000-0000-0000-0000-000000000003' }, // Admin
    { userId: '50000000-0000-0000-0000-000000000002', roleId: '10000000-0000-0000-0000-000000000001' }, // Client
    { userId: '50000000-0000-0000-0000-000000000003', roleId: '10000000-0000-0000-0000-000000000002' }, // Dev Verified
    { userId: '50000000-0000-0000-0000-000000000004', roleId: '10000000-0000-0000-0000-000000000002' }, // Dev Elite
  ]).onConflictDoNothing();

  // 8. Profiles Seed
  await db.insert(clientProfiles).values({
    id: '60000000-0000-0000-0000-000000000001',
    userId: '50000000-0000-0000-0000-000000000002',
    discordUsername: 'KaelenClient#1234',
    companyName: 'Kaelen Games Studio',
  }).onConflictDoNothing();

  await db.insert(developerProfiles).values([
    {
      id: '70000000-0000-0000-0000-000000000001',
      userId: '50000000-0000-0000-0000-000000000003',
      bio: 'Expert Luau backend systems developer with 5+ years Roblox experience.',
      specialization: 'Lua / Luau Scripting',
      skills: ['Luau', 'Datastores', 'Combat Systems', 'Anti-cheat'],
      verificationStatus: 'VERIFIED',
      developerTier: 'VERIFIED',
      activeProjectCapacity: 3,
    },
    {
      id: '70000000-0000-0000-0000-000000000002',
      userId: '50000000-0000-0000-0000-000000000004',
      bio: 'Elite Studio specialized in full game framework development and high-throughput datastores.',
      specialization: 'Lua / Luau Scripting',
      skills: ['Full Game Frameworks', 'UI/UX', 'Datastores', 'Custom Physics'],
      verificationStatus: 'ELITE',
      developerTier: 'ELITE',
      activeProjectCapacity: 5,
    }
  ]).onConflictDoNothing();

  // 9. Sample Services Seed
  await db.insert(services).values([
    {
      id: '80000000-0000-0000-0000-000000000001',
      developerProfileId: '70000000-0000-0000-0000-000000000001',
      categoryId: '20000000-0000-0000-0000-000000000001',
      title: 'Advanced Combat & Weapon System',
      slug: 'advanced-combat-weapon-system',
      description: 'Production-ready server-authoritative combat framework with combo mechanics, custom hitboxes, and projectile collision.',
      pricingType: 'FIXED',
      basePrice: '3500000.00',
      baseCurrency: 'IDR',
      estimatedDeliveryDays: 7,
      status: 'ACTIVE',
    }
  ]).onConflictDoNothing();

  // 10. Sample Share Asset Seed
  await db.insert(assets).values([
    {
      id: '90000000-0000-0000-0000-000000000001',
      uploadedByUserId: '50000000-0000-0000-0000-000000000003', // Developer NexusScripting
      categoryId: '25000000-0000-0000-0000-000000000001',
      title: 'FastSignal - High Performance Luau Event System',
      slug: 'fastsignal-luau-event-system',
      description: 'Zero-allocation signal library designed for high-frequency Luau event dispatches in Roblox games.',
      version: '1.2.0',
      visibility: 'PUBLIC',
      status: 'APPROVED',
      downloadsCount: 1420,
      ratingAverage: '4.95',
    }
  ]).onConflictDoNothing();

  await db.insert(assetFiles).values([
    {
      id: '91000000-0000-0000-0000-000000000001',
      assetId: '90000000-0000-0000-0000-000000000001',
      fileName: 'FastSignal.luau',
      fileSizeBytes: 12450,
      mimeType: 'text/x-lua',
      storageKey: 'share-assets/FastSignal.luau',
      version: '1.2.0',
    }
  ]).onConflictDoNothing();

  await db.insert(assetDocumentationBlocks).values([
    {
      id: '92000000-0000-0000-0000-000000000001',
      assetId: '90000000-0000-0000-0000-000000000001',
      title: 'Installation & API Usage',
      content: 'Require the FastSignal module script: local Signal = require(path.to.FastSignal). Usage: local event = Signal.new()',
      positionOrder: 1,
    }
  ]).onConflictDoNothing();

  console.log('✅ Database seeding complete.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
