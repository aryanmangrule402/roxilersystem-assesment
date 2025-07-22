// src/pages/Dashboards/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, storeSchema } from '../../utils/validationSchemas';
import { getAdminDashboardStats, addStore, addUser, getAllUsers, getAllStores } from '../../api/admin';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import '../../index.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Form hooks for adding user/store
  const { register: registerUserForm, handleSubmit: handleAddUserSubmit, formState: { errors: userErrors }, reset: resetUserForm } = useForm({
    resolver: zodResolver(userSchema),
  });
  const { register: registerStoreForm, handleSubmit: handleAddStoreSubmit, formState: { errors: storeErrors }, reset: resetStoreForm } = useForm({
    resolver: zodResolver(storeSchema),
  });

  // Filter states
  const [userFilterName, setUserFilterName] = useState('');
  const [userFilterEmail, setUserFilterEmail] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('');

  const [storeFilterName, setStoreFilterName] = useState('');
  const [storeFilterEmail, setStoreFilterEmail] = useState('');
  const [storeFilterAddress, setStoreFilterAddress] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsData = await getAdminDashboardStats();
      setStats(statsData);
      // Fetch initial listings without filters
      await fetchUsers({});
      await fetchStores({});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (filters) => {
    try {
      const usersData = await getAllUsers(filters);
      setUsers(usersData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
    }
  };

  const fetchStores = async (filters) => {
    try {
      const storesData = await getAllStores(filters);
      setStores(storesData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stores.');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- Handlers for Add User/Store ---
  const handleAddUser = async (data) => {
    setMessage('');
    try {
      await addUser(data);
      setMessage('User added successfully!');
      resetUserForm();
      fetchDashboardData(); // Refresh data
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add user.');
    }
  };

  const handleAddStore = async (data) => {
    setMessage('');
    try {
      await addStore(data);
      setMessage('Store added successfully!');
      resetStoreForm();
      fetchDashboardData(); // Refresh data
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add store.');
    }
  };

  // --- Handlers for Filters ---
  const handleUserFilter = () => {
    const filters = {};
    if (userFilterName) filters.name = userFilterName;
    if (userFilterEmail) filters.email = userFilterEmail;
    if (userFilterRole) filters.role = userFilterRole;
    fetchUsers(filters);
  };

  const handleClearUserFilters = () => {
    setUserFilterName('');
    setUserFilterEmail('');
    setUserFilterRole('');
    fetchUsers({});
  };

  const handleStoreFilter = () => {
    const filters = {};
    if (storeFilterName) filters.name = storeFilterName;
    if (storeFilterEmail) filters.email = storeFilterEmail;
    if (storeFilterAddress) filters.address = storeFilterAddress;
    fetchStores(filters);
  };

  const handleClearStoreFilters = () => {
    setStoreFilterName('');
    setStoreFilterEmail('');
    setStoreFilterAddress('');
    fetchStores({});
  };

  // --- Table Column Definitions ---
  const userColumns = [
    { header: 'Name', key: 'name', sortable: true },
    { header: 'Email', key: 'email', sortable: true },
    { header: 'Address', key: 'address', sortable: false },
    { header: 'Role', key: 'role', sortable: true },
    { header: 'Store Rating', key: 'storeOwnerRating', render: (user) => (user.role === 'store_owner' && user.averageStoreRating !== null) ? `${user.averageStoreRating} / 5` : 'N/A' },
  ];

  const storeColumns = [
    { header: 'Store Name', key: 'name', sortable: true },
    { header: 'Email', key: 'email', sortable: true },
    { header: 'Address', key: 'address', sortable: false },
    { header: 'Overall Rating', key: 'overallRating', render: (store) => store.overallRating !== null ? `${store.overallRating} / 5` : 'N/A' },
  ];

  if (loading) return <Spinner />;
  if (error) return <div className="container alert error">{error}</div>;

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      {message && <div className="alert success">{message}</div>}

      {/* Stats Section */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>{stats?.totalUsers}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3>Total Stores</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>{stats?.totalStores}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3>Total Ratings</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>{stats?.totalRatings}</p>
        </div>
      </div>

      {/* Add User Section */}
      <div className="card">
        <h3>Add New User</h3>
        <form onSubmit={handleAddUserSubmit(handleAddUser)}>
          <div className="form-group">
            <label htmlFor="addUserName">Name</label>
            <input type="text" id="addUserName" {...registerUserForm('name')} />
            {userErrors.name && <p className="error-message">{userErrors.name.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="addUserEmail">Email</label>
            <input type="email" id="addUserEmail" {...registerUserForm('email')} />
            {userErrors.email && <p className="error-message">{userErrors.email.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="addUserPassword">Password</label>
            <input type="password" id="addUserPassword" {...registerUserForm('password')} />
            {userErrors.password && <p className="error-message">{userErrors.password.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="addUserAddress">Address</label>
            <textarea id="addUserAddress" {...registerUserForm('address')}></textarea>
            {userErrors.address && <p className="error-message">{userErrors.address.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="addUserRole">Role</label>
            <select id="addUserRole" {...registerUserForm('role')}>
              <option value="normal_user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="system_admin">System Admin</option>
            </select>
            {userErrors.role && <p className="error-message">{userErrors.role.message}</p>}
          </div>
          <button type="submit">Add User</button>
        </form>
      </div>

      {/* Add Store Section */}
  <div className="card">
                <h3>Add New Store & Owner</h3> {/* Updated title */}
                <form onSubmit={handleAddStoreSubmit(handleAddStore)}>
                    {/* Store Details */}
                    <h4>Store Information</h4>
                    <div className="form-group">
                        <label htmlFor="addStoreName">Store Name</label>
                        <input type="text" id="addStoreName" {...registerStoreForm('name')} placeholder="e.g., Green Grocer" />
                        {storeErrors.name && <p className="error-message">{storeErrors.name.message}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="addStoreEmail">Store Email</label>
                        <input type="email" id="addStoreEmail" {...registerStoreForm('email')} placeholder="store@example.com" />
                        {storeErrors.email && <p className="error-message">{storeErrors.email.message}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="addStoreAddress">Store Address</label>
                        <textarea id="addStoreAddress" {...registerStoreForm('address')} placeholder="123 Main St, City"></textarea>
                        {storeErrors.address && <p className="error-message">{storeErrors.address.message}</p>}
                    </div>

                    {/* Owner Details */}
                    <h4 style={{ marginTop: '1.5rem' }}>New Owner Information</h4>
                    <div className="form-group">
                        <label htmlFor="addOwnerName">Owner Name</label>
                        <input type="text" id="addOwnerName" {...registerStoreForm('ownerName')} placeholder="Owner's Full Name" />
                        {storeErrors.ownerName && <p className="error-message">{storeErrors.ownerName.message}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="addOwnerEmail">Owner Email</label>
                        <input type="email" id="addOwnerEmail" {...registerStoreForm('ownerEmail')} placeholder="owner@example.com" />
                        {storeErrors.ownerEmail && <p className="error-message">{storeErrors.ownerEmail.message}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="addOwnerPassword">Owner Password</label>
                        <input type="password" id="addOwnerPassword" {...registerStoreForm('ownerPassword')} placeholder="StrongPassword123" />
                        {storeErrors.ownerPassword && <p className="error-message">{storeErrors.ownerPassword.message}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="addOwnerAddress">Owner Address (Optional)</label>
     
                        <textarea id="addOwnerAddress" {...registerStoreForm('ownerAddress')} placeholder="Owner's Address"></textarea>
                        {storeErrors.ownerAddress && <p className="error-message">{storeErrors.ownerAddress.message}</p>}
                    </div>

                    <button type="submit">Add Store & Owner</button> {/* Updated button text */}
                </form>
            </div>

      {/* User Listings Section */}
      <div className="filter-section">
        <div className="form-group">
          <label htmlFor="userFilterName">Filter Users by Name:</label>
          <input
            type="text"
            id="userFilterName"
            value={userFilterName}
            onChange={(e) => setUserFilterName(e.target.value)}
            placeholder="User Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="userFilterEmail">Filter Users by Email:</label>
          <input
            type="email"
            id="userFilterEmail"
            value={userFilterEmail}
            onChange={(e) => setUserFilterEmail(e.target.value)}
            placeholder="User Email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="userFilterRole">Filter Users by Role:</label>
          <select id="userFilterRole" value={userFilterRole} onChange={(e) => setUserFilterRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="normal_user">Normal User</option>
            <option value="store_owner">Store Owner</option>
            <option value="system_admin">System Admin</option>
          </select>
        </div>
        <button onClick={handleUserFilter}>Apply Filters</button>
        <button onClick={handleClearUserFilters}>Clear Filters</button>
      </div>
      <Table data={users} columns={userColumns} title="All Users" />

      {/* Store Listings Section */}
      <div className="filter-section">
        <div className="form-group">
          <label htmlFor="storeFilterName">Filter Stores by Name:</label>
          <input
            type="text"
            id="storeFilterName"
            value={storeFilterName}
            onChange={(e) => setStoreFilterName(e.target.value)}
            placeholder="Store Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="storeFilterEmail">Filter Stores by Email:</label>
          <input
            type="email"
            id="storeFilterEmail"
            value={storeFilterEmail}
            onChange={(e) => setStoreFilterEmail(e.target.value)}
            placeholder="Store Email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="storeFilterAddress">Filter Stores by Address:</label>
          <input
            type="text"
            id="storeFilterAddress"
            value={storeFilterAddress}
            onChange={(e) => setStoreFilterAddress(e.target.value)}
            placeholder="Store Address"
          />
        </div>
        <button onClick={handleStoreFilter}>Apply Filters</button>
        <button onClick={handleClearStoreFilters}>Clear Filters</button>
      </div>
      <Table data={stores} columns={storeColumns} title="All Stores" />
    </div>
  );
};

export default AdminDashboard;