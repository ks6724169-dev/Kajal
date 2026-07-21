import { describe, it, expect, vi } from 'vitest';
import { DataPlatformService } from '../services/DataPlatformService.js';
import { DataPipelineRepository } from '../repositories/DataPlatformRepository.js';

vi.mock('../repositories/DataPlatformRepository.js');

describe('DataPlatformService', () => {
  it('should create pipeline successfully', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ id: 'pipe-1', name: 'Test Pipeline' });
    vi.mocked(DataPipelineRepository).mockImplementation(() => ({
      insert: mockInsert
    } as any));

    const service = new DataPlatformService('tenant-1');
    const result = await service.createPipeline({ name: 'Test Pipeline', description: 'desc', config: {} }, 'user-1');

    expect(result).toBeDefined();
    expect(result.id).toBe('pipe-1');
    expect(mockInsert).toHaveBeenCalled();
  });
});
