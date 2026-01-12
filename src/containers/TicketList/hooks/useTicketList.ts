import { useQuery } from '@tanstack/react-query';
import { getTicketKeys } from '../_api/queryKeys';

export interface Ticket {
  id: string;
  title: string;
  status: 'open' | 'closed';
  read: boolean;
}

interface UseTicketListParams {
  status?: string;
}

export const useTicketList = (params: UseTicketListParams = {}) => {
  return useQuery({
    queryKey: getTicketKeys.list(params.status),
    // queryFn with explicit Promise<Ticket[]> return type for TypeScript inference
    // Without this type annotation, TypeScript treats 'data' as unknown/{}
    // which causes "Property 'filter' does not exist on type '{}'" errors
    // in components that use: tickets?.filter(t => !t.read)
    queryFn: async (): Promise<Ticket[]> => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockTickets: Ticket[] = [
        { id: '1', title: 'Fix bug in login', status: 'open', read: false },
        { id: '2', title: 'Update documentation', status: 'open', read: true },
        { id: '3', title: 'Add new feature', status: 'closed', read: true },
      ];
      return mockTickets.filter(
        (t) => !params.status || t.status === params.status
      );
    },
  });
};