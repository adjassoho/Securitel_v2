import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { historyService } from '@/services/api';
import { CSVLink } from 'react-csv';
import type { HistoryItem } from '@/types';

const HistoryPage = () => {
    const { user } = useAuthStore();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<{ from?: string; to?: string; type?: string }>({
        from: '',
        to: '',
        type: ''
    });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const result = await historyService.getHistory(filters);
                setHistory(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [filters, user?.id]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="history-page">
            <h1>History</h1>
            <div className="filters">
                <input type="date" name="from" value={filters.from} onChange={handleFilterChange} />
                <input type="date" name="to" value={filters.to} onChange={handleFilterChange} />
                <input type="text" name="type" placeholder="Action Type" value={filters.type} onChange={handleFilterChange} />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Phone</th>
                        <th>Description</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map(item => (
                        <tr key={item.id}>
                            <td>{item.created_at}</td>
                            <td>{item.action_type}</td>
                            <td>{item.phone_imei || '-'}</td>
                            <td>{item.description}</td>
                            <td>-</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <CSVLink data={history} filename={`history-${user?.id || 'export'}.csv`}>
                Export to CSV
            </CSVLink>
        </div>
    );
};

export default HistoryPage;
