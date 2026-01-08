import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertProduct } from "@shared/routes";

export function useProducts(regionId?: string) {
  return useQuery({
    queryKey: [api.products.list.path, regionId],
    queryFn: async () => {
      const url = regionId 
        ? `${api.products.list.path}?regionId=${regionId}` 
        : api.products.list.path;
        
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch products');
      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertProduct) => {
      // Coerce numeric types just in case
      const payload = {
        ...data,
        inventoryCount: Number(data.inventoryCount),
        regionId: data.regionId ? Number(data.regionId) : undefined
      };
      
      const validated = api.products.create.input.parse(payload);
      const res = await fetch(api.products.create.path, {
        method: api.products.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.products.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create product');
      }
      return api.products.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.products.list.path] }),
  });
}
