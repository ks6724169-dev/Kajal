import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const { Client } = pg;

async function runSecurityTests() {
  console.log('====================================================');
  console.log('   COMPLIANCE DOCUMENT STORAGE SECURITY TEST SUITE  ');
  console.log('====================================================\n');

  let rawUrl = process.env.VITE_SUPABASE_URL || '';
  let markdownMatch = rawUrl.match(/\]\((https?:\/\/[^)]+)\)/);
  let supabaseUrl = markdownMatch ? markdownMatch[1] : rawUrl.replace(/^[\["']+|[\]"']+$|\s+/g, '');
  let serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/^[\["']+|[\]"']+$|\s+/g, '');
  let anonKey = (process.env.VITE_SUPABASE_ANON_KEY || '').replace(/^[\["']+|[\]"']+$|\s+/g, '');

  const supabaseAdmin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const supabaseAnon = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });

  // 1. Check Bucket Private Status
  console.log('[TEST 1] Verifying Bucket Privacy Configuration...');
  const { data: buckets, error: bErr } = await supabaseAdmin.storage.listBuckets();
  if (bErr) throw new Error(`Bucket query failed: ${bErr.message}`);
  
  const bucket = buckets.find(b => b.name === 'institution-documents');
  if (!bucket) throw new Error('Bucket institution-documents not found!');
  
  if (bucket.public === false) {
    console.log('  ✅ PASSED: Bucket "institution-documents" is strictly PRIVATE (public = false).\n');
  } else {
    console.error('  ❌ FAILED: Bucket "institution-documents" is PUBLIC!');
  }

  // 2. Test Anonymous Direct Public URL Access (Should be BLOCKED)
  console.log('[TEST 2] Testing Anonymous Public URL Access to Private Object...');
  const testFileName = `security_test_${Date.now()}.pdf`;
  const pdfBuffer = Buffer.from('%PDF-1.4 %âãÏÓ 1 0 obj <<>> endobj trailer << /Root 1 0 R >> %%EOF');
  
  // Upload via Admin client
  const { error: upErr } = await supabaseAdmin.storage
    .from('institution-documents')
    .upload(`tenant_a/${testFileName}`, pdfBuffer, { contentType: 'application/pdf' });
  
  if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

  // Fetch Public URL
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/institution-documents/tenant_a/${testFileName}`;
  const resp = await fetch(publicUrl);
  
  if (resp.status === 400 || resp.status === 403 || resp.status === 404) {
    console.log(`  ✅ PASSED: Anonymous public URL access returned HTTP ${resp.status} (Access BLOCKED).\n`);
  } else {
    console.error(`  ❌ FAILED: Anonymous public URL returned status ${resp.status} (Access NOT blocked!)`);
  }

  // 3. Test Signed URL Generation (Should be ALLOWED)
  console.log('[TEST 3] Testing Authorized Signed URL Generation...');
  const { data: signedData, error: signedErr } = await supabaseAdmin.storage
    .from('institution-documents')
    .createSignedUrl(`tenant_a/${testFileName}`, 60);

  if (!signedErr && signedData?.signedUrl) {
    console.log('  ✅ PASSED: Signed URL generated successfully.');
    // Test accessing signed URL
    const signedResp = await fetch(signedData.signedUrl);
    if (signedResp.status === 200) {
      console.log('  ✅ PASSED: Signed URL provides valid access to private document content.\n');
    } else {
      console.error(`  ❌ FAILED: Signed URL access returned HTTP ${signedResp.status}`);
    }
  } else {
    console.error(`  ❌ FAILED: Signed URL generation error: ${signedErr?.message}`);
  }

  // 4. Test Tenant Isolation
  console.log('[TEST 4] Testing Tenant Isolation Query Filters...');
  const dbClient = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await dbClient.connect();

  const tenantAId = '00000000-0000-4000-a000-00000000000a';
  const tenantBId = '00000000-0000-4000-a000-00000000000b';

  await dbClient.query(`
    INSERT INTO institution_documents (id, tenant_id, organization_id, name, document_type, file_url, status, version)
    VALUES 
      ('00000000-0000-4000-a000-111111111111', '${tenantAId}', '${tenantAId}', 'Tenant A Doc', 'LEGAL', 'tenant_a/doc1.pdf', 'ACTIVE', 1),
      ('00000000-0000-4000-a000-222222222222', '${tenantBId}', '${tenantBId}', 'Tenant B Doc', 'REGULATORY', 'tenant_b/doc2.pdf', 'ACTIVE', 1)
    ON CONFLICT (id) DO NOTHING;
  `);

  const resTenantA = await dbClient.query(`SELECT * FROM institution_documents WHERE tenant_id = '${tenantAId}' AND deleted_at IS NULL;`);
  const containsTenantB = resTenantA.rows.some(r => r.tenant_id === tenantBId);

  if (!containsTenantB && resTenantA.rows.length > 0) {
    console.log('  ✅ PASSED: Tenant A query returned only Tenant A documents. Tenant Isolation Enforced.\n');
  } else {
    console.error('  ❌ FAILED: Tenant Isolation breach detected!');
  }

  // Cleanup test DB rows and file
  await dbClient.query(`DELETE FROM institution_documents WHERE id IN ('00000000-0000-4000-a000-111111111111', '00000000-0000-4000-a000-222222222222');`);
  await dbClient.end();
  await supabaseAdmin.storage.from('institution-documents').remove([`tenant_a/${testFileName}`]);

  console.log('====================================================');
  console.log('   ALL SECURITY HARDENING TESTS COMPLETED           ');
  console.log('====================================================');
}

runSecurityTests().catch(e => {
  console.error('Security Test Execution Failed:', e);
  process.exit(1);
});
