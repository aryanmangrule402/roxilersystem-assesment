// src/pages/Auth/Register.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validationSchemas';
import { register as authRegister } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import '../../index.css';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    // If you want to set a default value for the role in the form initially
    // defaultValues: {
    //   role: 'normal_user', // This should match a value in your enum
    // }
  });
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setApiError(null);
    setSuccessMessage(null);
    try {
      // The data object now includes the 'role' because of the schema and form field
      await authRegister(data);
      setSuccessMessage('Registration successful! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>
        {apiError && <div className="alert error">{apiError}</div>}
        {successMessage && <div className="alert success">{successMessage}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" {...register('name')} />
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" {...register('email')} />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea id="address" {...register('address')}></textarea>
            {errors.address && <p className="error-message">{errors.address.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" {...register('password')} />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>

          {/* NEW: Role Selection Field */}
            <div className="form-group">
      <label htmlFor="role">Register As:</label>
      <select id="role" {...register('role')}>
        <option value="normal_user">Normal User</option>
        <option value="store_owner">Shop Owner</option>
        <option value="system_admin">System Administrator</option> {/* <--- ADD THIS OPTION */}
      </select>
      {errors.role && <p className="error-message">{errors.role.message}</p>}
    </div>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;