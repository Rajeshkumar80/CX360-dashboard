import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ComplaintList from '../components/complaints/ComplaintList';
import { useComplaints } from '../hooks/useComplaints';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/common/Badge';

const Complaints = () => {
  const { complaints, loading } = useComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || complaint.status === filterStatus;
    const matchesSeverity = filterSeverity === 'All' || complaint.severity === filterSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neon-blue mb-2">Complaints</h1>
        <p className="text-text-secondary">
          Manage and track all customer complaints
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/30 transition-all duration-200"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-secondary" />
          {['All', 'Open', 'In Progress', 'Resolved'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterStatus === status
                  ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/50'
                  : 'bg-dark-700 text-text-secondary hover:text-text-primary border border-transparent'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          {['All', 'High', 'Medium', 'Low'].map(severity => (
            <button
              key={severity}
              onClick={() => setFilterSeverity(severity)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterSeverity === severity
                  ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/50'
                  : 'bg-dark-700 text-text-secondary hover:text-text-primary border border-transparent'
              }`}
            >
              {severity}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2">
        <Badge variant="info">{filteredComplaints.length}</Badge>
        <span className="text-text-secondary text-sm">complaints found</span>
      </div>

      {/* Complaint List */}
      {filteredComplaints.length > 0 ? (
        <ComplaintList complaints={filteredComplaints} />
      ) : (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg">No complaints found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Complaints;
