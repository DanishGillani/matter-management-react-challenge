import { Routes, Route } from 'react-router-dom';
import TicketsPage from './pages/tickets';
import TicketList from './pages/ticket-list';
import TicketFilters from './components/tickets/TicketFilters';
import UserProfile from './pages/user-profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TicketsPage />} />
      <Route path="/tickets" element={<TicketsPage />} />
      <Route path="/tickets/:ticketId" element={<TicketsPage />} />
      <Route path="/ticket-list" element={<TicketList />} />
      <Route path="/ticket-filters" element={<TicketFilters />} />
      <Route path="/user-profile" element={<UserProfile />} />
    </Routes>
  );
}

export default App;
