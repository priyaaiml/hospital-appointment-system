import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope } from 'lucide-react';

export function DoctorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.name, formData.password, 'doctor');
      navigate('/doctor/dashboard');
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
              <Stethoscope className="text-blue-600" size={64} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
              Doctor Portal
            </h3>
            <p className="text-gray-600 text-center">
              Manage your appointments and patient consultations efficiently.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Doctor Login</h2>
            <p className="text-gray-600 mb-8">Sign in to your doctor account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
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
