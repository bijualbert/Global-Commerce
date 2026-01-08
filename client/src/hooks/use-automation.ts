import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertAutomationRule } from "@shared/routes";

export function useAutomationRules() {
  return useQuery({
    queryKey: [api.automation.list.path],
    queryFn: async () => {
      const res = await fetch(api.automation.list.path, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch automation rules');
      return api.automation.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateAutomationRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAutomationRule) => {
      const validated = api.automation.create.input.parse(data);
      const res = await fetch(api.automation.create.path, {
        method: api.automation.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.automation.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create automation rule');
      }
      return api.automation.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.automation.list.path] }),
  });
}

export function useToggleAutomationRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const url = buildUrl(api.automation.toggle.path, { id });
      const res = await fetch(url, {
        method: api.automation.toggle.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 404) throw new Error('Rule not found');
        throw new Error('Failed to toggle rule');
      }
      return api.automation.toggle.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.automation.list.path] }),
  });
}
