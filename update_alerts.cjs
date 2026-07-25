const fs = require('fs');
let content = fs.readFileSync('src/components/owner/AlertCenter.tsx', 'utf8');

content = content.replace(
  "  onNavigate: (path: string) => void;",
  "  onNavigate: (path: string) => void;\n  stats?: any;"
);

content = content.replace(
  "({ onNavigate })",
  "({ onNavigate, stats })"
);

content = content.replace(
  /const alerts = \[\s*[\s\S]*?\s*\];/g,
  `const alerts = stats?.alertsData || [];`
);

content = content.replace(
  /<alert\.icon/g,
  `{/* Dynamic icon mapping */}\n                {alert.icon === 'UserX' ? <UserX className={\`w-4 h-4 \${getIconColor(alert.type)}\`} /> : alert.icon === 'Info' ? <Info className={\`w-4 h-4 \${getIconColor(alert.type)}\`} /> : alert.icon === 'CreditCard' ? <CreditCard className={\`w-4 h-4 \${getIconColor(alert.type)}\`} /> : alert.icon === 'ShieldAlert' ? <ShieldAlert className={\`w-4 h-4 \${getIconColor(alert.type)}\`} /> : <AlertCircle className={\`w-4 h-4 \${getIconColor(alert.type)}\`} />}`
);

fs.writeFileSync('src/components/owner/AlertCenter.tsx', content);
