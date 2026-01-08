import { useRegions, useCreateRegion } from "@/hooks/use-regions";
import { Globe, MapPin, Plus } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Regions() {
  const { data: regions, isLoading } = useRegions();
  const createRegion = useCreateRegion();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "planned"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRegion.mutateAsync(formData);
      setIsOpen(false);
      setFormData({ name: "", code: "", status: "planned" });
      toast({ title: "Region added", description: "New market configured" });
    } catch {
      toast({ title: "Error", description: "Failed to add region", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-display text-foreground">Global Markets</h2>
          <p className="text-muted-foreground mt-1">Status of international rollout across 13 countries.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> Add Region
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Region</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Region Name</Label>
                  <Input 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Germany"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country Code</Label>
                  <Input 
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    placeholder="DE"
                    maxLength={2}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={v => setFormData({...formData, status: v})}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="beta">Beta</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createRegion.isPending}>
                  {createRegion.isPending ? "Adding..." : "Add Region"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <p className="col-span-4 text-center text-muted-foreground">Loading regions...</p>
        ) : (
          regions?.map((region, idx) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe className="w-24 h-24 text-primary rotate-12 transform translate-x-8 -translate-y-8" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-lg text-primary">
                    {region.code}
                  </div>
                  <StatusBadge status={region.status} />
                </div>
                
                <h3 className="text-xl font-bold mb-1">{region.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> 
                  Store ID: GM-{region.code}-00{region.id}
                </p>

                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Products</span>
                    <span className="font-medium text-foreground">{Math.floor(Math.random() * 50) + 10}</span>
                  </div>
                  <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.random() * 60 + 20}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
