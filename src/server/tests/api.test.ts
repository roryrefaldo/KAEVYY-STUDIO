import http from 'http';
import { app } from '../app.js';
import { db } from '../../db/index.js';

async function request(method: string, path: string, body?: any, headers: Record<string, string> = {}) {
  return new Promise<{ status: number; body: any }>((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', async () => {
      const addr = server.address() as any;
      const port = addr.port;

      const postData = body ? JSON.stringify(body) : '';
      const reqOpts = {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
          ...headers,
        },
      };

      const req = http.request(reqOpts, (res: any) => {
        let rawData = '';
        res.on('data', (chunk: any) => (rawData += chunk));
        res.on('end', () => {
          server.close();
          try {
            const parsed = JSON.parse(rawData);
            resolve({ status: res.statusCode, body: parsed });
          } catch {
            resolve({ status: res.statusCode, body: rawData });
          }
        });
      });

      req.on('error', (err: any) => {
        server.close();
        reject(err);
      });

      if (postData) {
        req.write(postData);
      }
      req.end();
    });
  });
}

async function runTests() {
  console.log('🚀 Starting KAEVY STUDIO API Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`✅ PASSED: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ FAILED: ${name}`);
      console.error(err);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /api/v1/health should return ok', async () => {
    const res = await request('GET', '/api/v1/health');
    if (res.status !== 200 || res.body.status !== 'ok') {
      throw new Error(`Unexpected health response: ${JSON.stringify(res.body)}`);
    }
  });

  // Seeded admin user ID: 50000000-0000-0000-0000-000000000001
  const adminHeaders = { Authorization: 'Bearer kaevy_token_50000000-0000-0000-0000-000000000001' };
  // Seeded client user ID: 50000000-0000-0000-0000-000000000002
  const clientHeaders = { Authorization: 'Bearer kaevy_token_50000000-0000-0000-0000-000000000002' };
  // Seeded dev verified user ID: 50000000-0000-0000-0000-000000000003
  const devHeaders = { Authorization: 'Bearer kaevy_token_50000000-0000-0000-0000-000000000003' };

  // 2. Auth & User Me
  await test('GET /api/v1/auth/me for authenticated client', async () => {
    const res = await request('GET', '/api/v1/auth/me', undefined, clientHeaders);
    if (res.status !== 200 || !res.body.data || !res.body.data.clientProfileId) {
      throw new Error(`Auth me failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 3. Register client
  const randomEmail = `test.client.${Date.now()}@kaevy.studio`;
  let newClientToken = '';
  await test('POST /api/v1/auth/register/client should create client profile', async () => {
    const res = await request('POST', '/api/v1/auth/register/client', {
      email: randomEmail,
      displayName: 'Test Client User',
      companyName: 'Test Corp',
    });
    if (res.status !== 201 || !res.body.data.token) {
      throw new Error(`Client registration failed: ${JSON.stringify(res.body)}`);
    }
    newClientToken = res.body.data.token;
  });

  // 4. Currencies & Exchange rates
  await test('GET /api/v1/currencies should list IDR and USD', async () => {
    const res = await request('GET', '/api/v1/currencies');
    if (res.status !== 200 || !Array.isArray(res.body.data) || res.body.data.length < 2) {
      throw new Error(`Currencies failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 5. Developers listing & capacity
  await test('GET /api/v1/developers/me/capacity for dev verified', async () => {
    const res = await request('GET', '/api/v1/developers/me/capacity', undefined, devHeaders);
    if (res.status !== 200 || res.body.data.maxCapacity !== 3) {
      throw new Error(`Capacity check failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 6. Services list
  let testServiceId = '';
  await test('GET /api/v1/services should return services list', async () => {
    const res = await request('GET', '/api/v1/services');
    if (res.status !== 200 || !Array.isArray(res.body.data) || res.body.data.length === 0) {
      throw new Error(`List services failed: ${JSON.stringify(res.body)}`);
    }
    testServiceId = res.body.data[0].id;
  });

  // 7. Order Creation
  let createdOrderNumber = '';
  let createdProjectId = '';
  await test('POST /api/v1/orders should create new order', async () => {
    const res = await request(
      'POST',
      '/api/v1/orders',
      {
        serviceId: testServiceId,
        customScopeDescription: 'Kustomisasi game script Roblox Lua',
      },
      clientHeaders
    );
    if (res.status !== 201 || !res.body.data.order.orderNumber) {
      throw new Error(`Order creation failed: ${JSON.stringify(res.body)}`);
    }
    createdOrderNumber = res.body.data.order.orderNumber;
    createdProjectId = res.body.data.project.id;
  });

  // 8. Get Order Details
  await test('GET /api/v1/orders/:orderNumber should return order snapshot details', async () => {
    const res = await request('GET', `/api/v1/orders/${createdOrderNumber}`, undefined, clientHeaders);
    if (res.status !== 200 || res.body.data.orderNumber !== createdOrderNumber) {
      throw new Error(`Get order detail failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 9. Payment Creation
  let createdPaymentId = '';
  await test('POST /api/v1/orders/:orderNumber/payments should create payment record', async () => {
    const res = await request(
      'POST',
      `/api/v1/orders/${createdOrderNumber}/payments`,
      { paymentMethodCategory: 'QRIS' },
      clientHeaders
    );
    if (res.status !== 201 || !res.body.data.payment.id) {
      throw new Error(`Payment creation failed: ${JSON.stringify(res.body)}`);
    }
    createdPaymentId = res.body.data.payment.id;
  });

  // 10. Mark Payment Paid & Verify Escrow HELD
  await test('PATCH /api/v1/payments/:id/mark-paid should lock funds in escrow', async () => {
    const res = await request('PATCH', `/api/v1/payments/${createdPaymentId}/mark-paid`, {}, clientHeaders);
    if (res.status !== 200 || res.body.data.status !== 'PAID') {
      throw new Error(`Mark paid failed: ${JSON.stringify(res.body)}`);
    }

    // Verify escrow HELD
    const escrowRes = await request('GET', `/api/v1/orders/${createdOrderNumber}/escrow`, undefined, clientHeaders);
    if (escrowRes.status !== 200 || escrowRes.body.data.status !== 'HELD') {
      throw new Error(`Escrow state not HELD: ${JSON.stringify(escrowRes.body)}`);
    }
  });

  // 11. Milestone Submission & Approval
  await test('Milestone 25% submit by developer & approve by client', async () => {
    // Submit 25% by developer
    const subRes = await request(
      'POST',
      `/api/v1/projects/${createdProjectId}/milestones/25/submit`,
      { notes: 'Selesai setup arsitektur' },
      devHeaders
    );
    if (subRes.status !== 200 || subRes.body.data.status !== 'SUBMITTED') {
      throw new Error(`Milestone submission failed: ${JSON.stringify(subRes.body)}`);
    }

    // Approve 25% by client
    const appRes = await request(
      'POST',
      `/api/v1/projects/${createdProjectId}/milestones/25/approve`,
      {},
      clientHeaders
    );
    if (appRes.status !== 200 || appRes.body.data.status !== 'APPROVED') {
      throw new Error(`Milestone approval failed: ${JSON.stringify(appRes.body)}`);
    }
  });

  // 12. Share Asset Creation
  await test('POST /api/v1/assets should create Share Asset with doc blocks validation', async () => {
    const res = await request(
      'POST',
      '/api/v1/assets',
      {
        title: 'Roblox DataStore V2 Module',
        description: 'Module penyimpanan data anti rollback untuk Luau',
        fileName: 'datastore_v2.lua',
        fileSizeBytes: 10240,
        mimeType: 'text/x-lua',
        docBlocks: [
          { title: 'Instalasi', content: 'Simpan file di ReplicatedStorage', positionOrder: 1 },
          { title: 'Penggunaan', content: 'local DataStore = require(ReplicatedStorage.DataStore)', positionOrder: 2 },
        ],
      },
      devHeaders
    );
    if (res.status !== 201 || !res.body.data.asset.id) {
      throw new Error(`Share asset creation failed: ${JSON.stringify(res.body)}`);
    }
  });

  // 13. Admin Dashboard & Audit Logs
  await test('GET /api/v1/admin/dashboard should return system metrics', async () => {
    const res = await request('GET', '/api/v1/admin/dashboard', undefined, adminHeaders);
    if (res.status !== 200 || typeof res.body.data.totalUsers !== 'number') {
      throw new Error(`Admin dashboard failed: ${JSON.stringify(res.body)}`);
    }
  });

  console.log(`\n🎉 Test Suite Completed: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
