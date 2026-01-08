import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertRegion } from "@shared/routes";

export function useRegions() {
  return useQuery({
    queryKey: [api.regions.list.path],
    queryFn: async () => {
      const res = await fetch(api.regions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch regions');
      return api.regions.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateRegion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertRegion) => {
      const validated = api.regions.create.input.parse(data);
      const res = await fetch(api.regions.create.path, {
        method: api.regions.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.regions.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create region');
      }
      return api.regions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.regions.list.path] }),
  });
}
