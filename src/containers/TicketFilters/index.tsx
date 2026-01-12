import { useState } from 'react';

const TicketFilters = () => {
  const [filter, setFilter] = useState('all');
  const sortBy = 'date'; // Default sort - no setter needed since UI doesn't change it

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Ticket Filters</h1>
      <div>
        <label>
          Filter:
          <select value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <p>Current filter: {filter}</p>
        <p>Sort by: {sortBy}</p>
      </div>
    </div>
  );
};

export default TicketFilters;
