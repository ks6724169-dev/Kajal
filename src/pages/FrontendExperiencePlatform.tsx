import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Settings, 
  Sliders, 
  Bot, 
  Calendar as CalendarIcon, 
  Table as TableIcon, 
  ListTodo, 
  FolderTree, 
  History,
  Languages,
  Eye,
  Info,
  Laptop,
  CheckCircle,
  Clock,
  Layout,
  FileCode2
} from 'lucide-react';
import { useStore } from '../stores/StoreContext';
import { getTranslation } from '../theme/translations';
import { Button, Input, Select, Checkbox, Radio, Avatar, Card, SkeletonLoader } from '../design-system/CoreComponents';
import { Tabs, Calendar, DatePicker, DataGrid, Tree, Timeline, Kanban, ChartsWrapper, Dialog, Drawer, Breadcrumb } from '../design-system/AdvancedComponents';
import { AIWorkspaceFoundation, AssistantWidget, PROMPT_LIBRARY } from '../components/AIWorkspaceFoundation';
import { MicroFrontendFoundation } from '../components/MicroFrontendFoundation';

// Mock Data for DataGrid
const STUDENTS_SAMPLE = [
  { id: '1', name: 'Aarav Sharma', grade: 'Grade 10', email: 'aarav@galaxy.edu', status: 'PAID' },
  { id: '2', name: 'Ananya Patel', grade: 'Grade 12', email: 'ananya@galaxy.edu', status: 'PENDING' },
  { id: '3', name: 'Kabir Mehta', grade: 'Grade 11', email: 'kabir@galaxy.edu', status: 'OVERDUE' },
  { id: '4', name: 'Riya Gupta', grade: 'Grade 10', email: 'riya@galaxy.edu', status: 'PAID' },
  { id: '5', name: 'Siddharth Sen', grade: 'Grade 9', email: 'sid@galaxy.edu', status: 'PAID' },
  { id: '6', name: 'Zoya Khan', grade: 'Grade 11', email: 'zoya@galaxy.edu', status: 'PENDING' }
];

// Mock Data for Charts
const PERFORMANCE_DATA = [
  { name: 'US-East-1', value: 85 },
  { name: 'EU-West-1', value: 92 },
  { name: 'AP-South-1', value: 76 },
  { name: 'SA-East-1', value: 64 }
];

// Mock Tree Structure
const TREE_NODES = [
  {
    id: 't-1',
    label: 'galaxy-erp-platform',
    type: 'folder' as const,
    children: [
      {
        id: 't-1-1',
        label: 'design-system',
        type: 'folder' as const,
        children: [
          { id: 't-1-1-1', label: 'CoreComponents.tsx', type: 'file' as const },
          { id: 't-1-1-2', label: 'AdvancedComponents.tsx', type: 'file' as const }
        ]
      },
      { id: 't-1-2', label: 'StoreContext.tsx', type: 'file' as const },
      { id: 't-1-3', label: 'translations.ts', type: 'file' as const }
    ]
  }
];

// Mock Timeline Events
const TIMELINE_EVENTS = [
  { id: 'ev-1', title: 'Global Database Replicated', description: 'Cross-region data replication completed with 0 lag.', time: '10:00 UTC', type: 'success' as const },
  { id: 'ev-2', title: 'Autoscale Triggered', description: 'CPU usage exceeded 85% on AP-SOUTH-1 cluster.', time: '11:15 UTC', type: 'warning' as const },
  { id: 'ev-3', title: 'Compliance Audit Approved', description: 'SOC2 operational boundary successfully validated.', time: '13:30 UTC', type: 'info' as const }
];

// Mock Kanban Board initial columns
const KANBAN_INITIAL = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: 'tk-1', title: 'Audit AWS node costs', priority: 'medium' as const, assignedTo: 'A. Patel' },
      { id: 'tk-2', title: 'Update GDPR guidelines', priority: 'high' as const, assignedTo: 'S. Sen' }
    ]
  },
  {
    id: 'progress',
    title: 'In Progress',
    tasks: [
      { id: 'tk-3', title: 'Refactor Design System', priority: 'high' as const, assignedTo: 'K. Mehta' }
    ]
  },
  {
    id: 'done',
    title: 'Completed',
    tasks: [
      { id: 'tk-4', title: 'Configure CDN Purge API', priority: 'low' as const, assignedTo: 'R. Sharma' }
    ]
  }
];

export const FrontendExperiencePlatform: React.FC = () => {
  const { theme, setTheme, language, setLanguage } = useStore();
  const [activeTab, setActiveTab] = useState('atoms');
  const [dateValue, setDateValue] = useState('2026-07-18');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Translate Key
  const t = (key: string) => getTranslation(language, key);

  return (
    <div className="space-y-8 font-sans transition-colors duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-950 text-white p-8 shadow-xl">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Sparkles className="h-44 w-44" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            PHASE 03.3A CORE FOUNDATION
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white">
            Universal UI & Experience Platform
          </h1>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Enterprise Design System configured with full theme controls, WCAG high-contrast guidelines, multi-region operational micro-frontends, and predictive AI assistants.
          </p>
          
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1.5 text-xs bg-slate-900/60 hover:bg-slate-900 px-3.5 py-2 rounded-lg font-bold border border-slate-800 text-indigo-300 transition-all cursor-pointer"
            >
              <Languages className="h-4 w-4" />
              <span>{t('changeLanguage')}</span>
            </button>
            <button
              onClick={() => setTheme(theme === 'high-contrast' ? 'light' : theme === 'dark' ? 'high-contrast' : 'dark')}
              className="flex items-center space-x-1.5 text-xs bg-slate-900/60 hover:bg-slate-900 px-3.5 py-2 rounded-lg font-bold border border-slate-800 text-indigo-300 transition-all cursor-pointer"
            >
              <Sliders className="h-4 w-4" />
              <span>Cycle Theme: {theme.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <Tabs
        items={[
          { id: 'atoms', label: 'Design System Atoms', icon: <Sliders className="h-4 w-4" /> },
          { id: 'widgets', label: 'Interactive Widgets', icon: <TableIcon className="h-4 w-4" /> },
          { id: 'microfrontend', label: 'Micro Frontend Hub', icon: <Layers className="h-4 w-4" /> },
          { id: 'aiworkspace', label: 'AI Operations Center', icon: <Bot className="h-4 w-4" /> }
        ]}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      {/* Render Sections */}
      {activeTab === 'atoms' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form controls */}
          <Card>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-6 flex items-center space-x-2">
              <span>Interactive Form Elements</span>
            </h3>
            <div className="space-y-4">
              <Input label="Enterprise System Operator Name" placeholder="Dr. Rajesh Sharma" id="name-input" />
              <Input label="Vault Password Key" type="password" placeholder="••••••••••••" error="Rotation recommended every 30 days" id="pass-input" />
              <Select
                label="Primary Latency Node Routing"
                options={[
                  { value: 'latency', label: t('geoRouting') },
                  { value: 'round-robin', label: 'Round Robin Failover' }
                ]}
                id="select-node"
              />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Checkboxes</h4>
                  <Checkbox label="Enable SOC2 Shield" defaultChecked id="soc2-chk" />
                  <Checkbox label="Auto Purge CDN" id="cdn-chk" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Radios</h4>
                  <Radio label="Canary Mode" name="routing" defaultChecked id="canary-rad" />
                  <Radio label="Blue-Green Mode" name="routing" id="bg-rad" />
                </div>
              </div>
            </div>
          </Card>

          {/* Button states and variations */}
          <Card className="flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-6">Button Variations</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="danger">Danger Action</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="primary" loading>Applying Nodes...</Button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">Skeletons & Feedback States</h3>
              <div className="space-y-3">
                <SkeletonLoader lines={2} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Interactive Widgets section */}
      {activeTab === 'widgets' && (
        <div className="space-y-8">
          <Breadcrumb items={[{ label: 'System Home' }, { label: 'Operational Registry' }, { label: 'Live Table Grid' }]} />

          {/* Data Grid with student list */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-3">Live Operational DataGrid</h3>
            <DataGrid
              data={STUDENTS_SAMPLE}
              columns={[
                { header: 'Student Name', accessor: 'name', sortable: true },
                { header: 'Registration Grade', accessor: 'grade' },
                { header: 'Tenant Email Address', accessor: 'email' },
                {
                  header: 'Fee Ledger Status',
                  accessor: (row) => (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.status === 'PAID' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' :
                      row.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                    }`}>
                      {row.status}
                    </span>
                  )
                }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar widget */}
            <Card>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">Operational Calendar</h3>
              <DatePicker label="Schedule Maintenance Window" value={dateValue} onChange={setDateValue} />
              <div className="mt-4">
                <Calendar selectedDate={dateValue} onChange={setDateValue} />
              </div>
            </Card>

            {/* Tree component */}
            <Card>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">SaaS Directory Explorer</h3>
              <Tree nodes={TREE_NODES} />
            </Card>

            {/* Timeline component */}
            <Card>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">Operations Timeline Logs</h3>
              <Timeline events={TIMELINE_EVENTS} />
            </Card>
          </div>

          {/* Kanban Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Operational task Kanban Board</h3>
            <Kanban initialColumns={KANBAN_INITIAL} />
          </div>

          {/* Dialogs and overlay triggers */}
          <Card>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">Overlays and Triggers</h3>
            <div className="flex space-x-3">
              <Button onClick={() => setIsDialogOpen(true)}>Open Dialog Overlay</Button>
              <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>Open Action Drawer</Button>
            </div>
            
            {/* Dialog Overlay */}
            <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Autonomous Scaling Directive">
              <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <p>This action will deploy supplementary worker nodes across European clusters. Current billing metrics will adjust by approximately +$120/mo.</p>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Approve Directive</Button>
                </div>
              </div>
            </Dialog>

            {/* Drawer Overlay */}
            <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title="GDPR audit checks">
              <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <p>Verify data compliance logs. Automated RLS parameters successfully map client requests dynamically inside region-contained parameters.</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                    <span>Active Encryption</span>
                    <span className="font-mono text-[10px] font-bold text-emerald-600">AES_256_GCM</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                    <span>Tenant Mapping Isolation</span>
                    <span className="font-mono text-[10px] font-bold text-emerald-600">COMPLIANT</span>
                  </div>
                </div>
                <div className="pt-6">
                  <Button className="w-full" onClick={() => setIsDrawerOpen(false)}>Certify System Compliance</Button>
                </div>
              </div>
            </Drawer>
          </Card>

          {/* ChartsWrapper showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">Regional Multi-Tenant Performance Rating</h3>
              <ChartsWrapper type="bar" data={PERFORMANCE_DATA} />
            </Card>
            <Card>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">Historical Autoscale Workload Pattern</h3>
              <ChartsWrapper type="area" data={PERFORMANCE_DATA} />
            </Card>
          </div>
        </div>
      )}

      {/* Micro Frontend Hub */}
      {activeTab === 'microfrontend' && (
        <Card>
          <MicroFrontendFoundation />
        </Card>
      )}

      {/* AI Operations Center */}
      {activeTab === 'aiworkspace' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
          <div className="xl:col-span-2 space-y-6">
            <Card className="bg-slate-50/50 dark:bg-slate-950/20">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <FileCode2 className="h-4 w-4 text-indigo-600" />
                <span>Prompt Recipe Generator</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROMPT_LIBRARY.map((p) => (
                  <div key={p.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-[9px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">
                      {p.category.toUpperCase()}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2">{p.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{p.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="xl:col-span-1 h-[520px]">
            <AIWorkspaceFoundation />
          </div>
        </div>
      )}

      {/* Float assistant bubble */}
      <AssistantWidget />
    </div>
  );
};
