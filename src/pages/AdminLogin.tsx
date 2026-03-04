import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

export function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    admin_id: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.admin_id, formData.password, 'admin');
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid grid-cols-2 gap-0 h-screen">
        <div className="bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-8">
          <div className="relative w-full max-w-sm h-96 flex flex-col items-center justify-center">
            <div className="mb-8">
              <Shield className="text-blue-600" size={64} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
              Admin Portal
            </h3>
            <p className="text-gray-600 text-center">
              Manage doctors, patients, and system settings.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
            <p className="text-gray-600 mb-8">Sign in to admin account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin ID
                </label>
                <input
                  type="text"
                  name="admin_id"
                  required
                  value={formData.admin_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <p className="text-center text-gray-600">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-blue-600 hover:underline"
                >
                  Back to Home
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
