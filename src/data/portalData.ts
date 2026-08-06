import { ServiceMarketplaceItem, DeveloperProfile, OrderItem } from '../types/prd';

export const serviceMarketplaceItems: ServiceMarketplaceItem[] = [
  {
    id: 'srv-001',
    title: 'Full Game Development & Architecture (Concept to Launch)',
    category: 'Full Game',
    startingPrice: 1500,
    estimatedDays: 21,
    rating: 4.98,
    completedCount: 42,
    iconName: 'Gamepad2',
    description: 'Complete end-to-end game production including game design document, Luau scripting, map building, UI/UX, datastores, monetized gamepasses, and anti-cheat.',
    features: ['Modular Luau Framework', 'Custom UI/UX & HUD', 'Monetization Gamepasses', 'Full Escrow Vault Protection', '30-Day Bug Warranty']
  },
  {
    id: 'srv-002',
    title: 'Custom Luau Scripting & Systems Architecture',
    category: 'Scripting',
    startingPrice: 350,
    estimatedDays: 5,
    rating: 4.95,
    completedCount: 88,
    iconName: 'Code2',
    description: 'Advanced Luau back-end systems: inventory, pet synthesis, leveling, trade systems, leaderboards, custom combat engines, and secure DataStore2 integrations.',
    features: ['Type-safe Luau Modules', 'Exploit-proof Validation', 'Clean Readable Code', 'Detailed Documentation']
  },
  {
    id: 'srv-003',
    title: '3D Map Design & High-Fidelity Studio Environment',
    category: 'Map Building',
    startingPrice: 600,
    estimatedDays: 10,
    rating: 4.91,
    completedCount: 56,
    iconName: 'Building2',
    description: 'Custom maps built directly in Roblox Studio or Blender, from anime style simulator maps to photorealistic sci-fi and horror places.',
    features: ['Optimized Mesh Parts & LODs', 'Custom Lighting & Atmospheres', 'Low-End Mobile Friendly']
  },
  {
    id: 'srv-004',
    title: 'Modern Glassmorphic UI/UX Design & Implementation',
    category: 'UI/UX Design',
    startingPrice: 250,
    estimatedDays: 4,
    rating: 4.97,
    completedCount: 64,
    iconName: 'Layout',
    description: 'Sleek animated user interface packages designed in Figma and scripted directly in Roblox Studio using Fusion or custom UI controllers.',
    features: ['Fully Responsive Layouts', 'Custom Vector Icons & FX', 'Smooth Tween Animations']
  }
];

export const developerProfiles: DeveloperProfile[] = [
  {
    id: 'dev-001',
    name: 'AeroScript_Dev',
    handle: '@aeroscript',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    verified: true,
    specialties: ['Lead Luau Engineer', 'Anti-Cheat Specialist', 'Datastores'],
    rating: 4.98,
    completedOrders: 42,
    activeQueueCount: 2,
    maxQueueCapacity: 3,
    hourlyRate: 65,
    bio: '6+ years in Roblox Studio Luau engineering. Specialized in high-scale simulator architecture and competitive combat engines.',
    portfolioItems: [
      { title: 'Dragon Simulator Core', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80', tag: 'Scripting' },
      { title: 'Cyber City Anti-Cheat', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80', tag: 'Security' }
    ]
  },
  {
    id: 'dev-002',
    name: 'VoxelArchitects',
    handle: '@voxel_arch',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    verified: true,
    specialties: ['3D Environment Artist', 'Blender Modeling', 'Lighting'],
    rating: 4.91,
    completedOrders: 35,
    activeQueueCount: 1,
    maxQueueCapacity: 3,
    hourlyRate: 55,
    bio: 'Professional level designer creating immersive Roblox Studio worlds with Future lighting and optimized MeshParts.',
    portfolioItems: [
      { title: 'Neon Cyberpunk Metropolis', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80', tag: 'Map' },
      { title: 'Fantasy Kingdom Castle', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80', tag: '3D Asset' }
    ]
  },
  {
    id: 'dev-003',
    name: 'KryptonUI',
    handle: '@krypton_ui',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    verified: true,
    specialties: ['Figma UI Designer', 'Luau Interface Scripting', 'HUD Systems'],
    rating: 4.96,
    completedOrders: 28,
    activeQueueCount: 3,
    maxQueueCapacity: 3,
    hourlyRate: 50,
    bio: 'UI designer creating sleek mobile-responsive interfaces for top Roblox experiences.',
    portfolioItems: [
      { title: 'Modern RPG Inventory Suite', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80', tag: 'UI' }
    ]
  }
];

export const sampleOrders: OrderItem[] = [
  {
    id: 'KVS-20260731-001',
    serviceTitle: 'Full RPG Game Architecture & Combat Mechanics',
    clientName: 'NovaStudios_CEO',
    clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    developerName: 'AeroScript_Dev',
    developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    amount: 1200,
    escrowStatus: 'LOCKED_IN_ESCROW',
    orderStatus: 'In Progress',
    progressPercentage: 65,
    deadline: '2026-08-12',
    createdAt: '2026-07-28',
    warrantyDaysLeft: 30,
    messagesCount: 14,
    deliverableFile: 'RPG_Game_v1.0_Checkpoint.rbxl',
    description: 'Complete turn-based RPG with custom inventory, questing system, level progression, and boss fight mechanics in Roblox Studio.',
    checkpoints: [
      { title: '25% Graybox Map & Core DataStores', percentage: 25, status: 'COMPLETED', updatedAt: '2026-07-29', proofNote: 'DataStore schema verified.' },
      { title: '50% Combat Engine & Enemy AI', percentage: 50, status: 'COMPLETED', updatedAt: '2026-07-30', proofNote: 'AI Raycasting hitboxes working.' },
      { title: '75% UI Integration & Sound FX', percentage: 75, status: 'IN_PROGRESS', updatedAt: '2026-07-30' },
      { title: '100% Final Deliverable & QA Audit', percentage: 100, status: 'PENDING' }
    ]
  },
  {
    id: 'KVS-20260728-004',
    serviceTitle: 'Cyberpunk City Simulator Map (3000x3000 Studs)',
    clientName: 'NexusGames_RBLX',
    clientAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    developerName: 'VoxelArchitects',
    developerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    amount: 750,
    escrowStatus: 'LOCKED_IN_ESCROW',
    orderStatus: 'Submitted for Review',
    progressPercentage: 100,
    deadline: '2026-08-01',
    createdAt: '2026-07-20',
    messagesCount: 22,
    deliverableFile: 'Cyberpunk_City_Final_v2.rbxl',
    description: '3000x3000 stud cyberpunk neon city with interior shop buildings, road network, optimized LOD mesh parts.',
    checkpoints: [
      { title: '25% Road Layout & Terrain Blockout', percentage: 25, status: 'COMPLETED' },
      { title: '50% Buildings & Exterior Modeling', percentage: 50, status: 'COMPLETED' },
      { title: '75% Neon Lighting & PBR Shaders', percentage: 75, status: 'COMPLETED' },
      { title: '100% Final Map Upload & Optimization', percentage: 100, status: 'COMPLETED', proofNote: 'Benchmarked 60 FPS on low RAM devices.' }
    ]
  },
  {
    id: 'KVS-20260725-009',
    serviceTitle: 'Pet Trading & Inventory UI System',
    clientName: 'PixelCraft_Studios',
    clientAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    developerName: 'KryptonUI',
    developerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    amount: 400,
    escrowStatus: 'RELEASED_TO_DEV',
    orderStatus: '30-Day Warranty',
    progressPercentage: 100,
    deadline: '2026-07-27',
    createdAt: '2026-07-15',
    warrantyDaysLeft: 26,
    messagesCount: 18,
    deliverableFile: 'Pet_Trading_System_V2.zip',
    description: 'Pet inventory grid with drag and drop, two-sided trade window with confirmation checkmarks, and Luau server security.',
    checkpoints: [
      { title: '25% UI Wireframe', percentage: 25, status: 'COMPLETED' },
      { title: '50% Luau Client Scripting', percentage: 50, status: 'COMPLETED' },
      { title: '75% Server Validation', percentage: 75, status: 'COMPLETED' },
      { title: '100% Final Sign-off', percentage: 100, status: 'COMPLETED' }
    ]
  }
];

export const adminMetrics = {
  totalGMV: 148250,
  escrowBalance: 24500,
  netPlatformRevenue: 14825, // 10%
  activeOrdersCount: 38,
  verifiedDevelopersCount: 18,
  activeQueueCapacity: '32 / 54 Slots Occupied',
  pendingDisputesCount: 2,
  pendingAssetsModerationCount: 4,
  pendingDevVerificationCount: 3,
  systemStatus: 'Operational (100% Uptime)'
};
