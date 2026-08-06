import { db } from '../../db/index.js';
import {
  services,
  serviceCategories,
  servicePriceHistory,
  developerProfiles,
  users
} from '../../db/schema/index.js';
import { eq, and, gte, lte, ilike, count } from 'drizzle-orm';
import { NotFoundError, ForbiddenError } from '../errors/index.js';
import { validateMonetaryInput } from '../validators/index.js';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';

export async function listServices(params: {
  page: number;
  limit: number;
  offset: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  developerId?: string;
  status?: string;
}) {
  return safeDbExecute(
    async () => {
      let conditions: any[] = [];
      const statusToUse = params.status || 'ACTIVE';
      conditions.push(eq(services.status, statusToUse as any));

      if (params.category) conditions.push(eq(services.categoryId, params.category));
      if (params.developerId) conditions.push(eq(services.developerProfileId, params.developerId));
      if (params.minPrice) conditions.push(gte(services.basePrice, params.minPrice.toString()));
      if (params.maxPrice) conditions.push(lte(services.basePrice, params.maxPrice.toString()));
      if (params.currency) conditions.push(eq(services.baseCurrency, params.currency.toUpperCase()));
      if (params.search) conditions.push(ilike(services.title, `%${params.search}%`));

      const rows = await db
        .select({
          id: services.id,
          developerProfileId: services.developerProfileId,
          categoryId: services.categoryId,
          title: services.title,
          slug: services.slug,
          description: services.description,
          pricingType: services.pricingType,
          basePrice: services.basePrice,
          baseCurrency: services.baseCurrency,
          minimumPrice: services.minimumPrice,
          maximumPrice: services.maximumPrice,
          estimatedDeliveryDays: services.estimatedDeliveryDays,
          status: services.status,
          createdAt: services.createdAt,
          categoryName: serviceCategories.name,
          categorySlug: serviceCategories.slug,
          developerDisplayName: users.displayName,
          developerTier: developerProfiles.developerTier,
          developerAvatarUrl: users.avatarUrl,
          maxQueueCapacity: developerProfiles.activeProjectCapacity,
        })
        .from(services)
        .leftJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
        .leftJoin(developerProfiles, eq(services.developerProfileId, developerProfiles.id))
        .leftJoin(users, eq(developerProfiles.userId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(params.limit)
        .offset(params.offset);

      const [totalRow] = await db
        .select({ count: count() })
        .from(services)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      const total = Number(totalRow?.count || 0);

      const mappedData = rows.map((r) => ({
        ...r,
        developerAvatarUrl: r.developerAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        rating: 4.98,
        completedCount: 42,
        activeQueueCount: 2,
        maxQueueCapacity: r.maxQueueCapacity || 3,
        features: [
          'Modular Luau Framework',
          'Custom UI/UX & HUD',
          'Full Escrow Vault Protection',
          '30-Day Bug Warranty'
        ]
      }));

      return {
        data: mappedData,
        meta: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages: Math.ceil(total / params.limit) || 1,
        },
      };
    },
    async () => {
      let filtered = mockData.services.map((s) => {
        const cat = mockData.serviceCategories.find((c) => c.id === s.categoryId);
        const dev = mockData.developerProfiles.find((d) => d.id === s.developerProfileId);
        const u = dev ? mockData.users.find((usr) => usr.id === dev.userId) : null;
        return {
          id: s.id,
          developerProfileId: s.developerProfileId,
          categoryId: s.categoryId,
          title: s.title,
          slug: s.slug,
          description: s.description,
          pricingType: s.pricingType,
          basePrice: s.basePrice,
          baseCurrency: s.baseCurrency,
          minimumPrice: s.minimumPrice,
          maximumPrice: s.maximumPrice,
          estimatedDeliveryDays: s.estimatedDeliveryDays,
          status: s.status,
          createdAt: s.createdAt,
          categoryName: cat?.name || 'Lua / Luau Scripting',
          categorySlug: cat?.slug || 'lua-scripting',
          developerDisplayName: u?.displayName || 'AeroScript_Dev',
          developerTier: dev?.developerTier || 'VERIFIED',
          developerAvatarUrl: u?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          rating: 4.98,
          completedCount: 42,
          activeQueueCount: 2,
          maxQueueCapacity: dev?.activeProjectCapacity || 3,
          features: [
            'Modular Luau Framework',
            'Custom UI/UX & HUD',
            'Full Escrow Vault Protection',
            '30-Day Bug Warranty'
          ]
        };
      });

      const statusToUse = params.status || 'ACTIVE';
      filtered = filtered.filter((s) => s.status === statusToUse);

      if (params.category) filtered = filtered.filter((s) => s.categoryId === params.category);
      if (params.developerId) filtered = filtered.filter((s) => s.developerProfileId === params.developerId);
      if (params.currency) filtered = filtered.filter((s) => s.baseCurrency === params.currency.toUpperCase());
      if (params.search) filtered = filtered.filter((s) => s.title.toLowerCase().includes(params.search!.toLowerCase()));

      const total = filtered.length;
      const sliced = filtered.slice(params.offset, params.offset + params.limit);

      return {
        data: sliced,
        meta: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages: Math.ceil(total / params.limit) || 1,
        },
      };
    }
  );
}

export async function getServiceById(id: string) {
  return safeDbExecute(
    async () => {
      const rows = await db
        .select({
          id: services.id,
          developerProfileId: services.developerProfileId,
          categoryId: services.categoryId,
          title: services.title,
          slug: services.slug,
          description: services.description,
          pricingType: services.pricingType,
          basePrice: services.basePrice,
          baseCurrency: services.baseCurrency,
          minimumPrice: services.minimumPrice,
          maximumPrice: services.maximumPrice,
          estimatedDeliveryDays: services.estimatedDeliveryDays,
          status: services.status,
          createdAt: services.createdAt,
          categoryName: serviceCategories.name,
          categorySlug: serviceCategories.slug,
          developerDisplayName: users.displayName,
          developerTier: developerProfiles.developerTier,
          developerAvatarUrl: users.avatarUrl,
          maxQueueCapacity: developerProfiles.activeProjectCapacity,
        })
        .from(services)
        .leftJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
        .leftJoin(developerProfiles, eq(services.developerProfileId, developerProfiles.id))
        .leftJoin(users, eq(developerProfiles.userId, users.id))
        .where(eq(services.id, id))
        .limit(1);

      if (rows.length === 0) throw new NotFoundError('SERVICE_NOT_FOUND', 'Jasa / Layanan tidak ditemukan.');
      const r = rows[0];
      return {
        ...r,
        developerAvatarUrl: r.developerAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        rating: 4.98,
        completedCount: 42,
        activeQueueCount: 2,
        maxQueueCapacity: r.maxQueueCapacity || 3,
        features: [
          'Modular Luau Framework',
          'Custom UI/UX & HUD',
          'Full Escrow Vault Protection',
          '30-Day Bug Warranty'
        ]
      };
    },
    async () => {
      const s = mockData.services.find((serv) => serv.id === id);
      if (!s) throw new NotFoundError('SERVICE_NOT_FOUND', 'Jasa / Layanan tidak ditemukan.');
      const cat = mockData.serviceCategories.find((c) => c.id === s.categoryId);
      const dev = mockData.developerProfiles.find((d) => d.id === s.developerProfileId);
      const u = dev ? mockData.users.find((usr) => usr.id === dev.userId) : null;
      return {
        id: s.id,
        developerProfileId: s.developerProfileId,
        categoryId: s.categoryId,
        title: s.title,
        slug: s.slug,
        description: s.description,
        pricingType: s.pricingType,
        basePrice: s.basePrice,
        baseCurrency: s.baseCurrency,
        minimumPrice: s.minimumPrice,
        maximumPrice: s.maximumPrice,
        estimatedDeliveryDays: s.estimatedDeliveryDays,
        status: s.status,
        createdAt: s.createdAt,
        categoryName: cat?.name || 'Lua / Luau Scripting',
        categorySlug: cat?.slug || 'lua-scripting',
        developerDisplayName: u?.displayName || 'AeroScript_Dev',
        developerTier: dev?.developerTier || 'VERIFIED',
        developerAvatarUrl: u?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        rating: 4.98,
        completedCount: 42,
        activeQueueCount: 2,
        maxQueueCapacity: dev?.activeProjectCapacity || 3,
        features: [
          'Modular Luau Framework',
          'Custom UI/UX & HUD',
          'Full Escrow Vault Protection',
          '30-Day Bug Warranty'
        ]
      };
    }
  );
}

export async function createService(
  developerProfileId: string,
  data: {
    title: string;
    description: string;
    categoryId?: string;
    pricingType?: 'FIXED' | 'STARTING_FROM' | 'CUSTOM_QUOTE';
    basePrice: number;
    baseCurrency: string;
    minimumPrice?: number;
    maximumPrice?: number;
    estimatedDeliveryDays: number;
  }
) {
  validateMonetaryInput(data.basePrice, data.baseCurrency);
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);

  return safeDbExecute(
    async () => {
      const [service] = await db
        .insert(services)
        .values({
          developerProfileId,
          categoryId: data.categoryId || null,
          title: data.title,
          slug,
          description: data.description,
          pricingType: data.pricingType || 'FIXED',
          basePrice: data.basePrice.toString(),
          baseCurrency: data.baseCurrency.toUpperCase(),
          minimumPrice: data.minimumPrice ? data.minimumPrice.toString() : null,
          maximumPrice: data.maximumPrice ? data.maximumPrice.toString() : null,
          estimatedDeliveryDays: data.estimatedDeliveryDays || 7,
          status: 'ACTIVE',
        })
        .returning();
      return service;
    },
    async () => {
      const newS = {
        id: `80000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
        developerProfileId,
        categoryId: data.categoryId || null,
        title: data.title,
        slug,
        description: data.description,
        pricingType: data.pricingType || 'FIXED',
        basePrice: data.basePrice.toString(),
        baseCurrency: data.baseCurrency.toUpperCase(),
        minimumPrice: data.minimumPrice ? data.minimumPrice.toString() : null,
        maximumPrice: data.maximumPrice ? data.maximumPrice.toString() : null,
        estimatedDeliveryDays: data.estimatedDeliveryDays || 7,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockData.services.push(newS);
      return newS;
    }
  );
}

export async function updateService(
  serviceId: string,
  developerProfileId: string,
  data: any,
  isAdmin = false
) {
  return safeDbExecute(
    async () => {
      const existing = await db.select().from(services).where(eq(services.id, serviceId)).limit(1);
      if (existing.length === 0) throw new NotFoundError('SERVICE_NOT_FOUND', 'Jasa / Layanan tidak ditemukan.');

      const s = existing[0];
      if (!isAdmin && s.developerProfileId !== developerProfileId) {
        throw new ForbiddenError('Anda tidak diizinkan mengubah layanan developer lain.');
      }

      return await db.transaction(async (tx) => {
        let priceHistoryToInsert: any = null;
        if (data.basePrice !== undefined) {
          const curr = data.baseCurrency || s.baseCurrency;
          validateMonetaryInput(data.basePrice, curr);
          if (parseFloat(s.basePrice) !== data.basePrice) {
            priceHistoryToInsert = {
              serviceId: s.id,
              oldPrice: s.basePrice,
              newPrice: data.basePrice.toString(),
              currency: curr.toUpperCase(),
            };
          }
        }

        const [updated] = await tx
          .update(services)
          .set({
            ...(data.title ? { title: data.title } : {}),
            ...(data.description ? { description: data.description } : {}),
            ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
            ...(data.pricingType ? { pricingType: data.pricingType } : {}),
            ...(data.basePrice !== undefined ? { basePrice: data.basePrice.toString() } : {}),
            ...(data.baseCurrency ? { baseCurrency: data.baseCurrency.toUpperCase() } : {}),
            ...(data.estimatedDeliveryDays !== undefined ? { estimatedDeliveryDays: data.estimatedDeliveryDays } : {}),
            ...(data.status ? { status: data.status } : {}),
            updatedAt: new Date(),
          })
          .where(eq(services.id, serviceId))
          .returning();

        if (priceHistoryToInsert) {
          await tx.insert(servicePriceHistory).values(priceHistoryToInsert);
        }
        return updated;
      });
    },
    async () => {
      const s = mockData.services.find((serv) => serv.id === serviceId);
      if (!s) throw new NotFoundError('SERVICE_NOT_FOUND', 'Jasa / Layanan tidak ditemukan.');
      if (!isAdmin && s.developerProfileId !== developerProfileId) {
        throw new ForbiddenError('Anda tidak diizinkan mengubah layanan developer lain.');
      }
      if (data.title) s.title = data.title;
      if (data.description) s.description = data.description;
      if (data.basePrice !== undefined) s.basePrice = data.basePrice.toString();
      if (data.baseCurrency) s.baseCurrency = data.baseCurrency.toUpperCase();
      if (data.status) s.status = data.status;
      return s;
    }
  );
}

export async function deleteService(serviceId: string, developerProfileId: string, isAdmin = false) {
  return safeDbExecute(
    async () => {
      const existing = await db.select().from(services).where(eq(services.id, serviceId)).limit(1);
      if (existing.length === 0) throw new NotFoundError('SERVICE_NOT_FOUND', 'Jasa / Layanan tidak ditemukan.');

      if (!isAdmin && existing[0].developerProfileId !== developerProfileId) {
        throw new ForbiddenError('Anda tidak memiliki hak akses untuk menghapus layanan ini.');
      }

      const [updated] = await db
        .update(services)
        .set({ status: 'INACTIVE', updatedAt: new Date() })
        .where(eq(services.id, serviceId))
        .returning();

      return updated;
    },
    async () => {
      const s = mockData.services.find((serv) => serv.id === serviceId);
      if (!s) throw new NotFoundError('SERVICE_NOT_FOUND', 'Jasa / Layanan tidak ditemukan.');
      if (!isAdmin && s.developerProfileId !== developerProfileId) {
        throw new ForbiddenError('Anda tidak memiliki hak akses untuk menghapus layanan ini.');
      }
      s.status = 'INACTIVE';
      return s;
    }
  );
}
