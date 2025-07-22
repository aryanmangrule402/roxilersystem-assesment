// src/pages/Auth/UpdatePassword.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePasswordSchema } from '../../utils/validationSchemas';
import { updatePassword as apiUpdatePassword } from '../../api/authApi';
import useAuth from '../../hooks/useAuth';
import '../../index.css';

const UpdatePassword = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(updatePasswordSchema),
  });
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { logout } = useAuth(); // Consider logging out after password change for security

  const onSubmit = async (data) => {
    setApiError(null);
    setSuccessMessage(null);
    try {
      await apiUpdatePassword(data);
      setSuccessMessage('Password updated successfully! Please log in again with your new password.');
      reset(); // Clear form fields
      // Optional: Force logout after password change
      setTimeout(() => {
        logout();
        window.location.href = '/login'; // Full reload to clear state
      }, 2000);
    } catch (error) {
      setApiError(error.response?.data?.message || 'Failed to update password. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Update Password</h2>
        {apiError && <div className="alert error">{apiError}</div>}
        {successMessage && <div className="alert success">{successMessage}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" {...register('currentPassword')} />
            {errors.currentPassword && <p className="error-message">{errors.currentPassword.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input type="password" id="newPassword" {...register('newPassword')} />
            {errors.newPassword && <p className="error-message">{errors.newPassword.message}</p>}
          </div>
          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;