import { 
  DeploymentReleaseRepository, 
  DeploymentVersionRepository, 
  DeploymentStrategyRepository, 
  RollbackHistoryRepository, 
  GlobalOperationLogRepository 
} from '../repositories/index.js';

export class DeploymentEngine {
  private releaseRepo: DeploymentReleaseRepository;
  private versionRepo: DeploymentVersionRepository;
  private strategyRepo: DeploymentStrategyRepository;
  private rollbackRepo: RollbackHistoryRepository;
  private logRepo: GlobalOperationLogRepository;

  constructor(private readonly tenantId: string) {
    this.releaseRepo = new DeploymentReleaseRepository(this.tenantId);
    this.versionRepo = new DeploymentVersionRepository(this.tenantId);
    this.strategyRepo = new DeploymentStrategyRepository(this.tenantId);
    this.rollbackRepo = new RollbackHistoryRepository(this.tenantId);
    this.logRepo = new GlobalOperationLogRepository(this.tenantId);
  }

  async triggerBlueGreen(envId: string, name: string, versionTag: string) {
    const release = await this.releaseRepo.insert({
      env_id: envId,
      name,
      version_tag: versionTag,
      status: 'BLUE_GREEN_IN_PROGRESS'
    } as any);

    await this.logRepo.insert({
      action: 'TRIGGER_BLUE_GREEN_DEPLOYMENT',
      severity: 'INFO',
      details: { release_id: release.id, name, versionTag }
    });

    return { release, strategy: 'BLUE_GREEN', status: 'IN_PROGRESS' };
  }

  async triggerCanary(envId: string, name: string, versionTag: string, initialWeight: number = 10) {
    const release = await this.releaseRepo.insert({
      env_id: envId,
      name,
      version_tag: versionTag,
      status: 'CANARY_IN_PROGRESS'
    } as any);

    await this.logRepo.insert({
      action: 'TRIGGER_CANARY_DEPLOYMENT',
      severity: 'INFO',
      details: { release_id: release.id, name, versionTag, initialWeight }
    });

    return { release, strategy: 'CANARY', status: 'IN_PROGRESS', weight: initialWeight };
  }

  async triggerRolling(envId: string, name: string, versionTag: string) {
    const release = await this.releaseRepo.insert({
      env_id: envId,
      name,
      version_tag: versionTag,
      status: 'ROLLING_IN_PROGRESS'
    } as any);

    await this.logRepo.insert({
      action: 'TRIGGER_ROLLING_DEPLOYMENT',
      severity: 'INFO',
      details: { release_id: release.id, name, versionTag }
    });

    return { release, strategy: 'ROLLING_UPDATE', status: 'IN_PROGRESS' };
  }

  async rollbackRelease(releaseId: string, reason: string, triggeredBy: string) {
    const release = await this.releaseRepo.findOne(releaseId);
    if (!release) {
      throw new Error('Release not found');
    }

    const rollback = await this.rollbackRepo.insert({
      release_id: releaseId,
      reason,
      triggered_by: triggeredBy
    } as any);

    await this.releaseRepo.update(releaseId, { status: 'ROLLED_BACK' } as any, release.version);

    await this.logRepo.insert({
      action: 'TRIGGER_ROLLBACK',
      severity: 'WARNING',
      details: { releaseId, rollbackId: rollback.id, reason }
    });

    return { status: 'SUCCESS', rollback };
  }

  async promoteVersion(releaseId: string) {
    const release = await this.releaseRepo.findOne(releaseId);
    if (!release) {
      throw new Error('Release not found');
    }

    const updated = await this.releaseRepo.update(releaseId, { status: 'PROMOTED_PRODUCTION' } as any, release.version);

    await this.logRepo.insert({
      action: 'PROMOTE_VERSION',
      severity: 'INFO',
      details: { releaseId, version: release.version_tag }
    });

    return { status: 'SUCCESS', release: updated };
  }
}
