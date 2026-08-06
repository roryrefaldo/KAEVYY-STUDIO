import { ShareAssetItem } from '../types/prd';

export const sampleShareAssets: ShareAssetItem[] = [
  {
    id: 'asset-001',
    title: 'Kaevy Framework Core v2.4 (Modular Server/Client Framework)',
    description: 'A high-performance modular Roblox framework supporting strict type checking, promise-based remote procedure calls, lifecycle networking, and auto-injecting UI state managers.',
    category: 'Systems',
    tags: ['Framework', 'Network', 'Modular', 'Roblox Studio', 'TypeSafe'],
    version: '2.4.0',
    license: 'MIT License',
    fileFormat: 'ZIP (Recommended - Contains RBXL, LUA Modules & Docs)',
    fileSize: '14.2 MB',
    downloadsCount: 3842,
    rating: 4.95,
    reviewsCount: 128,
    creatorName: 'AeroScript_Dev',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isVerifiedCreator: true,
    createdAt: '2026-06-15',
    updatedAt: '2026-07-28',
    moderationStatus: 'Approved',
    securityScanPassed: true,
    changelog: [
      'v2.4.0 - Added TypeScript / Luau strict mode definitions for DataStore v2',
      'v2.3.2 - Fixed memory leak in remote signal garbage collector',
      'v2.2.0 - Introduced auto-reconnecting client state manager'
    ],
    docSections: [
      {
        id: 'doc-1',
        title: '1. Architecture & Installation Overview',
        content: `### Getting Started
Download the archive and extract the package. 

Place the **KaevyCore** folder into ReplicatedStorage inside your Roblox Studio project.

Module Setup:
-- In ServerScriptService / ServerMain.server.lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local KaevyCore = require(ReplicatedStorage.KaevyCore)

KaevyCore.StartServer({
    DebugMode = true,
    EnableAntiExploitReg = true,
    DataStoreAutoSaveInterval = 180
})
print("Kaevy Core Framework Initialized Successfully!")`
      },
      {
        id: 'doc-2',
        title: '2. Client & Server Remote Event Handling',
        content: `### Promise-Based Networking
Eliminate spaghetti code using built-in network handlers:

Client Module Invocation:
-- On Client (LocalScript)
local KaevyCore = require(game.ReplicatedStorage.KaevyCore)
local Network = KaevyCore.GetModule("Network")

Network.InvokeServer("RequestPlayerData", "Inventory"):andThen(function(data)
    print("Received inventory count:", #data)
end):catch(warn)`
      },
      {
        id: 'doc-3',
        title: '3. Security & Anti-Exploit Guard',
        content: 'Includes automatic packet rate limiting, server-authoritative physics verification, and signature validation for client inputs.'
      }
    ]
  },
  {
    id: 'asset-002',
    title: 'Cyberpunk Sci-Fi City Map Pack (Full Environment)',
    description: 'Ultra-detailed modular cyberpunk street environment featuring custom neon shaders, PBR textures, optimized LOD meshes, and animated digital billboards.',
    category: 'Maps',
    tags: ['Cyberpunk', 'City', 'Map', 'PBR', 'Neon', 'Sci-Fi'],
    version: '1.1.0',
    license: 'Custom Studio License (Commercial Use Allowed)',
    fileFormat: 'ZIP (Contains RBXL Place + FBX Models & Textures)',
    fileSize: '184.5 MB',
    downloadsCount: 1950,
    rating: 4.88,
    reviewsCount: 84,
    creatorName: 'VoxelArchitects',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerifiedCreator: true,
    createdAt: '2026-05-10',
    updatedAt: '2026-07-20',
    moderationStatus: 'Approved',
    securityScanPassed: true,
    docSections: [
      {
        id: 'doc-1',
        title: '1. Map Overview & Performance Metrics',
        content: 'This environment has been benchmarked on low-end mobile devices (iPhone 11, low RAM Android) yielding a steady 60 FPS under Future Lighting conditions thanks to strict MeshPart LODs.'
      },
      {
        id: 'doc-2',
        title: '2. Lighting & Post-Processing Setup',
        content: 'Ensure Lighting Technology is set to **Future** in Roblox Place Settings for realistic reflection probes and volumetric fog rendering.'
      }
    ]
  },
  {
    id: 'asset-003',
    title: 'Advanced Inventory & Crafting UI System (Glassmorphic Luau)',
    description: 'Fully responsive drag-and-drop inventory system with item stacking, rarity color coding, equipment slots, shop vendor UI, and sound effects.',
    category: 'UI',
    tags: ['Inventory', 'Crafting', 'UI', 'HUD', 'RPG', 'DragAndDrop'],
    version: '3.0.1',
    license: 'MIT License',
    fileFormat: 'ZIP (RBXL Demo Place + Fusion/Roact UI Components)',
    fileSize: '28.4 MB',
    downloadsCount: 2890,
    rating: 4.92,
    reviewsCount: 96,
    creatorName: 'KryptonUI',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    isVerifiedCreator: true,
    createdAt: '2026-06-01',
    updatedAt: '2026-07-25',
    moderationStatus: 'Approved',
    securityScanPassed: true,
    docSections: [
      {
        id: 'doc-1',
        title: '1. Integration Steps',
        content: 'Drag the ScreenGui into `StarterGui`. Set up item definitions in `ReplicatedStorage.ItemConfig` using simple Luau dictionaries.'
      },
      {
        id: 'doc-2',
        title: '2. Adding Custom Items',
        content: 'To add a new item, add an entry to the ItemTable with name, icon ID, maxStack, and rarity level.'
      }
    ]
  },
  {
    id: 'asset-004',
    title: 'Combat Engine EX - Combo, Parry, Lock-On & Hitbox',
    description: 'Melee combat framework built for fast-paced action games. Features RaycastHitbox v4 integration, directional parry window, posture break, and camera lock-on.',
    category: 'Scripts',
    tags: ['Combat', 'Melee', 'Hitbox', 'Parry', 'LockOn', 'Luau'],
    version: '1.5.0',
    license: 'MIT License',
    fileFormat: 'ZIP (Contains RBXL + ModuleScripts)',
    fileSize: '8.9 MB',
    downloadsCount: 4210,
    rating: 4.98,
    reviewsCount: 162,
    creatorName: 'BladeMaster_RBLX',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isVerifiedCreator: true,
    createdAt: '2026-04-12',
    updatedAt: '2026-07-29',
    moderationStatus: 'Approved',
    securityScanPassed: true,
    docSections: [
      {
        id: 'doc-1',
        title: '1. Combat Logic Setup',
        content: 'Includes server-verified hit detection using 3D spatial raycasting to eliminate client-side distance cheating.'
      }
    ]
  },
  {
    id: 'asset-005',
    title: 'Low-Poly RPG Weapon & Armor Asset Pack (40+ Models)',
    description: 'A massive bundle of 40+ textured low-poly swords, axes, bows, shields, helmets, and chestplates optimized for Roblox Studio MeshParts.',
    category: 'Models',
    tags: ['LowPoly', 'Weapons', 'RPG', '3D Models', 'FBX', 'MeshPart'],
    version: '2.0.0',
    license: 'Public Domain / CC0',
    fileFormat: 'ZIP (FBX + OBJ + Roblox Model RBXM)',
    fileSize: '45.1 MB',
    downloadsCount: 5120,
    rating: 4.85,
    reviewsCount: 110,
    creatorName: 'PixelForge3D',
    creatorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    isVerifiedCreator: true,
    createdAt: '2026-03-20',
    updatedAt: '2026-07-10',
    moderationStatus: 'Approved',
    securityScanPassed: true,
    docSections: [
      {
        id: 'doc-1',
        title: '1. Mesh Import Guide',
        content: 'Import the provided `.rbxm` directly into `ReplicatedStorage.WeaponStorage` or import individual `.fbx` models using Roblox Studio Bulk Import.'
      }
    ]
  },
  {
    id: 'asset-006',
    title: 'Studio Helper Plugin: Auto-LOD Generator & Texture Compressor',
    description: 'Roblox Studio editor plugin that automatically generates optimized LOD levels for complex meshes and compresses high-res decal textures with one click.',
    category: 'Plugins',
    tags: ['Plugin', 'Studio', 'Optimization', 'LOD', 'Texture', 'Tools'],
    version: '1.0.4',
    license: 'MIT License',
    fileFormat: 'ZIP (Plugin RBXMX + Installation Readme)',
    fileSize: '4.2 MB',
    downloadsCount: 1240,
    rating: 4.79,
    reviewsCount: 42,
    creatorName: 'DevToolbox_Studio',
    creatorAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    isVerifiedCreator: false,
    createdAt: '2026-07-02',
    updatedAt: '2026-07-27',
    moderationStatus: 'Approved',
    securityScanPassed: true,
    docSections: [
      {
        id: 'doc-1',
        title: '1. Installation into Roblox Studio',
        content: 'Copy the `.rbxmx` file into your local `%LOCALAPPDATA%\\Roblox\\Plugins` folder and restart Roblox Studio.'
      }
    ]
  }
];
