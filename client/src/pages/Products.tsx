import { useState } from "react";
import { useProducts, useCreateProduct } from "@/hooks/use-products";
import { useRegions } from "@/hooks/use-regions";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Search, Filter, Box } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

export default function Products() {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const { data: products, isLoading } = useProducts(selectedRegion || undefined);
  const { data: regions } = useRegions();
  const createProduct = useCreateProduct();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    shopifyId: "",
    price: "",
    currency: "USD",
    regionId: "",
    inventoryCount: "0"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct.mutateAsync({
        ...formData,
        shopifyId: formData.shopifyId || `shp_${Math.random().toString(36).substr(2, 9)}`,
        status: "active",
        regionId: formData.regionId ? parseInt(formData.regionId) : undefined,
        inventoryCount: parseInt(formData.inventoryCount)
      });
      setIsOpen(false);
      setFormData({ title: "", handle: "", shopifyId: "", price: "", currency: "USD", regionId: "", inventoryCount: "0" });
      toast({ title: "Product created", description: "Successfully added to catalog" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to create product", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-foreground">Products</h2>
          <p className="text-muted-foreground mt-1">Manage global product catalog and inventory.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title</Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Winter Jacket"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="handle">Handle</Label>
                  <Input 
                    id="handle" 
                    value={formData.handle} 
                    onChange={e => setFormData({...formData, handle: e.target.value})}
                    placeholder="winter-jacket"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input 
                    id="price" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="99.99"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={formData.currency} 
                    onValueChange={v => setFormData({...formData, currency: v})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inventory">Initial Inventory</Label>
                <Input 
                  id="inventory" 
                  type="number"
                  value={formData.inventoryCount} 
                  onChange={e => setFormData({...formData, inventoryCount: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select 
                  value={formData.regionId} 
                  onValueChange={v => setFormData({...formData, regionId: v})}
                >
                  <SelectTrigger><SelectValue placeholder="Select region..." /></SelectTrigger>
                  <SelectContent>
                    {regions?.map(r => (
                      <SelectItem key={r.id} value={r.id.toString()}>{r.name} ({r.code})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createProduct.isPending}>
                  {createProduct.isPending ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select 
            className="bg-card border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">All Regions</option>
            {regions?.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Inventory</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Loading products...
                  </td>
                </tr>
              ) : products?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <Box className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    No products found in this region.
                  </td>
                </tr>
              ) : (
                products?.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                          <Box className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{product.title}</p>
                          <p className="text-xs text-muted-foreground font-mono">{product.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {regions?.find(r => r.id === product.regionId)?.code || 'Global'}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {product.price} {product.currency}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={product.inventoryCount === 0 ? 'text-red-500' : 'text-foreground'}>
                          {product.inventoryCount}
                        </span>
                        {product.inventoryCount < 10 && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded">Low</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:underline text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
