import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, DollarSign, Layers, Award, ShieldAlert } from 'lucide-react';
import {
  RevenueDataPoint,
  RevenueByCategory,
  RevenueByDeveloper,
} from '../../../types/adminControl';

interface SectionRevenueProps {
  dailyData: RevenueDataPoint[];
  byCategory: RevenueByCategory[];
  byDeveloper: RevenueByDeveloper[];
  formatPrice: (amount: number) => string;
}

const COLORS = ['#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6'];

export const SectionRevenue: React.FC<SectionRevenueProps> = ({
  dailyData,
  byCategory,
  byDeveloper,
  formatPrice,
}) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Simulated Weekly Data
  const weeklyData = [
    { date: 'Week 27', revenue: 24500, ordersCount: 32, escrowLocked: 18200 },
    { date: 'Week 28', revenue: 29800, ordersCount: 41, escrowLocked: 22400 },
    { date: 'Week 29', revenue: 31200, ordersCount: 45, escrowLocked: 25100 },
    { date: 'Week 30', revenue: 35600, ordersCount: 52, escrowLocked: 28400 },
  ];

  // Simulated Monthly Data
  const monthlyData = [
    { date: 'Apr 2026', revenue: 84000, ordersCount: 110, escrowLocked: 62000 },
    { date: 'May 2026', revenue: 98000, ordersCount: 135, escrowLocked: 71000 },
    { date: 'Jun 2026', revenue: 112000, ordersCount: 154, escrowLocked: 82000 },
    { date: 'Jul 2026', revenue: 142850, ordersCount: 184, escrowLocked: 94000 },
  ];

  const currentChartData =
    timeframe === 'weekly' ? weeklyData : timeframe === 'monthly' ? monthlyData : dailyData;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            SECTION 2 — Revenue Analytics & Financial Performance
          </h2>
          <p className="text-xs text-slate-400">
            Comprehensive breakdown of gross revenue, platform fee commission, escrow vault distribution, category shares, and top performing developers.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                timeframe === tf
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Revenue Area Chart */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Revenue Trend ({timeframe.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-400">Gross transaction volume and locked escrow vault balances</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-slate-300">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-300">Escrow Locked</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEsc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [formatPrice(Number(val) || 0), '']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
              <Area type="monotone" dataKey="escrowLocked" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorEsc)" name="Escrow Locked" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Revenue by Category & Revenue by Developer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Category (Pie/Donut) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Revenue Distribution by Category
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="h-60 w-60 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="revenue"
                  >
                    {byCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [formatPrice(Number(val) || 0), '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-2.5 w-full">
              {byCategory.map((cat, index) => (
                <div key={cat.category} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-bold text-slate-200 truncate">{cat.category}</span>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-white font-bold">{formatPrice(cat.revenue)}</div>
                    <div className="text-[10px] text-slate-400">{cat.percentage}% share</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Developers Revenue (Bar Chart) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Top Revenue Generating Developers
          </h3>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byDeveloper} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} opacity={0.5} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis dataKey="developerName" type="category" stroke="#94a3b8" fontSize={11} tickLine={false} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [formatPrice(Number(val) || 0), 'Earnings']}
                />
                <Bar dataKey="revenue" fill="#06b6d4" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
