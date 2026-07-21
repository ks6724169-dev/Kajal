import { SchoolRegistrationRepository } from '../repositories/SchoolRegistrationRepository.js';
import { SchoolRegistration } from '../entities/SchoolRegistration.js';
import { v4 as uuidv4 } from 'uuid';

export class SchoolRegistrationService {
  private repository: SchoolRegistrationRepository;

  constructor() {
    // Note: Passing 'SYSTEM' as tenantId for initial registration
    this.repository = new SchoolRegistrationRepository('SYSTEM');
  }

  public async startRegistration(data: any): Promise<SchoolRegistration> {
    // Check uniqueness/resume
    const schoolName = data.schoolName || data.school_name || '';
    const existing = await this.repository.findByName(schoolName);

    if (existing) {
      if (existing.status === 'DRAFT') {
        // Resume: Update the draft with latest data from the "start" call
        return await this.repository.updateByRegistrationId(existing.registration_id, {
          ...data,
          updated_at: new Date()
        }) as SchoolRegistration;
      }
      throw new Error('An institution with this name is already registered.');
    }

    const registration = await this.repository.insert({
      ...data,
      registration_id: uuidv4(),
      current_step: 1,
      progress: 20,
      status: 'DRAFT',
    });

    return registration;
  }

  public async updateDraft(registrationId: string, data: Partial<SchoolRegistration>): Promise<SchoolRegistration> {
    const registration = await this.repository.updateByRegistrationId(registrationId, data);
    if (!registration) {
      throw new Error('Registration draft not found.');
    }
    return registration;
  }

  public async getRegistration(registrationId: string): Promise<SchoolRegistration> {
    const registration = await this.repository.findByRegistrationId(registrationId);
    if (!registration) {
      throw new Error('Registration draft not found.');
    }
    return registration;
  }

  public async completeRegistration(registrationId: string, formData: any, password: string): Promise<any> {
    const draft = await this.repository.findByRegistrationId(registrationId);
    if (!draft) {
      throw new Error('Registration draft not found.');
    }

    // Phase 01: For now, we just mark as COMPLETED
    // In future phases, this will trigger Tenant creation, Admin user creation, etc.
    const updated = await this.repository.updateByRegistrationId(registrationId, {
      ...formData,
      status: 'COMPLETED',
      progress: 100,
      current_step: 5
    });

    return {
      success: true,
      message: 'Registration completed successfully. Your institution is being provisioned.',
      registration: updated
    };
  }
}
