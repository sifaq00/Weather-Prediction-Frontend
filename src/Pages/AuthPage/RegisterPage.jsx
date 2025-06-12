import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext.jsx';
import { Toast, ToastContainer } from '../../components/ui/Toast';
import logo from '../../assets/LOGO.png';

export function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successToast, setSuccessToast] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessToast(null);

        if (password.length < 6) {
            setError("Password minimal harus 6 karakter.");
            return;
        }

        setIsLoading(true);
        try {
            const data = await register(username, password);
            setSuccessToast(data.message || "Registrasi berhasil! Anda akan diarahkan ke halaman login.");

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.error || 'Terjadi kesalahan saat registrasi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-sky-50">
            <div className="w-full max-w-md p-8 m-4 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-200">
                <div className="text-center">
                    <img src={logo} alt="WeatherWise Logo" className="w-20 h-20 mx-auto mb-4 rounded-full"/>
                    <h1 className="text-3xl font-bold text-sky-600">Create an Account</h1>
                    <p className="mt-2 text-gray-500">
                        Join WeatherWise to get personalized predictions.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Username"
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Choose a username"
                        autoComplete="username"
                    />
                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Create a password (min. 6 characters)"
                        autoComplete="new-password"
                    />
                    <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                        Register
                    </Button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-sky-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
            <ToastContainer>
                {error && <Toast message={error} variant="error" onClose={() => setError(null)} />}
                {successToast && <Toast message={successToast} variant="success" onClose={() => setSuccessToast(null)} />}
            </ToastContainer>
        </div>
    );
}