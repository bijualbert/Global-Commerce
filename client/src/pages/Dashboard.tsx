import { useRegions } from "@/hooks/use-regions";
import { useProducts } from "@/hooks/use-products";
import { useAutomationRules } from "@/hooks/use-automation";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { Globe, Package, Zap, ArrowRight, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: regions } = useRegions();
  const { data: products } = useProducts();
  const { data: automations } = useAutomationRules();

  // Derived stats
  const totalProducts = products?.length || 0;
  const activeAutomations = automations?.filter(a => a.isActive).length || 0;
  const liveRegions = regions?.filter(r => r.status === 'live').length || 0;

  // Chart data preparation
  const regionStats = regions?.map(r => ({
    name: r.code,
    products: Math.floor(Math.random() * 50) + 10, // Mock data since API doesn't return count per region yet
    status: r.status
  })) || [];

  const handleDownloadReport = () => {
    const reportData = {
      summary: {
        totalProducts,
        activeAutomations,
        liveRegions,
      },
      regions: regions?.map(r => ({
        code: r.code,
        name: r.name,
        status: r.status,
      })) || [],
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gm-commerce-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold font-display text-foreground">Overview</h2>
          <p className="text-muted-foreground mt-1">Global commerce performance at a glance.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors"
          >
            Download Report
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5">
            Sync Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<Package className="w-6 h-6" />}
            trend="+12%"
            trendUp={true}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatCard
            title="Active Automations"
            value={activeAutomations}
            icon={<Zap className="w-6 h-6" />}
            trend="+5%"
            trendUp={true}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatCard
            title="Live Regions"
            value={liveRegions}
            icon={<Globe className="w-6 h-6" />}
            trend="Stable"
            trendUp={true}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-display">Regional Product Distribution</h3>
            <select className="text-sm border-border rounded-lg p-1.5 bg-secondary text-secondary-foreground">
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderRadius: '8px', 
                    border: '1px solid hsl(var(--border))',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }}
                />
                <Bar dataKey="products" radius={[4, 4, 0, 0]}>
                  {regionStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === 'live' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Status Feed */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-bold font-display mb-4">Rollout Status</h3>
          <div className="space-y-4">
            {(regions || []).slice(0, 5).map((region, idx) => (
              <div key={region.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {region.code}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{region.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Activity className="w-3 h-3" /> System healthy
                    </p>
                  </div>
                </div>
                <StatusBadge status={region.status} />
              </div>
            ))}
          </div>
          <Link href="/regions" className="mt-6 flex items-center justify-center w-full py-2.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors border border-dashed border-primary/20">
            View All Regions <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
