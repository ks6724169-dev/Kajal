import { describe, it, expect, vi } from 'vitest';
import { uniqueIdEngine } from '../shared/generators/UniqueIdEngine.js';
import { addressEngine } from '../shared/address/AddressEngine.js';

describe('UniqueIdEngine', () => {
  it('should generate collision-free unique IDs with correct prefixes', () => {
    const studentId = uniqueIdEngine.generateStudentId('TENANT1');
    expect(studentId).toMatch(/^STU-TENA-\d{8}-[A-F0-9]{4}$/);
  });
});

describe('AddressEngine', () => {
  it('should validate Indian postal codes correctly', () => {
    expect(addressEngine.validatePostalCode('400001', 'IN')).toBe(true);
    expect(addressEngine.validatePostalCode('123', 'IN')).toBe(false);
  });
});
