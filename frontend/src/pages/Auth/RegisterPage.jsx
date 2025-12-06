import React, { useState } from 'react';
import { Eye, EyeOff, User, Monitor, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { registerStudent, registerTeacher } from '@/lib/api/services/userService';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

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
      if (formData.role === 'student') {
        await registerStudent(formData);
        alert('Registrasi berhasil! Silakan login.');
      } else if (formData.role === 'teacher') {
        await registerTeacher(formData);
        alert('Pendaftaran mentor berhasil! Silakan login.');
      }
      navigate('/login');
    } catch (error) {
      console.error(error);
    
      setErrorMessage(error.message || 'Pendaftaran gagal. Periksa koneksi atau status server Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <div className="z-10 flex flex-col items-center mb-6">
        <div className="bg-teal-50 p-3 rounded-xl mb-3">
          <Monitor className="w-10 h-10 text-teal-700" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          AI Learning Insight
        </h1>
      </div>

      <Card className="w-full max-w-lg shadow-xl border-none z-10 rounded-3xl">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-3xl font-extrabold text-center text-gray-800">
            Sign up
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 pt-6">
          {errorMessage && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input Name */}
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium ml-1" htmlFor="name">
               Your Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Nama Anda"
                className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-teal-600"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Input Email */}
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium ml-1" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="enter your email"
                className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-teal-600"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Input Password */}
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
                  placeholder="enter password"
                  className="pr-10 h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-teal-600"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Select Role */}
            <div className="space-y-2">
              <Label className="text-gray-600 font-medium ml-1" htmlFor="role">
                Register as
              </Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="student">Student</option>
                <option value="teacher">Mentor</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold rounded-full bg-teal-700 hover:bg-teal-800 transition-colors shadow-lg shadow-teal-700/20"
              disabled={isLoading}
            >
              {isLoading ? 'Mendaftar...' : 'Daftar'}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-4">
            already have an account?{' '}
            <Link to="/login" className="text-teal-600 hover:underline font-medium">
              sign in
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;