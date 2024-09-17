import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_API } from '@/components/utils/constant';
import { toast } from 'sonner';
import { loginSuccess } from '@/redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [name, setFullname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { isAuthenticated, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !phoneNumber || !password) {
            setError('Please fill in all fields');
            return;
        }
        const data = {
            name,
            email,
            phoneNumber,
            password
        };
        console.log(data);
        try {
            setLoading(true);
            const response = await axios.post(`${USER_API}/register`, data, {
                withCredentials: true,
            });
            if (response.data.success) {
                navigate('/login');
            } else {
                setError('Registration failed, try again');
            }
        } catch (err) {
            setError('Server error, please try again later');
            toast.error(error.response.data.message);
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-black">
            <div className="w-full max-w-md bg-white p-8 rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setFullname(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>
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
                        <label className="block mb-2 text-sm font-medium">Phone Number</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
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
                                Sign up
                            </button>
                    }
                </form>
            </div>
        </div>
    );
};

export default Register;
