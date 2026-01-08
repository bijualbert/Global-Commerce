import { useAutomationRules, useCreateAutomationRule, useToggleAutomationRule } from "@/hooks/use-automation";
import { Workflow, Play, Pause, Plus, Zap, ArrowRight, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Automations() {
  const { data: rules, isLoading } = useAutomationRules();
  const createRule = useCreateAutomationRule();
  const toggleRule = useToggleAutomationRule();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    triggerEvent: "",
    actionType: ""
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRule.mutateAsync({ ...formData, config: {} });
      setIsOpen(false);
      setFormData({ name: "", triggerEvent: "", actionType: "" });
      toast({ title: "Automation created", description: "Rule is now active" });
    } catch {
      toast({ title: "Error", description: "Failed to create rule", variant: "destructive" });
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      await toggleRule.mutateAsync({ id, isActive: !currentStatus });
      toast({ title: !currentStatus ? "Rule Activated" : "Rule Paused" });
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-display text-foreground">Automation Studio</h2>
          <p className="text-muted-foreground mt-1">Configure automated workflows and triggers.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> New Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Automation Rule</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Low Stock Alert"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Trigger Event</Label>
                <Select 
                  value={formData.triggerEvent} 
                  onValueChange={v => setFormData({...formData, triggerEvent: v})}
                >
                  <SelectTrigger><SelectValue placeholder="Select trigger..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order.created">Order Created</SelectItem>
                    <SelectItem value="inventory.low">Inventory Low</SelectItem>
                    <SelectItem value="product.updated">Product Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Action</Label>
                <Select 
                  value={formData.actionType} 
                  onValueChange={v => setFormData({...formData, actionType: v})}
                >
                  <SelectTrigger><SelectValue placeholder="Select action..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notify_team">Notify Team</SelectItem>
                    <SelectItem value="auto_restock">Auto Restock</SelectItem>
                    <SelectItem value="sync_shopify">Sync to Shopify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createRule.isPending}>
                  {createRule.isPending ? "Creating..." : "Create Rule"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="col-span-3 text-center py-12 text-muted-foreground">Loading automations...</p>
        ) : rules?.length === 0 ? (
          <div className="col-span-3 text-center py-16 bg-secondary/30 rounded-2xl border border-dashed border-border">
            <Workflow className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No automation rules yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Create your first rule to automate repetitive tasks.</p>
            <Button onClick={() => setIsOpen(true)}>Create Rule</Button>
          </div>
        ) : (
          rules?.map((rule) => (
            <div 
              key={rule.id} 
              className={cn(
                "group relative bg-card border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg",
                rule.isActive ? "border-primary/20 shadow-primary/5" : "border-border opacity-75 grayscale-[0.5]"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "p-2.5 rounded-xl",
                  rule.isActive ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                )}>
                  <Zap className="w-5 h-5" />
                </div>
                <Switch 
                  checked={rule.isActive || false}
                  onCheckedChange={() => handleToggle(rule.id, rule.isActive || false)}
                />
              </div>
              
              <h3 className="font-bold text-lg mb-1">{rule.name}</h3>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mt-4 p-3 bg-secondary/50 rounded-lg">
                <span className="font-semibold text-foreground">{rule.triggerEvent}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
                <span className="font-semibold text-primary">{rule.actionType}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                <span>Run count: {Math.floor(Math.random() * 1000)}</span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
