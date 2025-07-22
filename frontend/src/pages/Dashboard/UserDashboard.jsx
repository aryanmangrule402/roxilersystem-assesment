// src/pages/Dashboards/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { getAllStores, submitRating, modifyRating } from '../../api/userApi';
import useAuth from '../../hooks/useAuth';
import Table from '../../components/Table';
import StarRating from '../../components/StarRating';
import Spinner from '../../components/Spinner';
import '../../index.css';
import { calculateAverageRating } from '../../utils/helpers';

const UserDashboard = () => {
  const { getUserId } = useAuth();
  const currentUserId = getUserId();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [message, setMessage] = useState('');

  const fetchStores = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllStores(filters);
      setStores(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearch = () => {
    fetchStores({ name: searchTerm, address: searchAddress });
  };

  const handleRatingChange = async (storeId, newRating) => {
    setMessage('');
    try {
      // Find the store to check if the user has already rated it
      const store = stores.find(s => s.id === storeId);
      const userRating = store?.Ratings?.find(r => r.userId === currentUserId);

      let response;
      if (userRating) {
        // User has already rated, so modify
        response = await modifyRating(storeId, newRating);
        setMessage(`Rating for ${store.name} updated to ${newRating} stars.`);
      } else {
        // User has not rated, so submit new rating
        response = await submitRating(storeId, newRating);
        setMessage(`Rating ${newRating} stars submitted for ${store.name}.`);
      }

      // Optimistically update the UI or refetch data
      fetchStores({ name: searchTerm, address: searchAddress });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit/modify rating.');
    }
  };

  const columns = [
    { header: 'Store Name', key: 'name', sortable: true },
    { header: 'Address', key: 'address', sortable: true },
    {
      header: 'Overall Rating',
      key: 'overallRating',
      render: (store) => {
        const avgRating = calculateAverageRating(store.Ratings);
        return avgRating > 0 ? `${avgRating} / 5` : 'N/A';
      }
    },
    {
      header: 'Your Rating',
      key: 'userRating',
      render: (store) => {
        const userRating = store.Ratings?.find(r => r.userId === currentUserId);
        return userRating ? (
          <StarRating
            rating={userRating.rating}
            editable={true}
            onRatingChange={(newRating) => handleRatingChange(store.id, newRating)}
          />
        ) : (
          <StarRating
            rating={0}
            editable={true}
            onRatingChange={(newRating) => handleRatingChange(store.id, newRating)}
          />
        );
      }
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (store) => {
        const userRating = store.Ratings?.find(r => r.userId === currentUserId);
        return userRating ? (
          <button onClick={() => alert(`Modify rating for ${store.name}`)} style={{ padding: '0.5rem', fontSize: '0.8rem' }}>Modify Rating</button>
        ) : (
          <button onClick={() => alert(`Submit rating for ${store.name}`)} style={{ padding: '0.5rem', fontSize: '0.8rem' }}>Submit Rating</button>
        );
        // Note: The buttons are illustrative. The StarRating component itself handles the click for rating change.
        // You might consider a separate "Submit/Update" button if you want to confirm before sending to API.
      }
    }
  ];

  if (loading) return <Spinner />;
  if (error) return <div className="container alert error">{error}</div>;

  return (
    <div className="container">
      <h2>Normal User Dashboard - Stores</h2>

      <div className="filter-section">
        <div className="form-group">
          <label htmlFor="searchTerm">Search by Name:</label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Store Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="searchAddress">Search by Address:</label>
          <input
            type="text"
            id="searchAddress"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder="Store Address"
          />
        </div>
        <button onClick={handleSearch}>Search Stores</button>
        <button onClick={() => { setSearchTerm(''); setSearchAddress(''); fetchStores(); }}>Clear Filters</button>
      </div>

      {message && <div className="alert success">{message}</div>}

      <Table data={stores} columns={columns} title="All Stores" />
    </div>
  );
};

export default UserDashboard;