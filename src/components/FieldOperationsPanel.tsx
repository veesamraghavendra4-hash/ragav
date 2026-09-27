import React, { useState } from 'react';
import { User, Tractor, Droplets, BatteryCharging, CheckCircle2, Play, Square, RefreshCw, Compass } from 'lucide-react';
import { CameraPreset } from './FarmScene3D';

interface FieldOperationsPanelProps {
  irrigationActive: boolean;
  onToggleIrrigation: () => void;
  onFocusCamera: (preset: CameraPreset) => void;
}

export const FieldOperationsPanel: React.FC<FieldOperationsPanelProps> = ({
  irrigationActive,
  onToggleIrrigation,
  onFocusCamera,
}) => {
  const [farmerTask, setFarmerTask] = useState<string>('Row 5 Foliar Hydration & Soil Probe Inspection');
  const [tractorState, setTractorState] = useState<'Autonomous Idle' | 'Active Seeding Run'>('Autonomous Idle');
  const [tractorBattery, setTractorBattery] = useState<number>(94);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Check subsurface drip pressure regulator on manifold #2', done: true, time: '06:15 AM' },
    { id: 2, title: 'Foliar application of bio-neem spray on cabbage row #1', done: true, time: '07:30 AM' },
    { id: 3, title: 'Inspect tomato canopy in Row 5 for downy spore lesions', done: false, time: 'In Progress' },
    { id: 4, title: 'Autonomous electric tractor perimeter boundary seeding', done: false, time: 'Scheduled 11:00 AM' },
  ]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleToggleTractor = () => {
    if (tractorState === 'Autonomous Idle') {
      setTractorState('Active Seeding Run');
      onFocusCamera('tractor');
    } else {
      setTractorState('Autonomous Idle');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Active Field Operations & Machinery
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status of the field agronomist, autonomous electric fleet, and pressurized irrigation grid.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 font-semibold">All Systems Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Agronomist & Farmer Status */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Human Care & Agronomy
              </span>
              <span className="text-xs text-emerald-300 font-mono">On Field</span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">David K. · Senior Agronomist</h3>
                <div className="text-xs text-slate-400 font-mono">Walk Path: Furrow Row 4–5</div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
              <span className="text-slate-400">Current Action in 3D Scene:</span>
              <div className="text-white font-semibold text-emerald-300">{farmerTask}</div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <span className="text-slate-400">Switch Farmer Operation:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Watering Crops & Spray',
                  'Checking Foliage Health',
                  'Harvesting Mature Romaine',
                ].map((act) => (
                  <button
                    key={act}
                    onClick={() => {
                      setFarmerTask(act);
                      onFocusCamera('farmer');
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      farmerTask === act
                        ? 'bg-emerald-400 text-slate-950 font-semibold'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => onFocusCamera('farmer')}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer mt-4"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Track Farmer Camera in 3D</span>
          </button>
        </div>

        {/* Card 2: Autonomous Electric Tractor */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Machinery Telemetry
              </span>
              <span className="text-xs text-emerald-300 font-mono">RTK Sub-inch GPS</span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400">
                <Tractor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Eco-Trac Electric Autonomous</h3>
                <div className="text-xs text-slate-400 font-mono">Status: {tractorState}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                  <span>LiFePO4 Pack</span>
                </div>
                <div className="text-sm font-bold text-white font-mono mt-0.5 tabular-nums">
                  {tractorBattery}% (8.5h runtime)
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <div className="text-slate-400 text-[11px]">Location in 3D</div>
                <div className="text-sm font-bold text-emerald-300 font-mono mt-0.5">
                  East Perimeter Lane
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-400">
              Low-pressure pneumatic flotation tires eliminate subsoil compaction across root zones.
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleToggleTractor}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                tractorState === 'Active Seeding Run'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
              }`}
            >
              {tractorState === 'Active Seeding Run' ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Pause Mission</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Deploy Tractor</span>
                </>
              )}
            </button>

            <button
              onClick={() => onFocusCamera('tractor')}
              className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Inspect
            </button>
          </div>
        </div>

        {/* Card 3: Pressurized Subsurface Sprinklers & Water Tower */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Irrigation Grid
              </span>
              <span className="text-xs text-cyan-300 font-mono">
                {irrigationActive ? 'Sprinklers Misting' : 'Pumps Idle'}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Micro-Sprinkler & Drip Network</h3>
                <div className="text-xs text-slate-400 font-mono">Water Tower: 8,400 Gallons (92%)</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 text-[11px]">System Pressure:</span>
                <div className="text-sm font-bold text-white font-mono mt-0.5 tabular-nums">
                  2.4 bar (Regulated)
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 text-[11px]">Active Flow Rate:</span>
                <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5 tabular-nums">
                  {irrigationActive ? '24.5 L/min' : '0.0 L/min'}
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-400">
              Activating sprinklers triggers the live particle mist system across all 7 crop furrows in the 3D scene.
            </div>
          </div>

          <button
            onClick={onToggleIrrigation}
            className={`w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer mt-4 ${
              irrigationActive
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>{irrigationActive ? 'Stop Sprinkler Mist' : 'Activate 3D Sprinklers Mist'}</span>
          </button>
        </div>
      </div>

      {/* Daily Field Tasks & Operations Checklist */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white font-display">
          Field Operations Work Log & Today's Schedule
        </h3>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 flex items-center justify-between gap-4 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    task.done
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-white/20 bg-white/5'
                  }`}
                >
                  {task.done && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span
                  className={`text-xs ${
                    task.done ? 'line-through text-slate-500' : 'text-slate-200'
                  }`}
                >
                  {task.title}
                </span>
              </div>

              <span className="text-[11px] font-mono text-slate-400 shrink-0">{task.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
