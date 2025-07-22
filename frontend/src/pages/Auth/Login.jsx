// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validationSchemas';
import { login } from '../../api/authApi';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../../index.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setApiError(null);
    setSuccessMessage(null);
    try {
      const userData = await login(data);
      authLogin(userData); // Update AuthContext
      setSuccessMessage('Login successful!');

      // Redirect based on role
      switch (userData.role) {
        case 'system_admin':
          navigate('/admin/dashboard');
          break;
        case 'store_owner':
          navigate('/store-owner/dashboard');
          break;
        case 'normal_user':
          navigate('/user/stores');
          break;
        default:
          navigate('/'); // Fallback
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>
        {apiError && <div className="alert error">{apiError}</div>}
        {successMessage && <div className="alert success">{successMessage}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" {...register('email')} />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" {...register('password')} />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;