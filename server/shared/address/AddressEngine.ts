export interface Address {
  addressLine1: string;
  addressLine2?: string;
  cityId: string;
  stateId: string;
  countryId: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  isVerified?: boolean;
}

export class AddressEngine {
  public validatePostalCode(postalCode: string, countryCode: string): boolean {
    // Advanced regex based on country code
    if (countryCode === 'IN') {
      return /^[1-9][0-9]{5}$/.test(postalCode);
    }
    // US
    if (countryCode === 'US') {
      return /^\d{5}(-\d{4})?$/.test(postalCode);
    }
    return postalCode.length > 0;
  }

  public async geocode(address: Address): Promise<{ lat: number; lng: number } | null> {
    // Future Google Maps integration point
    // Uses server-side API call securely
    return null;
  }
}

export const addressEngine = new AddressEngine();
