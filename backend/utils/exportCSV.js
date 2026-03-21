export function exportToCSV(complaints) {
  const headers = [
    'Case ID', 'Source', 'Customer Name', 'Customer ID', 'Customer Contact',
    'Category', 'Sentiment', 'Priority', 'Severity Score', 'Confidence',
    'Status', 'SLA Status', 'Regulatory Flag', 'Escalated', 'Escalation Reason',
    'Resolution Note', 'Created At', 'Resolved At', 'Message',
  ];

  const escapeCSV = (val) => {
    if (val == null) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = complaints.map(c => [
    c.caseId,
    c.source,
    c.customerName,
    c.customerId,
    c.customerContact,
    c.category,
    c.sentiment,
    c.priority,
    c.severityScore,
    c.confidence,
    c.status,
    c.slaStatus,
    c.regulatoryFlag,
    c.shouldEscalate ? 'Yes' : 'No',
    c.escalationReason,
    c.resolutionNote,
    c.createdAt ? new Date(c.createdAt).toISOString() : '',
    c.resolvedAt ? new Date(c.resolvedAt).toISOString() : '',
    c.rawMessage,
  ].map(escapeCSV).join(','));

  return [headers.join(','), ...rows].join('\n');
}
