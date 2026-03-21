import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

export const formatDateTime = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (dateString) => {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

export const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const formatPercentage = (num) => {
  return `${num.toFixed(1)}%`;
};
