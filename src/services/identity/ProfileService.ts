import { ProfileRepository } from '../../core/database/repositories/ProfileRepository';
import { BaseProfile, TeacherProfile, StudentProfile } from '../../types/identity';

export class ProfileService {
  constructor(
    private readonly teacherProfileRepo: ProfileRepository<TeacherProfile>,
    private readonly studentProfileRepo: ProfileRepository<StudentProfile>
  ) {}

  async updateProfilePicture(userId: string, type: 'teacher' | 'student', avatarUrl: string): Promise<boolean> {
    const repo = type === 'teacher' ? this.teacherProfileRepo : this.studentProfileRepo;
    const profile = await repo.findByUserId(userId);
    if (!profile) return false;
    
    const updated = await repo.update(profile.id, { avatar_url: avatarUrl } as Partial<any>);
    return !!updated;
  }

  async updateDigitalSignature(userId: string, type: 'teacher' | 'student', signatureUrl: string): Promise<boolean> {
    const repo = type === 'teacher' ? this.teacherProfileRepo : this.studentProfileRepo;
    const profile = await repo.findByUserId(userId);
    if (!profile) return false;

    const updated = await repo.update(profile.id, { digital_signature_url: signatureUrl } as Partial<any>);
    return !!updated;
  }

  async markProfileComplete(userId: string, type: 'teacher' | 'student'): Promise<boolean> {
    const repo = type === 'teacher' ? this.teacherProfileRepo : this.studentProfileRepo;
    const profile = await repo.findByUserId(userId);
    if (!profile) return false;

    const updated = await repo.update(profile.id, { profile_completed: true } as Partial<any>);
    return !!updated;
  }
}
