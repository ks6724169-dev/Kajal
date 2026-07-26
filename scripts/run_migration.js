import fs from 'fs';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const { Client } = pg;

async function run() {
  console.log('--- Step 1: Connecting to PostgreSQL database ---');
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('✅ Connected to database successfully.');

  console.log('--- Step 2: Executing Migration 031 & 032 ---');
  const migrationSql31 = fs.readFileSync('supabase/migrations/031_compliance_documents_enhancements.sql', 'utf8');
  await client.query(migrationSql31);
  console.log('✅ Migration 031 executed successfully.');

  const migrationSql32 = fs.readFileSync('supabase/migrations/032_compliance_documents_private_security.sql', 'utf8');
  await client.query(migrationSql32);
  console.log('✅ Migration 032 executed successfully.');

  console.log('--- Step 3: Verifying table institution_documents ---');
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'institution_documents'
    ORDER BY ordinal_position;
  `);
  console.log('Columns in institution_documents:');
  res.rows.forEach(r => console.log(` - ${r.column_name} (${r.data_type})`));

  await client.end();

  console.log('--- Step 4: Connecting to Supabase Admin Client ---');
  let rawUrl = process.env.VITE_SUPABASE_URL || '';
  let markdownMatch = rawUrl.match(/\]\((https?:\/\/[^)]+)\)/);
  let supabaseUrl = markdownMatch ? markdownMatch[1] : rawUrl.replace(/^[\["']+|[\]"']+$|\s+/g, '');
  let serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/^[\["']+|[\]"']+$|\s+/g, '');

  if (!supabaseUrl || !serviceKey) {
    throw new Error('VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing');
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });

  console.log('--- Step 5: Checking Supabase Storage Bucket "institution-documents" ---');
  const { data: buckets, error: bucketError } = await supabaseAdmin.storage.listBuckets();
  if (bucketError) {
    console.error('Error listing buckets:', bucketError.message);
  } else {
    const instBucket = buckets.find(b => b.name === 'institution-documents');
    if (instBucket) {
      console.log(`✅ Bucket "institution-documents" found. Public status: ${instBucket.public}`);
    } else {
      console.log('Creating private bucket "institution-documents"...');
      const { data: newBucket, error: createError } = await supabaseAdmin.storage.createBucket('institution-documents', {
        public: false,
        fileSizeLimit: 26214400,
        allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg']
      });
      if (createError) {
        console.error('Failed to create bucket:', createError.message);
      } else {
        console.log('✅ Private bucket "institution-documents" created successfully.');
      }
    }
  }

  console.log('--- Step 6: Testing Storage Upload, Signed URL Generation & DB Metadata Persistence ---');
  const testFileName = `test_upload_${Date.now()}.pdf`;
  const testBuffer = Buffer.from('%PDF-1.4 %âãÏÓ 1 0 obj <<>> endobj trailer << /Root 1 0 R >> %%EOF');
  
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from('institution-documents')
    .upload(`test/${testFileName}`, testBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (uploadError) {
    console.error('❌ Upload test failed:', uploadError.message);
  } else {
    console.log('✅ Upload test succeeded. Path:', uploadData.path);
    
    // Test Signed URL Generation
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from('institution-documents')
      .createSignedUrl(`test/${testFileName}`, 3600);

    if (signedUrlError) {
      console.error('❌ Signed URL generation failed:', signedUrlError.message);
    } else {
      console.log('✅ Signed URL successfully generated:', signedUrlData.signedUrl.substring(0, 80) + '...');
    }

    // Test insertion into DB
    const testDocId = '00000000-0000-4000-a000-000000000001';
    const testTenantId = '00000000-0000-4000-a000-000000000002';
    const { error: dbInsertError } = await supabaseAdmin
      .from('institution_documents')
      .insert([{
        id: testDocId,
        tenant_id: testTenantId,
        organization_id: testTenantId,
        campus_id: 'All Campuses',
        name: 'Verification Test Document',
        document_type: 'COMPLIANCE',
        category: 'Testing',
        file_url: signedUrlData ? signedUrlData.signedUrl : 'test_path',
        file_name: testFileName,
        file_type: 'application/pdf',
        file_size: '52 B',
        issue_date: new Date().toISOString(),
        expiry_date: '2030-12-31T00:00:00.000Z',
        issuer: 'Galaxy Automated Verifier',
        status: 'ACTIVE'
      }]);

    if (dbInsertError) {
      console.error('❌ DB insert test failed:', dbInsertError.message);
    } else {
      console.log('✅ DB metadata insert test succeeded.');
      
      // Clean up test DB row
      await supabaseAdmin
        .from('institution_documents')
        .delete()
        .eq('file_name', testFileName);
      console.log('✅ Test DB row cleaned up.');
    }

    // Clean up test file
    await supabaseAdmin.storage
      .from('institution-documents')
      .remove([`test/${testFileName}`]);
    console.log('✅ Test storage file cleaned up.');
  }

  console.log('--- Migration & Storage Verification Complete ---');
}

run().catch(err => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
