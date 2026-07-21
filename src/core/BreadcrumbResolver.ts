import { BreadcrumbItem } from '../store/navigationStore';

export class BreadcrumbResolver {
  private static BREADCRUMB_MAP: Record<string, { label: string; hindiLabel: string }> = {
    dashboard: { label: 'Command Center', hindiLabel: 'कमांड सेंटर' },
    ai_hub: { label: 'Galaxy AI Engine', hindiLabel: 'गैलेक्सी एआई इंजन' },
    students: { label: 'Student Portal', hindiLabel: 'छात्र पोर्टल' },
    fees: { label: 'Fiscal Catalog', hindiLabel: 'वित्तीय सूची' },
    attendance: { label: 'Biometrics & Attendance', hindiLabel: 'बायोमेट्रिक्स और उपस्थिति' },
    transport: { label: 'Fleet GPS Telemetry', hindiLabel: 'बेड़ा और जीपीएस ट्रैकिंग' },
    exams: { label: 'Assessment & Grades', hindiLabel: 'मूल्यांकन और ग्रेड' },
    hrms: { label: 'HRMS & Payroll', hindiLabel: 'मानव संसाधन और वेतन' },
    library: { label: 'Inventory & Facilities', hindiLabel: 'इन्वेंटरी और सुविधाएं' },
    cctv: { label: 'CCTV Security Systems', hindiLabel: 'सीसीटीवी सुरक्षा प्रणालियां' },
    mobile_apps: { label: 'Mobile App Simulator', hindiLabel: 'मोबाइल ऐप सिम्युलेटर' },
    design_system: { label: 'Enterprise Experience Platform', hindiLabel: 'अनुभव मंच' },
    settings: { label: 'Sovereign Configuration', hindiLabel: 'संप्रभु विन्यास' }
  };

  static resolveBreadcrumbs(path: string): BreadcrumbItem[] {
    const defaultRoot: BreadcrumbItem = { label: 'Home', hindiLabel: 'होम', path: 'dashboard' };
    
    if (path === 'dashboard' || !path) {
      return [{ label: 'Command Center', hindiLabel: 'कमांड सेंटर' }];
    }

    const currentMeta = this.BREADCRUMB_MAP[path];
    if (currentMeta) {
      return [
        defaultRoot,
        { label: currentMeta.label, hindiLabel: currentMeta.hindiLabel }
      ];
    }

    // Dynamic fallback for sub-items or unrecognized tabs
    return [
      defaultRoot,
      { label: path.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), path }
    ];
  }
}
