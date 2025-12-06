export default function LeadCard({ lead }) {
  return (
    <div style={{
      background: "#1f1f1f",
      color: "white",
      padding: "16px",
      borderRadius: "12px",
      marginBottom: "12px",
      border: "1px solid #333"
    }}>
      <h3>{lead.name}</h3>

      <p><strong>Email:</strong> {lead.email}</p>

      <p><strong>Interesse:</strong> {lead.interest}</p>

      <p><strong>Data:</strong> {new Date(lead.created_at).toLocaleString("pt-BR")}</p>
    </div>
  );
}
