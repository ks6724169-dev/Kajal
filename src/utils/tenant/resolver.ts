import { TenantResolver } from '../../core/tenant/TenantResolver';
import { OrganizationRepository } from '../../core/database/repositories/OrganizationRepository';
import { SchoolRepository } from '../../core/database/repositories/SchoolRepository';
import { supabase } from '../../services/supabase';

export const createTenantResolver = () => {
  const orgRepo = new OrganizationRepository(supabase);
  const schoolRepo = new SchoolRepository(supabase);
  return new TenantResolver(orgRepo, schoolRepo);
};

export const resolveTenantFromUrl = async (url: string) => {
  const resolver = createTenantResolver();
  try {
    const hostname = new URL(url).hostname;
    return await resolver.resolveFromHostname(hostname);
  } catch (error) {
    // Fallback if URL is invalid or in SSR without window
    return await resolver.resolveFromHostname(url);
  }
};
