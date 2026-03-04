import { useState, useEffect } from 'react';
import { Users, Stethoscope, Calendar, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Patient, Doctor, Appointment, Billing } from '../types/database';

type ViewType = 'patients' | 'doctors' | 'appointments' | 'billing';

interface AppointmentWithNames extends Appointment {
  patients?: { full_name: string };
  doctors?: { full_name: string; specialization: string };
}

interface BillingWithDetails extends Billing {
  appointments?: {
    appointment_date: string;
    appointment_time: string;
    patients?: { full_name: string };
  };
}

export function RecordsView() {
  const [activeView, setActiveView] = useState<ViewType>('patients');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<AppointmentWithNames[]>([]);
  const [billings, setBillings] = useState<BillingWithDetails[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [activeView]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      if (activeView === 'patients') {
        const { data } = await supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) setPatients(data);
      } else if (activeView === 'doctors') {
        const { data } = await supabase
          .from('doctors')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) setDoctors(data);
      } else if (activeView === 'appointments') {
        const { data } = await supabase
          .from('appointments')
          .select(`
            *,
            patients(full_name),
            doctors(full_name, specialization)
          `)
          .order('appointment_date', { ascending: false });
        if (data) setAppointments(data);
      } else if (activeView === 'billing') {
        const { data } = await supabase
          .from('billing')
          .select(`
            *,
            appointments(
              appointment_date,
              appointment_time,
              patients(full_name)
            )
          `)
          .order('created_at', { ascending: false });
        if (data) setBillings(data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">View Records</h2>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveView('patients')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'patients'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Users size={18} />
          Patients
        </button>
        <button
          onClick={() => setActiveView('doctors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'doctors'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Stethoscope size={18} />
          Doctors
        </button>
        <button
          onClick={() => setActiveView('appointments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'appointments'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Calendar size={18} />
          Appointments
        </button>
        <button
          onClick={() => setActiveView('billing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'billing'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <CreditCard size={18} />
          Billing
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          {activeView === 'patients' && (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date of Birth</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No patients registered yet
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{patient.full_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{patient.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{patient.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{patient.date_of_birth}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{patient.address}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeView === 'doctors' && (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Specialization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No doctors registered yet
                    </td>
                  </tr>
                ) : (
                  doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">Dr. {doctor.full_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{doctor.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{doctor.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{doctor.specialization}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeView === 'appointments' && (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Patient</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Doctor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Reason</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No appointments scheduled yet
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {appointment.patients?.full_name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Dr. {appointment.doctors?.full_name || 'N/A'}
                        <br />
                        <span className="text-xs text-gray-500">
                          {appointment.doctors?.specialization}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{appointment.appointment_date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{appointment.appointment_time}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{appointment.reason}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-700'
                            : appointment.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeView === 'billing' && (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Patient</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Appointment Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {billings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No billing records yet
                    </td>
                  </tr>
                ) : (
                  billings.map((billing) => (
                    <tr key={billing.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {billing.appointments?.patients?.full_name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {billing.appointments?.appointment_date} {billing.appointments?.appointment_time}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        ${billing.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          billing.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {billing.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {billing.payment_date ? new Date(billing.payment_date).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
