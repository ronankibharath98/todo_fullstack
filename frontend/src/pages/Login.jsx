import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '@/redux/authSlice';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { USER_API } from '@/components/utils/constant';
import { set } from 'mongoose';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  
  const { isAuthenticated, user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const data = { email, password };    
    
    try {
      setLoading(true); // Start loading state
      const response = await axios.post(`${USER_API}/login`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // This allows cookies to be sent
      });

      console.log(response.data);
      
      if (response.data.success) {
        dispatch(loginSuccess(response.data.user));
        navigate('/');
      } else {
        setError('Invalid login credentials');
        setLoading(false); // Reset loading state on failure
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError('An unexpected error occurred');
        toast.error('An unexpected error occurred');
      }
    } setLoading(false); // Reset loading state
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate])
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="w-full max-w-md bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          {
            isAuthenticated ? <Button
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait </Button>
              :
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors">
                Login
              </button>
          }

        </form>
      </div>
    </div>
  );
};

export default Login;
