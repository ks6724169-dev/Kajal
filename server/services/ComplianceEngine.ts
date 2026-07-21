import { 
  CompliancePolicyRepository, 
  ComplianceAuditRepository, 
  GlobalOperationLogRepository 
} from '../repositories/index.js';

export class ComplianceEngine {
  private policyRepo: CompliancePolicyRepository;
  private auditRepo: ComplianceAuditRepository;
  private logRepo: GlobalOperationLogRepository;

  constructor(private readonly tenantId: string) {
    this.policyRepo = new CompliancePolicyRepository(this.tenantId);
    this.auditRepo = new ComplianceAuditRepository(this.tenantId);
    this.logRepo = new GlobalOperationLogRepository(this.tenantId);
  }

  async createCompliancePolicy(name: string, standard: string, rules: Record<string, any> = {}) {
    const policy = await this.policyRepo.insert({
      name,
      standard,
      rules
    } as any);

    await this.logRepo.insert({
      action: 'COMPLIANCE_POLICY_CREATE',
      severity: 'INFO',
      details: { policy_id: policy.id, name, standard }
    });

    return policy;
  }

  async runComplianceAudit(policyId: string, status: string = 'PASSED', findings?: string) {
    const audit = await this.auditRepo.insert({
      policy_id: policyId,
      status,
      findings,
      audited_at: new Date()
    } as any);

    await this.logRepo.insert({
      action: 'COMPLIANCE_AUDIT_RUN',
      severity: status === 'PASSED' ? 'INFO' : 'WARNING',
      details: { audit_id: audit.id, policyId, status }
    });

    return audit;
  }
}
