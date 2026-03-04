import { useNavigate } from 'react-router-dom';
import { Stethoscope, Heart } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="text-blue-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">Global Hospital</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Global Hospital Management System
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Professional healthcare management platform enabling seamless scheduling,
              consultation, and patient care coordination. Connect with experienced doctors
              and manage your health journey with ease.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/patient/login')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Login as Patient
              </button>
              <button
                onClick={() => navigate('/doctor/login')}
                className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors font-medium"
              >
                Login as Doctor
              </button>
              <button
                onClick={() => navigate('/admin/login')}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Login as Admin
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg overflow-hidden">
              <svg
                className="w-full h-full"
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="200" cy="200" r="150" fill="none" stroke="#e5e7eb" strokeWidth="2"/>

                <path
                  d="M 100 200 Q 150 180 200 200 T 300 200"
                  stroke="#2563eb"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values="0,200;200,0;200,0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>

                <circle cx="200" cy="200" r="12" fill="#2563eb">
                  <animate
                    attributeName="r"
                    values="12;14;12"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>

                <text x="200" y="350" textAnchor="middle" className="text-sm fill-gray-600" fontSize="16">
                  Professional Healthcare Platform
                </text>
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
