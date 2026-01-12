/**
 * LEGACY CODE - This is intentionally messy!
 * 
 * Your task: Refactor this to follow modern patterns:
 * 1. Move to pages/ directory structure
 * 2. Remove unnecessary useMemo/useCallback
 * 3. Fix useEffect circular dependencies
 * 4. Set up proper React Query key management
 * 5. Extract shareable hooks and utilities
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import TicketList from '../../components/TicketList';
import TicketDetail from '../../components/TicketDetail';
import { fetchTickets, fetchTicketById } from '../../utils/api';
import { ticketKeys } from '../../api/tickets/queryKeys';

/**
 * COMMIT 3: Remove premature optimizations from TicketsPage
 * 
 * Changes:
 * - Removed useMemo for memoizedSearchQuery (string operations are cheap)
 * - Removed all useCallback handlers (not passed to memoized components)
 * - Removed useMemo for filteredTickets (API already handles filtering via query params)
 * - Removed circular useEffect that triggers refetch (queryKey change triggers refetch automatically)
 * - Simplified URL param sync - single effect with minimal dependencies
 * - Removed unused commented useMemo for selectedTicket
 * - Removed unnecessary useEffect for ticket detail success logging
 * - Added debounced search to prevent API call on every keystroke
 * 
 * Why:
 * - The API already filters/sorts via query params - don't need frontend memoization
 * - Simple event handlers to native elements don't need memoization
 * - React Query automatically refetches when queryKey changes
 * - Debouncing improves UX by not fetching on every keystroke
 * 
 * Trade-offs:
 * - Slight delay in search results (300ms debounce) - acceptable for better UX
 * - Handler function references change on every render (acceptable for non-memoized children)
 * - No memoized computations (benefit: cleaner code, less complexity)
 */
const TicketsPage = () => {
  const { ticketId } = useParams<{ ticketId?: string }>();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  // Debounce search input - only update query after user stops typing (300ms)
  // This prevents API calls on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch tickets - API handles filtering/sorting via queryKey
  // No need to filter in frontend when server already does this
  const { data: ticketsData, isLoading } = useQuery({
    // Use centralized query key factory
    queryKey: ticketKeys.list({ 
      search: searchQuery, 
      status: filterStatus, 
      sortBy 
    }),
    queryFn: () => fetchTickets({ 
      search: searchQuery, 
      status: filterStatus, 
      sortBy 
    }),
  });

  // Sync URL param (ticketId) to selected state
  useEffect(() => {
    if (ticketId) {
      setSelectedTicketId(ticketId);
    }
  }, [ticketId]);

  // Fetch ticket detail when selected
  const { data: ticketDetail, isLoading: isLoadingDetail } = useQuery({
    // Use centralized query key factory
    queryKey: ticketKeys.detail(selectedTicketId!),
    queryFn: () => fetchTicketById(selectedTicketId!),
    enabled: !!selectedTicketId,
  });

  if (isLoading && !ticketsData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '40%', borderRight: '1px solid #ccc', padding: '20px' }}>
        <h1>Tickets</h1>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <TicketList
            tickets={ticketsData || []}
            onSelect={setSelectedTicketId}
            selectedId={selectedTicketId}
          />
        )}
      </div>
      <div style={{ width: '60%', padding: '20px' }}>
        {selectedTicketId && !isLoadingDetail ? (
          <TicketDetail ticketId={selectedTicketId} ticketDetail={ticketDetail} />
        ) : selectedTicketId && isLoadingDetail ? (
          <div>Loading ticket details...</div>
        ) : (
          <div>Select a ticket to view details</div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
