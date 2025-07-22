// src/pages/Dashboards/StoreOwnerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { getStoreOwnerDashboard } from '../../api/storeOwnerApi';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import '../../index.css';
import { calculateAverageRating } from '../../utils/helpers';

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStoreOwnerDashboard();
        setDashboardData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div className="container alert error">{error}</div>;
  if (!dashboardData) return <div className="container"><p>No dashboard data available.</p></div>;

  const { store, ratingsGiven, averageRating } = dashboardData;

  const ratingColumns = [
    { header: 'User Name', key: 'user.name', render: (row) => row.user.name, sortable: true },
    { header: 'User Email', key: 'user.email', render: (row) => row.user.email, sortable: true },
    { header: 'Rating', key: 'rating', sortable: true },
    { header: 'Submitted At', key: 'createdAt', render: (row) => new Date(row.createdAt).toLocaleDateString(), sortable: true },
  ];

  return (
    <div className="container">
      <h2>Store Owner Dashboard</h2>
      <div className="card">
        <h3>Your Store: {store?.name}</h3>
        <p><strong>Address:</strong> {store?.address}</p>
        <p><strong>Average Rating:</strong> {averageRating !== null ? `${averageRating} / 5` : 'N/A'}</p>
      </div>

      <Table data={ratingsGiven || []} columns={ratingColumns} title="Users Who Rated Your Store" />
    </div>
  );
};

export default StoreOwnerDashboard;