import { useState } from 'react';
import { HeartPulse } from 'lucide-react';
import { PatientRegistration } from './components/PatientRegistration';
import { DoctorRegistration } from './components/DoctorRegistration';
import { AppointmentBooking } from './components/AppointmentBooking';
import { RecordsView } from './components/RecordsView';
import { BillingManagement } from './components/BillingManagement';

type TabType = 'patient' | 'doctor' | 'appointment' | 'billing' | 'records';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('patient');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <HeartPulse className="text-blue-600" size={40} />
          <h1 className="text-4xl font-bold text-gray-800">Hospital Management System</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button
            onClick={() => setActiveTab('patient')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'patient'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Register Patient
          </button>
          <button
            onClick={() => setActiveTab('doctor')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'doctor'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Register Doctor
          </button>
          <button
            onClick={() => setActiveTab('appointment')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'appointment'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Book Appointment
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'billing'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Billing
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'records'
                ? 'bg-gray-700 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            View Records
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          {activeTab === 'patient' && <PatientRegistration />}
          {activeTab === 'doctor' && <DoctorRegistration />}
          {activeTab === 'appointment' && <AppointmentBooking />}
          {activeTab === 'billing' && <BillingManagement />}
          {activeTab === 'records' && <RecordsView />}
        </div>
      </div>
    </div>
  );
}

export default App;
