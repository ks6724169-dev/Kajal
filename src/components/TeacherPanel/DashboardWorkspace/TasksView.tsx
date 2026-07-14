import React from 'react';
import { ListTodo, CheckCircle2, Clock, MoreVertical, Plus } from 'lucide-react';

export const TasksView: React.FC = () => {
  const tasks = [
    { id: 1, title: 'Grade 10 Mathematics Midterm Papers', priority: 'High', status: 'Pending', due: 'Tomorrow' },
    { id: 2, title: 'Submit weekly lesson plans for approval', priority: 'Medium', status: 'Pending', due: 'Friday' },
    { id: 3, title: 'Call parents of underperforming students', priority: 'High', status: 'In Progress', due: 'Today' },
    { id: 4, title: 'Prepare slides for Chapter 5', priority: 'Low', status: 'Completed', due: 'Yesterday' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Tasks', value: 24, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Pending', value: 12, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'High Priority', value: 4, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Completed', value: 8, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <ListTodo className="w-6 h-6" />
            </div>
            <h4 className="text-3xl font-bold text-slate-900">{stat.value}</h4>
            <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Task Description</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <button className={`w-5 h-5 rounded-md border ${task.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'} flex items-center justify-center`}>
                        {task.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <span className={`text-sm font-medium ${task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      task.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                      task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-slate-600">{task.status}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      {task.due}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
