import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '@/redux/authSlice';
import { Button } from './ui/button';
import { USER_API } from './utils/constant';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(store => store.auth);

    const handleLogout = async () => {
        try {
            const res = await axios.get(`${USER_API}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(logoutSuccess());
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    // console.log(user);

    return (
        <nav className="w-64 h-screen bg-slate-700 text-white fixed top-0 left-0 flex flex-col p-4">
            {/* Logo and Links Section */}
            <div>
                <h1 className="text-2xl cursor-pointer font-bold mb-8" onClick={()=>navigate('/')}>Todo<span className="text-[#F83002]">App</span></h1>
            </div>
            {/* Links Section */}
            {isAuthenticated ? (
                <div className="flex flex-col gap-4">
                    <Link to={'/todos/today'} className="text-lg">Today</Link>
                    <Link to={"todos/upcoming"} className="text-lg">Upcoming</Link>
                    <Link to="/todos/completed" className="text-lg">Completed</Link>
                    <Link to="/todos/pending" className="text-lg">Pending</Link>
                </div>
            ) : null}

            {/* Login/Signup or Profile Section */}
            <div className="mt-auto">
                {!isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                        <Link to="/login">
                            <Button className="bg-[#000000] hover:bg-[#1a5aba] w-full">Login</Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="bg-[#000000] hover:bg-[#1a5aba] w-full">Signup</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 cursor-pointer">
                        <LogOut />
                        <Button onClick={handleLogout} variant="link" className="bg-[#000000] hover:bg-[#1a5aba] w-full text-white">Logout</Button>
                    </div>
                )}
            </div>
        </nav>

    );
};

export default Navbar;
