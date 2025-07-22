// Hypothetical src/hooks/useAuth.js
import { AuthContext } from '../context/AuthContext.jsx';
import { useContext } from 'react';

const useAuthInternal = () => {
    return useContext(AuthContext);
};

export default useAuthInternal; // Or `export { useAuthInternal };`