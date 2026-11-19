import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  FolderOpen, 
  MessageSquare, 
  Sparkles,
  Activity,
  Eye,
  Calendar
} from 'lucide-react';

const SUMMARY_CARDS = [
  { key: 'projects', label: 'Projects', icon: FolderOpen, color: 'bg-[var(--brand-camel)]', textColor: 'text-[var(--brand-black)]' },
  { key: 'services', label: 'Services', icon: Sparkles, color: 'bg-[var(--brand-camel-dark)]', textColor: 'text-[var(--brand-black)]' },
  { key: 'team', label: 'Team members', icon: Users, color: 'bg-[var(--brand-camel-light)]', textColor: 'text-[var(--brand-black)]' },
  { key: 'reviews', label: 'Client reviews', icon: MessageSquare, color: 'bg-gradient-to-r from-[var(--brand-camel)] to-[var(--brand-camel-dark)]', textColor: 'text-[var(--brand-black)]' },
];

export default function Dashboard() {
  const { token } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    projects: 0,
    services: 0,
    team: 0,
    reviews: 0,
  });
  const [trends, setTrends] = useState({
    projects: '+0%',
    services: '+0%',
    team: '+0%',
    reviews: '+0%',
  });

  // Chart data states
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setChartsLoading(true);
      try {
        // Fetch overview stats and trends
        const overviewResponse = await apiRequest('/analytics/overview', { token });
        if (overviewResponse?.success && isMounted) {
          setCounts(overviewResponse.data.counts);
          setTrends(overviewResponse.data.trends);
        }

        // Fetch chart data in parallel
        const [monthlyResponse, categoryResponse, activityResponse] = await Promise.all([
          apiRequest('/analytics/monthly-growth', { token }),
          apiRequest('/analytics/project-categories', { token }),
          apiRequest('/analytics/weekly-activity', { token })
        ]);

        if (isMounted) {
          setMonthlyData(monthlyResponse?.data || []);
          setCategoryData(categoryResponse?.data || []);
          setActivityData(activityResponse?.data || []);
        }
      } catch (err) {
        if (isMounted) {
          toast.showError(err.message || 'Failed to load dashboard data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setChartsLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [token, toast]);

  return (
    <div className="space-y-6">
      {/* Enhanced Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SUMMARY_CARDS.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute top-0 right-0 h-16 w-16 -translate-y-2 translate-x-2 rounded-full bg-gradient-to-br from-[var(--brand-camel)]/20 to-transparent" />
              
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`rounded-lg p-2 ${card.color} bg-opacity-100`}>
                      <Icon className={`h-5 w-5 ${card.textColor}`} />
                    </div>
                    <span className="text-xs font-medium text-[var(--text-muted)]">
                      {card.label}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-[var(--text-primary)]">
                    {loading ? '—' : counts[card.key]}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">
                      {trends[card.key]}
                    </span>
                    <span className="text-xs text-(--text-muted)">vs last month</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Monthly Growth
            </h3>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Activity className="h-4 w-4" />
              Last 6 months
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            {chartsLoading ? (
              <div className="flex items-center justify-center h-full text-(--text-muted)">
                Loading chart data...
              </div>
            ) : (
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  stroke="var(--border-subtle)"
                />
                <YAxis 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  stroke="var(--border-subtle)"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--surface-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="projects" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="services" 
                  stackId="1"
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="reviews" 
                  stackId="1"
                  stroke="#F59E0B" 
                  fill="#F59E0B" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        {/* Project Categories Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Project Categories
            </h3>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Eye className="h-4 w-4" />
              Distribution
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            {chartsLoading ? (
              <div className="flex items-center justify-center h-full text-(--text-muted)">
                Loading chart data...
              </div>
            ) : (
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--surface-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-(--text-muted)">
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Weekly Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Weekly Activity
          </h3>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Calendar className="h-4 w-4" />
            This week
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          {chartsLoading ? (
            <div className="flex items-center justify-center h-full text-(--text-muted)">
              Loading chart data...
            </div>
          ) : (
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                stroke="var(--border-subtle)"
              />
              <YAxis 
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                stroke="var(--border-subtle)"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--surface-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="activity" 
                fill="var(--brand-camel)" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

