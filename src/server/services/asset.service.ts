import { db } from '../../db/index.js';
import {
  assets,
  assetFiles,
  assetDocumentationBlocks,
  assetSecurityScans,
  assetModerationReviews,
  assetDownloads,
  users
} from '../../db/schema/index.js';
import { eq, and, ilike, count, sql } from 'drizzle-orm';
import { NotFoundError, ForbiddenError, ValidationError } from '../errors/index.js';
import { validateDocBlocks } from '../validators/index.js';
import { safeDbExecute } from '../../db/mockDb.js';
import { mockData } from '../../db/mockStore.js';

export async function listPublicAssets(params: {
  page: number;
  limit: number;
  offset: number;
  search?: string;
  category?: string;
}) {
  return safeDbExecute(
    async () => {
      let conditions: any[] = [eq(assets.status, 'APPROVED')];
      if (params.search) conditions.push(ilike(assets.title, `%${params.search}%`));
      if (params.category) conditions.push(eq(assets.categoryId, params.category));

      const rows = await db
        .select({
          id: assets.id,
          uploadedByUserId: assets.uploadedByUserId,
          title: assets.title,
          slug: assets.slug,
          description: assets.description,
          categoryId: assets.categoryId,
          status: assets.status,
          downloadsCount: assets.downloadsCount,
          createdAt: assets.createdAt,
          uploaderDisplayName: users.displayName,
        })
        .from(assets)
        .leftJoin(users, eq(assets.uploadedByUserId, users.id))
        .where(and(...conditions))
        .limit(params.limit)
        .offset(params.offset);

      const [totalRow] = await db
        .select({ count: count() })
        .from(assets)
        .where(and(...conditions));

      const total = Number(totalRow?.count || 0);

      return {
        data: rows,
        meta: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages: Math.ceil(total / params.limit) || 1,
        },
      };
    },
    async () => {
      let filtered = mockData.assets.map((a) => {
        const u = mockData.users.find((usr) => usr.id === (a as any).uploadedByUserId || usr.id === (a as any).uploaderUserId);
        return {
          id: a.id,
          uploadedByUserId: (a as any).uploadedByUserId || (a as any).uploaderUserId,
          title: a.title,
          slug: a.slug,
          description: a.description,
          categoryId: (a as any).categoryId || null,
          status: a.status as any,
          downloadsCount: (a as any).downloadsCount || 0,
          createdAt: a.createdAt,
          uploaderDisplayName: u?.displayName || 'User',
        };
      });

      filtered = filtered.filter((a) => a.status === 'APPROVED');
      if (params.search) filtered = filtered.filter((a) => a.title.toLowerCase().includes(params.search!.toLowerCase()));
      if (params.category) filtered = filtered.filter((a) => a.categoryId === params.category);

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

export async function getAssetById(id: string) {
  return safeDbExecute(
    async () => {
      const assetRows = await db
        .select({
          id: assets.id,
          uploadedByUserId: assets.uploadedByUserId,
          title: assets.title,
          slug: assets.slug,
          description: assets.description,
          categoryId: assets.categoryId,
          status: assets.status,
          downloadsCount: assets.downloadsCount,
          createdAt: assets.createdAt,
          uploaderDisplayName: users.displayName,
        })
        .from(assets)
        .leftJoin(users, eq(assets.uploadedByUserId, users.id))
        .where(eq(assets.id, id))
        .limit(1);

      if (assetRows.length === 0) throw new NotFoundError('ASSET_NOT_FOUND', 'Share Asset tidak ditemukan.');

      const asset = assetRows[0];
      const docBlocks = await db
        .select()
        .from(assetDocumentationBlocks)
        .where(eq(assetDocumentationBlocks.assetId, asset.id))
        .orderBy(assetDocumentationBlocks.positionOrder);

      return { ...asset, documentationBlocks: docBlocks };
    },
    async () => {
      const a = mockData.assets.find((ast) => ast.id === id);
      if (!a) throw new NotFoundError('ASSET_NOT_FOUND', 'Share Asset tidak ditemukan.');

      const u = mockData.users.find((usr) => usr.id === (a as any).uploadedByUserId || usr.id === (a as any).uploaderUserId);
      const docBlocks = mockData.assetDocumentationBlocks
        .filter((d) => d.assetId === a.id)
        .sort((x, y) => x.positionOrder - y.positionOrder);

      return {
        id: a.id,
        uploadedByUserId: (a as any).uploadedByUserId || (a as any).uploaderUserId,
        title: a.title,
        slug: a.slug,
        description: a.description,
        categoryId: (a as any).categoryId || null,
        status: a.status,
        downloadsCount: (a as any).downloadsCount || 0,
        createdAt: a.createdAt,
        uploaderDisplayName: u?.displayName || 'User',
        documentationBlocks: docBlocks,
      };
    }
  );
}

export async function createShareAsset(
  uploaderUserId: string,
  data: {
    title: string;
    description: string;
    category?: string;
    fileName: string;
    fileSizeBytes: number;
    mimeType: string;
    docBlocks: Array<{ title: string; content: string; positionOrder: number }>;
  }
) {
  validateDocBlocks(data.docBlocks);

  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);
  const fileStorageKey = `assets/${uploaderUserId}/${Date.now()}_${data.fileName}`;

  return safeDbExecute(
    async () => {
      return await db.transaction(async (tx) => {
        const [asset] = await tx
          .insert(assets)
          .values({
            uploadedByUserId: uploaderUserId,
            title: data.title,
            slug,
            description: data.description,
            categoryId: data.category || null,
            status: 'DRAFT',
          })
          .returning();

        const [file] = await tx
          .insert(assetFiles)
          .values({
            assetId: asset.id,
            fileName: data.fileName,
            fileSizeBytes: data.fileSizeBytes,
            mimeType: data.mimeType,
            storageKey: fileStorageKey,
          })
          .returning();

        for (const block of data.docBlocks) {
          await tx.insert(assetDocumentationBlocks).values({
            assetId: asset.id,
            title: block.title,
            content: block.content,
            positionOrder: block.positionOrder,
          });
        }

        return { asset, file };
      });
    },
    async () => {
      const asset: any = {
        id: `ast_${Date.now()}`,
        uploadedByUserId: uploaderUserId,
        categoryId: data.category || null,
        title: data.title,
        slug,
        description: data.description,
        version: '1.0.0',
        license: 'MIT',
        visibility: 'PUBLIC' as const,
        status: 'DRAFT' as const,
        downloadsCount: 0,
        ratingAverage: '0.00',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockData.assets.push(asset);

      const file: any = {
        id: `file_${Date.now()}`,
        assetId: asset.id,
        fileName: data.fileName,
        fileSizeBytes: data.fileSizeBytes,
        mimeType: data.mimeType,
        storageKey: fileStorageKey,
        checksumSha256: 'mock-sha256',
        version: '1.0.0',
        uploadedAt: new Date(),
      };
      mockData.assetFiles.push(file);

      for (const block of data.docBlocks) {
        mockData.assetDocumentationBlocks.push({
          id: `doc_${Date.now()}_${block.positionOrder}`,
          assetId: asset.id,
          title: block.title,
          content: block.content,
          positionOrder: block.positionOrder,
        });
      }

      return { asset, file };
    }
  );
}

export async function submitAssetForReview(assetId: string, uploaderUserId: string) {
  return safeDbExecute(
    async () => {
      const assetRows = await db.select().from(assets).where(eq(assets.id, assetId)).limit(1);
      if (assetRows.length === 0) throw new NotFoundError('ASSET_NOT_FOUND', 'Share Asset tidak ditemukan.');

      const asset = assetRows[0];
      if (asset.uploadedByUserId !== uploaderUserId) {
        throw new ForbiddenError('Anda tidak diizinkan mengajukan aset milik orang lain.');
      }

      const docBlocks = await db.select().from(assetDocumentationBlocks).where(eq(assetDocumentationBlocks.assetId, asset.id));
      validateDocBlocks(docBlocks);

      const [updated] = await db
        .update(assets)
        .set({ status: 'PENDING_MODERATION', updatedAt: new Date() })
        .where(eq(assets.id, asset.id))
        .returning();

      return updated;
    },
    async () => {
      const asset = mockData.assets.find((a) => a.id === assetId);
      if (!asset) throw new NotFoundError('ASSET_NOT_FOUND', 'Share Asset tidak ditemukan.');

      if ((asset as any).uploadedByUserId !== uploaderUserId && (asset as any).uploaderUserId !== uploaderUserId) {
        throw new ForbiddenError('Anda tidak diizinkan mengajukan aset milik orang lain.');
      }

      const docBlocks = mockData.assetDocumentationBlocks.filter((d) => d.assetId === asset.id);
      validateDocBlocks(docBlocks);

      asset.status = 'PENDING_MODERATION' as any;
      asset.updatedAt = new Date();

      return asset;
    }
  );
}

export async function moderateAssetByAdmin(assetId: string, adminUserId: string, action: 'APPROVE' | 'REJECT', notes?: string) {
  return safeDbExecute(
    async () => {
      return await db.transaction(async (tx) => {
        const assetRows = await tx.select().from(assets).where(eq(assets.id, assetId)).limit(1);
        if (assetRows.length === 0) throw new NotFoundError('ASSET_NOT_FOUND', 'Share Asset tidak ditemukan.');

        const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
        const [updated] = await tx
          .update(assets)
          .set({ status: newStatus, updatedAt: new Date() })
          .where(eq(assets.id, assetId))
          .returning();

        await tx.insert(assetModerationReviews).values({
          assetId,
          reviewedByUserId: adminUserId,
          decision: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          notes: notes || null,
        });

        return updated;
      });
    },
    async () => {
      const asset = mockData.assets.find((a) => a.id === assetId);
      if (!asset) throw new NotFoundError('ASSET_NOT_FOUND', 'Share Asset tidak ditemukan.');

      asset.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      asset.updatedAt = new Date();

      mockData.assetModerationReviews.push({
        id: `mod_${Date.now()}`,
        assetId,
        reviewerUserId: adminUserId,
        decision: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
        notes: notes || null,
        createdAt: new Date(),
      });

      return asset;
    }
  );
}

export async function downloadAsset(assetId: string, userId?: string) {
  return safeDbExecute(
    async () => {
      const assetRows = await db.select().from(assets).where(eq(assets.id, assetId)).limit(1);
      if (assetRows.length === 0) throw new NotFoundError('ASSET_NOT_FOUND', 'Share Asset tidak ditemukan.');

      const files = await db.select().from(assetFiles).where(eq(assetFiles.assetId, assetId)).limit(1);
      if (files.length === 0) throw new NotFoundError('ASSET_NOT_FOUND', 'File aset tidak ditemukan.');

      await db
        .update(assets)
        .set({ downloadsCount: sql`${assets.downloadsCount} + 1` })
        .where(eq(assets.id, assetId));

      await db.insert(assetDownloads).values({
        assetId,
        userId: userId || null,
      });

      return {
        downloadUrl: `/api/v1/assets/files/${files[0].storageKey}`,
        fileName: files[0].fileName,
        fileSizeBytes: files[0].fileSizeBytes,
      };
    },
    async () => {
      const asset = mockData.assets.find((a) => a.id === assetId);
      if (!asset) throw new NotFoundError('ASSET_NOT_FOUND', 'Share Asset tidak ditemukan.');

      const file = mockData.assetFiles.find((f) => f.assetId === assetId);
      if (!file) throw new NotFoundError('ASSET_NOT_FOUND', 'File aset tidak ditemukan.');

      asset.downloadCount = (asset.downloadCount || 0) + 1;

      mockData.assetDownloads.push({
        id: `dl_${Date.now()}`,
        assetId,
        downloaderUserId: userId || null,
        downloadedAt: new Date(),
      });

      return {
        downloadUrl: `/api/v1/assets/files/${file.fileStorageKey}`,
        fileName: file.fileName,
        fileSizeBytes: file.fileSizeBytes,
      };
    }
  );
}
