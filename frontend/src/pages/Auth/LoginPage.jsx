import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Monitor } from 'lucide-react'; // Hapus Lock dan User
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useAuth from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const { login, auth, loading } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (!loading && auth?.accessToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [auth, loading, navigate]);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setErrorMessage('Wrong email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <div className="z-10 flex flex-col items-center mb-8">
        <div className="bg-teal-50 p-3 rounded-xl mb-3">
          <Monitor className="w-10 h-10 text-teal-700" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          AI Learning Insight
        </h1>
      </div>
      {/* Mengubah Card shadow dan padding */}
      <Card className="w-full max-w-md shadow-2xl border-2 border-teal-500/20 z-10 rounded-3xl p-6">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-3xl font-extrabold text-center text-gray-800">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 pt-8">
          {errorMessage && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md text-center border border-red-100">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* input email */}
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium ml-1" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="enter your email address"
                // Menghapus pl-10 karena ikon dihapus
                className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-teal-600"
                value={formData.email}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>

            {/* input password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-gray-600 font-medium ml-1"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="enter your password"
                  // Menghapus pl-10
                  className="pr-10 h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-teal-600"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold rounded-xl bg-teal-700 hover:bg-teal-800 transition-colors shadow-lg shadow-teal-700/20"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="text-center text-sm text-gray-600 mt-4">
            didn't have an account?{' '}
            <Link
              to="/register"
              className="text-teal-600 hover:underline font-medium"
            >
              sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
