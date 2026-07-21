import fs from 'fs';
let c = fs.readFileSync('src/components/auth/RegistrationCertificateModal.tsx', 'utf8');

c = c.replace(
  "import { X, Download, Printer, ShieldCheck, MapPin, Building2, User, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';",
  "import { X, Download, Printer, ShieldCheck, MapPin, Building2, User, Phone, Mail, FileText, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';"
);

c = c.replace(
  "image: { type: 'jpeg', quality: 0.98 },",
  "image: { type: 'jpeg' as const, quality: 0.98 },"
);

c = c.replace(
  "html2pdf().set(opt).from(element).save();",
  "(html2pdf as any)().set(opt).from(element).save();"
);

fs.writeFileSync('src/components/auth/RegistrationCertificateModal.tsx', c);
