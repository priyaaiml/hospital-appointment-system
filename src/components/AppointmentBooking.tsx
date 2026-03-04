import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Patient, Doctor } from '../types/database';

export function AppointmentBooking() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPatientsAndDoctors();
  }, []);

  const fetchPatientsAndDoctors = async () => {
    const [patientsResult, doctorsResult] = await Promise.all([
      supabase.from('patients').select('*').order('full_name'),
      supabase.from('doctors').select('*').order('full_name'),
    ]);

    if (patientsResult.data) setPatients(patientsResult.data);
    if (doctorsResult.data) setDoctors(doctorsResult.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([formData]);

      if (error) throw error;

      setMessage('Appointment booked successfully!');
      setFormData({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        reason: '',
      });
    } catch (error) {
      setMessage('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="text-orange-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="patient_id" className="block text-sm font-medium text-gray-700 mb-1">
            Select Patient
          </label>
          <select
            id="patient_id"
            name="patient_id"
            required
            value={formData.patient_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Choose a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.full_name} ({patient.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="doctor_id" className="block text-sm font-medium text-gray-700 mb-1">
            Select Doctor
          </label>
          <select
            id="doctor_id"
            name="doctor_id"
            required
            value={formData.doctor_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Choose a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.full_name} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Date
          </label>
          <input
            type="date"
            id="appointment_date"
            name="appointment_date"
            required
            value={formData.appointment_date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="appointment_time" className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Time
          </label>
          <input
            type="time"
            id="appointment_time"
            name="appointment_time"
            required
            value={formData.appointment_time}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Visit
          </label>
          <textarea
            id="reason"
            name="reason"
            required
            value={formData.reason}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-colors font-medium"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>

        {message && (
          <div className={`p-3 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
