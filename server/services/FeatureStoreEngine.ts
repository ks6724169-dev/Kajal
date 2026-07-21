export class FeatureStoreEngine {
  constructor(private tenantId: string) {}
  async getFeature(featureName: string) {
    return { feature_name: featureName, value: 0.95 };
  }
}
