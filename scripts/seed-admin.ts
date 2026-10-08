/**
 * SuperBooks: Admin Account Bootstrap Script
 * Usage: npx tsx scripts/seed-admin.ts <email> <password> [display_name]
 */

import { createClient } from '@supabase/supabase-js';

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
    process.exit(1);
  }

  const email = process.argv[2] || 'admin@superbooks.studio';
  const password = process.argv[3] || 'SuperBooksAdmin2026!';
  const displayName = process.argv[4] || 'SuperBooks Curator';

  console.log(`[SuperBooks] Bootstrapping admin account: ${email}...`);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Create or retrieve auth user
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: displayName },
  });

  let userId: string;

  if (userError) {
    if (userError.message.includes('already exists') || userError.message.includes('registered')) {
      console.log(`[SuperBooks] User already exists in auth. Finding user ID...`);
      const { data: listData } = await supabase.auth.admin.listUsers();
      const existing = listData?.users.find((u) => u.email === email);
      if (!existing) {
        throw new Error('Could not locate existing user id.');
      }
      userId = existing.id;
    } else {
      throw userError;
    }
  } else {
    userId = userData.user.id;
    console.log(`[SuperBooks] Created auth user: ${userId}`);
  }

  // 2. Upsert profile with 'admin' role
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    display_name: displayName,
    role: 'admin',
    bio: 'Chief Curator at SuperBooks Studio',
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    throw profileError;
  }

  console.log(`[SuperBooks] Successfully elevated user ${email} (${userId}) to role='admin'!`);
  console.log(`[SuperBooks] Admin console accessible at /admin with these credentials.`);
}

main().catch((err) => {
  console.error('[SuperBooks] Admin creation failed:', err);
  process.exit(1);
});
