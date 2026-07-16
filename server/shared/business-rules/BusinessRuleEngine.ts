export interface RuleContext {
  tenantId: string;
  userId: string;
  [key: string]: any;
}

export interface BusinessRule {
  id: string;
  name: string;
  evaluate(context: RuleContext): Promise<boolean>;
}

export class BusinessRuleEngine {
  private rules: Map<string, BusinessRule[]> = new Map();

  public registerRule(domain: string, rule: BusinessRule) {
    if (!this.rules.has(domain)) {
      this.rules.set(domain, []);
    }
    this.rules.get(domain)!.push(rule);
  }

  public async evaluate(domain: string, context: RuleContext): Promise<boolean> {
    const domainRules = this.rules.get(domain) || [];
    for (const rule of domainRules) {
      const passed = await rule.evaluate(context);
      if (!passed) return false;
    }
    return true;
  }
}
export const businessRuleEngine = new BusinessRuleEngine();
