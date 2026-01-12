/**
 * Centralized, type-safe query key factory for all ticket-related queries.
 * 
 * Benefits of this pattern:
 * - Single source of truth for all query keys
 * - Type-safe key generation
 * - Hierarchical structure matching data model
 * - Easy to find and manage all queries
 * - Prevents typos and key inconsistencies
 * 
 * Usage:
 * useQuery({
 *   queryKey: ticketKeys.list(),
 *   queryFn: fetchTickets,
 * })
 */

/**
 * Ticket-related query keys
 * Follows hierarchical pattern: ['tickets', resource, identifier, params]
 */
export const ticketKeys = {
  // Root key for all ticket queries
  all: () => ['tickets'] as const,
  
  // All list-related keys
  lists: () => [...ticketKeys.all(), 'list'] as const,
  
  // Specific list query with optional filters
  list: (filters?: { status?: string; search?: string; sortBy?: string }) =>
    [...ticketKeys.lists(), { filters }] as const,
  
  // All detail-related keys
  details: () => [...ticketKeys.all(), 'detail'] as const,
  
  // Specific ticket detail by ID
  detail: (id: string) => [...ticketKeys.details(), id] as const,
};

/**
 * User profile query keys
 */
export const userKeys = {
  // Root key for all user queries
  all: () => ['user'] as const,
  
  // Profile-specific keys
  profiles: () => [...userKeys.all(), 'profile'] as const,
  
  // Current user profile
  profile: () => [...userKeys.profiles()] as const,
};
