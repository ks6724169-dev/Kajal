import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Calendar as CalendarIcon, 
  ChevronDown, 
  Plus, 
  Trash2, 
  X,
  TrendingUp,
  Folder,
  FolderOpen,
  File
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Button } from './CoreComponents';

// 1. TABS
interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}
export const Tabs: React.FC<{
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}> = ({ items, activeId, onChange }) => {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4 overflow-x-auto">
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              isActive
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// 2. CALENDAR & DATEPICKER
export const Calendar: React.FC<{
  selectedDate: string;
  onChange: (date: string) => void;
}> = ({ selectedDate, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayIndex }, (_, i) => null);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const handleDayClick = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    onChange(`${year}-${formattedMonth}-${formattedDay}`);
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {monthNames[month]} {year}
        </h4>
        <div className="flex space-x-1">
          <button onClick={prevMonth} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={nextMonth} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {padding.map((_, i) => <div key={`pad-${i}`} />)}
        {days.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = dateStr === selectedDate;
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const DatePicker: React.FC<{
  label?: string;
  value: string;
  onChange: (val: string) => void;
}> = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative mb-4">
      {label && <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300"
      >
        <span>{value || 'Select Date...'}</span>
        <CalendarIcon className="h-4 w-4 text-slate-400" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 shadow-xl bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Calendar
            selectedDate={value}
            onChange={(d) => {
              onChange(d);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

// 3. DATAGRID & TABLE
interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
}

export function DataGrid<T extends { id: string | number }>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Filter records...'
}: {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | null; direction: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter
  const filteredData = data.filter((row) => {
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort
  const sortedData = [...filteredData];
  if (sortConfig && sortConfig.key) {
    sortedData.sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Paginate
  const pageCount = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => typeof col.accessor === 'string' && col.sortable && handleSort(col.accessor as keyof T)}
                  className={`p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${
                    typeof col.accessor === 'string' && col.sortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700' : ''
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.header}</span>
                    {typeof col.accessor === 'string' && col.sortable && <ChevronDown className="h-3 w-3 text-slate-400" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="p-4 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center p-8 text-xs text-slate-400">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Page {page} of {pageCount}
          </span>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" disabled={page === pageCount} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. TREE COMPONENT
export interface TreeNode {
  id: string;
  label: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
}

export const Tree: React.FC<{ nodes: TreeNode[]; onSelect?: (node: TreeNode) => void }> = ({ nodes, onSelect }) => {
  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <TreeNodeItem key={node.id} node={node} onSelect={onSelect} depth={0} />
      ))}
    </div>
  );
};

const TreeNodeItem: React.FC<{ node: TreeNode; onSelect?: (node: TreeNode) => void; depth: number }> = ({
  node,
  onSelect,
  depth
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          if (onSelect) onSelect(node);
        }}
        className="flex items-center space-x-2 py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren ? (
          <ChevronRight className={`h-3.5 w-3.5 transform transition-transform ${expanded ? 'rotate-90' : ''}`} />
        ) : (
          <span className="w-3.5" />
        )}
        {node.type === 'folder' ? (
          expanded ? <FolderOpen className="h-4 w-4 text-amber-500" /> : <Folder className="h-4 w-4 text-amber-500" />
        ) : (
          <File className="h-4 w-4 text-sky-500" />
        )}
        <span>{node.label}</span>
      </div>
      {expanded && hasChildren && (
        <div className="mt-0.5">
          {node.children!.map((child) => (
            <TreeNodeItem key={child.id} node={child} onSelect={onSelect} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// 5. TIMELINE
interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'danger';
}

export const Timeline: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  const colorMap = {
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
    danger: 'bg-red-500'
  };

  return (
    <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 py-2 space-y-6">
      {events.map((ev) => (
        <div key={ev.id} className="relative pl-6">
          <div className={`absolute -left-[6px] top-1.5 h-3 w-3 rounded-full ${colorMap[ev.type]} ring-4 ring-white dark:ring-slate-900`} />
          <span className="text-[10px] font-mono text-slate-400 block mb-0.5">{ev.time}</span>
          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{ev.title}</h5>
          <p className="text-xs text-slate-500 mt-0.5">{ev.description}</p>
        </div>
      ))}
    </div>
  );
};

// 6. KANBAN BOARD
interface KanbanTask {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

export const Kanban: React.FC<{ initialColumns: KanbanColumn[] }> = ({ initialColumns }) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);

  const moveTask = (taskId: string, targetColId: string) => {
    let movingTask: KanbanTask | null = null;
    const newColumns = columns.map((col) => {
      const task = col.tasks.find((t) => t.id === taskId);
      if (task) {
        movingTask = task;
        return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
      }
      return col;
    });

    if (movingTask) {
      setColumns(
        newColumns.map((col) => {
          if (col.id === targetColId) {
            return { ...col, tasks: [...col.tasks, movingTask!] };
          }
          return col;
        })
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => (
        <div key={col.id} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900">
          <div className="flex justify-between items-center mb-3">
            <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {col.title} ({col.tasks.length})
            </h5>
          </div>
          <div className="space-y-3 min-h-[150px]">
            {col.tasks.map((task) => (
              <div
                key={task.id}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-2">{task.title}</div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    task.priority === 'high' ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' :
                    task.priority === 'medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' :
                    'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400'
                  }`}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span>{task.assignedTo}</span>
                </div>
                <div className="flex space-x-1 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {columns.map((targetCol) => {
                    if (targetCol.id === col.id) return null;
                    return (
                      <button
                        key={targetCol.id}
                        onClick={() => moveTask(task.id, targetCol.id)}
                        className="text-[9px] text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        → {targetCol.title.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// 7. CHARTS WRAPPER
export const ChartsWrapper: React.FC<{
  type: 'line' | 'bar' | 'area' | 'pie';
  data: any[];
  xKey?: string;
  yKey?: string;
  height?: number;
  colors?: string[];
}> = ({ type, data, xKey = 'name', yKey = 'value', height = 240, colors = ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b'] }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        {type === 'area' ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey={xKey} stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc', fontSize: '11px' }} />
            <Area type="monotone" dataKey={yKey} stroke={colors[0]} fillOpacity={1} fill="url(#colorUv)" strokeWidth={2} />
          </AreaChart>
        ) : type === 'bar' ? (
          <BarChart data={data}>
            <XAxis dataKey={xKey} stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc', fontSize: '11px' }} />
            <Bar dataKey={yKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : type === 'line' ? (
          <LineChart data={data}>
            <XAxis dataKey={xKey} stroke="#94a3b8" fontSize={10} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc', fontSize: '11px' }} />
            <Line type="monotone" dataKey={yKey} stroke={colors[0]} strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey={yKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc', fontSize: '11px' }} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

// 8. DIALOG
export const Dialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden z-10 p-6"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">{title}</h3>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// 9. DRAWER
export const Drawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">{title}</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

// 10. BREADCRUMB
export const Breadcrumb: React.FC<{ items: { label: string; path?: string }[] }> = ({ items }) => {
  return (
    <nav className="flex py-2 text-slate-400 text-xs font-medium space-x-1.5 items-center">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-slate-300 dark:text-slate-700">/</span>}
          {item.path ? (
            <span className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors">
              {item.label}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 font-normal">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
