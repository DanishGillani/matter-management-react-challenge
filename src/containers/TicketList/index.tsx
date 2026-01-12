import { useState, useEffect } from 'react';
import { useTicketList } from './hooks/useTicketList';
import TicketCard from './components/TicketCard';

/**
 * COMMIT 2: Fixed circular useEffect dependencies and derived state
 * 
 * Changes:
 * - Removed Effects 3 & 4 (circular dependency: Effect 3 updates count → Effect 4 triggers selection)
 * - Converted notificationCount from state to derived state (calculated in render)
 * - Removed Effect 2 (unnecessary refetch call - React Query handles via query key change)
 * - Moved Effect 5 success logging to single effect on tickets change
 * 
 * Why:
 * - Derived state prevents circular dependencies by eliminating state updates
 * - Calculating in render ensures single source of truth (tickets data)
 * - Single effect on tickets change for side effects (cleaner than circular effects)
 * 
 * Trade-offs:
 * - notificationCount recalculates every render (negligible cost for simple filter)
 * - Can't auto-select first ticket based on notification threshold (wasn't a real feature)
 * - Lost time-travel debugging for filter state (acceptable for this use case)
 */
const TicketList = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Query hook for fetching tickets
  const { data: tickets, isLoading } = useTicketList({
    status: filterStatus === 'all' ? undefined : filterStatus,
  });

  // Derived state: Calculate notification count in render, don't store in state
  // This is computed from tickets data (single source of truth)
  const notificationCount = tickets?.filter((t) => !t.read).length ?? 0;

  // Single effect for success side effect (replaces circular Effects 3, 4, 5)
  useEffect(() => {
    if (tickets && tickets.length > 0) {
      console.log(`Tickets loaded successfully! Total: ${tickets.length}`);
    }
  }, [tickets]);

  if (isLoading) {
    return <div>Loading tickets...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Ticket List</h1>
      <div>
        <label>
          Filter:
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <p>Notifications: {notificationCount}</p>
      </div>
      <div>
        {tickets?.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            isSelected={selectedTicketId === ticket.id}
            onClick={() => setSelectedTicketId(ticket.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketList;
