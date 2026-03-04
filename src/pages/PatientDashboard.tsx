import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, Heart } from 'lucide-react';

type Tab = 'dashboard' | 'book' | 'appointments';

export function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-white border-r border-gray-200 transition-all duration-300`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Heart className="text-blue-600" size={28} />
              {sidebarOpen && <span className="font-bold text-gray-900">Global Hospital</span>}
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'book', label: 'Book Appointment', icon: '📅' },
              { id: 'appointments', label: 'My Appointments', icon: '📋' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-auto">
          <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.full_name}
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </header>

          <div className="flex-1 p-8">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Book My Appointment</h3>
                  <p className="text-gray-600 mb-6">
                    Schedule an appointment with any of our specialist doctors
                  </p>
                  <button
                    onClick={() => setActiveTab('book')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">My Appointments</h3>
                  <p className="text-gray-600 mb-6">
                    View and manage all your scheduled appointments
                  </p>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    View Appointments
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'book' && (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Doctor
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Dr. John Smith - Cardiology - $100</option>
                      <option>Dr. Jane Doe - Pediatrics - $80</option>
                      <option>Dr. Mike Johnson - Orthopedics - $90</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consultation Fee
                    </label>
                    <input
                      type="text"
                      disabled
                      value="$100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Create Appointment
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Doctor
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Fee
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No appointments yet. Book one now!
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
