import { z } from 'zod';

export const BackupJobSchema = z.object({
  job_name: z.string().min(3),
  backup_type: z.enum(['FULL', 'INCREMENTAL', 'DIFFERENTIAL']),
  storage_id: z.string().uuid()
});

export const RestoreRequestSchema = z.object({
  backup_id: z.string().uuid().optional(),
  snapshot_id: z.string().uuid().optional(),
  target_location: z.string().min(1)
});

export const ArchiveJobSchema = z.object({
  policy_id: z.string().uuid()
});

export const ReplicationJobSchema = z.object({
  source_storage_id: z.string().uuid(),
  target_storage_id: z.string().uuid()
});

export const DisasterRecoveryPlanSchema = z.object({
  name: z.string().min(3),
  rpo_minutes: z.number().min(1),
  rto_minutes: z.number().min(1)
});
