import { Ticket } from '../../utils/api';

interface TicketDetailProps {
  ticketDetail: Ticket | undefined;
}

const TicketDetail = ({ ticketDetail }: TicketDetailProps) => {
  // No need for useState or useEffect - just use the prop directly
  // The parent component (TicketsPage) handles the data fetching via React Query

  if (!ticketDetail) {
    return <div>Loading ticket details...</div>;
  }

  return (
    <div>
      <h2>{ticketDetail.title}</h2>
      <div style={{ marginTop: '20px' }}>
        <p><strong>Status:</strong> {ticketDetail.status}</p>
        <p><strong>Created:</strong> {new Date(ticketDetail.createdAt).toLocaleString()}</p>
        <p><strong>Description:</strong></p>
        <p>{ticketDetail.description || 'No description available'}</p>
      </div>
    </div>
  );
};

export default TicketDetail;