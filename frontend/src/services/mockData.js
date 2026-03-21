export const mockInboxMessages = [
  {
    id: 'MSG-001', source: 'Email', from: 'john.smith@email.com', customerName: 'John Smith',
    subject: 'Double Charge on Credit Card',
    message: 'I was charged twice for the same transaction on my credit card last Thursday. Order #12847. This is unacceptable and I need an immediate refund. I have been a loyal customer for 3 years and this is very disappointing.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), processed: false,
  },
  {
    id: 'MSG-002', source: 'Live Chat', from: 'sarah.j@email.com', customerName: 'Sarah Johnson',
    subject: 'Damaged Product Received',
    message: 'Hi, I just received my order and the product packaging was completely crushed. The item inside is broken and unusable. Order #13201. I need a replacement sent ASAP please.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), processed: false,
  },
  {
    id: 'MSG-003', source: 'Website Form', from: 'mike.chen@email.com', customerName: 'Mike Chen',
    subject: 'App Payment Crash Issue',
    message: 'Your mobile app keeps crashing every time I try to complete a payment. I have tried reinstalling, clearing cache, and updating but nothing works. This has been going on for a week now. Very frustrating.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), processed: false,
  },
  {
    id: 'MSG-004', source: 'Email', from: 'emily.d@email.com', customerName: 'Emily Davis',
    subject: 'Package Stuck in Transit',
    message: 'My package has been stuck in transit for 5 days now. Tracking number #TRK9928371. There are no updates and I really need this delivery by Friday for an important event. Please escalate this.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), processed: false,
  },
  {
    id: 'MSG-005', source: 'Live Chat', from: 'robert.w@email.com', customerName: 'Robert Wilson',
    subject: 'Refund Not Received',
    message: 'I returned a product 2 weeks ago and was told the refund would be processed in 5-7 business days. It has been 14 days and I still have not received my refund of $149.99. Please look into this immediately.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), processed: false,
  },
];

export const mockAnalytics = {
  totalToday: 23,
  totalWeek: 147,
  totalMonth: 589,
  byCategory: [
    { name: 'Billing', count: 156 },
    { name: 'Technical', count: 132 },
    { name: 'Delivery', count: 118 },
    { name: 'Refund', count: 98 },
    { name: 'General', count: 85 },
  ],
  bySource: [
    { name: 'Email', count: 210 },
    { name: 'Live Chat', count: 175 },
    { name: 'Website Form', count: 120 },
    { name: 'Phone', count: 55 },
    { name: 'Walk-in', count: 29 },
  ],
  bySentiment: [
    { name: 'Negative', value: 52, color: '#ef4444' },
    { name: 'Neutral', value: 31, color: '#eab308' },
    { name: 'Positive', value: 17, color: '#22c55e' },
  ],
  byPriority: [
    { name: 'Urgent', count: 45, color: '#ef4444' },
    { name: 'High', count: 120, color: '#ff6600' },
    { name: 'Medium', count: 250, color: '#eab308' },
    { name: 'Low', count: 174, color: '#22c55e' },
  ],
};

export const mockComplaintsLog = [
  { id: 'C-001', customer: 'John Smith', category: 'Billing', source: 'Email', sentiment: 'Negative', priority: 'High', status: 'Resolved', date: '2024-01-15', summary: 'Double charge on credit card' },
  { id: 'C-002', customer: 'Sarah Johnson', category: 'Delivery', source: 'Live Chat', sentiment: 'Negative', priority: 'Medium', status: 'In Progress', date: '2024-01-15', summary: 'Damaged product received' },
  { id: 'C-003', customer: 'Mike Chen', category: 'Technical', source: 'Website Form', sentiment: 'Negative', priority: 'High', status: 'Open', date: '2024-01-14', summary: 'App payment crash' },
  { id: 'C-004', customer: 'Emily Davis', category: 'Delivery', source: 'Email', sentiment: 'Negative', priority: 'Urgent', status: 'Open', date: '2024-01-14', summary: 'Package stuck in transit' },
  { id: 'C-005', customer: 'Robert Wilson', category: 'Refund', source: 'Live Chat', sentiment: 'Negative', priority: 'High', status: 'In Progress', date: '2024-01-13', summary: 'Refund not received after 14 days' },
  { id: 'C-006', customer: 'Lisa Park', category: 'Billing', source: 'Phone', sentiment: 'Neutral', priority: 'Low', status: 'Resolved', date: '2024-01-13', summary: 'Invoice discrepancy question' },
  { id: 'C-007', customer: 'David Kim', category: 'General', source: 'Website Form', sentiment: 'Positive', priority: 'Low', status: 'Resolved', date: '2024-01-12', summary: 'Feature suggestion for mobile app' },
  { id: 'C-008', customer: 'Anna White', category: 'Technical', source: 'Email', sentiment: 'Negative', priority: 'Medium', status: 'Resolved', date: '2024-01-12', summary: 'Login issues on new browser' },
];
