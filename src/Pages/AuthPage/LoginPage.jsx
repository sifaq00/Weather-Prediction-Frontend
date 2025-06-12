import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx'; 
import { Toast, ToastContainer } from '../../components/ui/Toast.jsx';
import logo from '../../assets/LOGO.png'; 

export function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await login(username, password);
        } catch (err) {
            setError(err.error || 'Terjadi kesalahan saat login.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-sky-50">
            <div className="w-full max-w-md p-8 m-4 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-200">
                <div className="text-center">
                    <img src={logo} alt="WeatherWise Logo" className="w-20 h-20 mx-auto mb-4 rounded-full" />
                    <h1 className="text-3xl font-bold text-sky-600">Welcome Back!</h1>
                    <p className="mt-2 text-gray-500">
                        Sign in to continue to WeatherWise.
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
                        placeholder="Enter your username"
                        autoComplete="username"
                    />
                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                    <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                        Login
                    </Button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="font-medium text-sky-600 hover:underline">
                        Register now
                    </Link>
                </p>
            </div>
            <ToastContainer>
                {error && <Toast message={error} variant="error" onClose={() => setError(null)} />}
            </ToastContainer>
        </div>
    );
}