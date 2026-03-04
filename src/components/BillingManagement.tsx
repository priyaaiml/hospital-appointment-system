import { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Appointment, Billing } from '../types/database';

interface AppointmentOption extends Appointment {
  patients?: { full_name: string };
  billing?: Billing[];
}

export function BillingManagement() {
  const [appointments, setAppointments] = useState<AppointmentOption[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    payment_status: 'unpaid' as 'unpaid' | 'paid',
    payment_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAppointmentsWithoutBilling();
  }, []);

  const fetchAppointmentsWithoutBilling = async () => {
    try {
      const { data } = await supabase
        .from('appointments')
        .select(`
          *,
          patients(full_name),
          billing(id)
        `)
        .order('appointment_date', { ascending: false });

      if (data) {
        const appointmentsWithoutBilling = data.filter(
          (apt: AppointmentOption) => !apt.billing || apt.billing.length === 0
        );
        setAppointments(appointmentsWithoutBilling);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!selectedAppointment) {
        throw new Error('Please select an appointment');
      }

      const billData: any = {
        appointment_id: selectedAppointment,
        amount: parseFloat(formData.amount),
        payment_status: formData.payment_status,
      };

      if (formData.payment_date) {
        billData.payment_date = formData.payment_date;
      }

      const { error } = await supabase.from('billing').insert([billData]);

      if (error) throw error;

      setMessage('Billing record created successfully!');
      setFormData({
        amount: '',
        payment_status: 'unpaid',
        payment_date: '',
      });
      setSelectedAppointment('');
      fetchAppointmentsWithoutBilling();
    } catch (error) {
      setMessage('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="text-purple-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Billing Management</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="appointment_id" className="block text-sm font-medium text-gray-700 mb-1">
            Select Appointment
          </label>
          <select
            id="appointment_id"
            name="appointment_id"
            required
            value={selectedAppointment}
            onChange={(e) => {
              setSelectedAppointment(e.target.value);
              handleChange(e);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose an appointment</option>
            {appointments.map((appointment) => (
              <option key={appointment.id} value={appointment.id}>
                {appointment.patients?.full_name || 'Unknown'} - {appointment.appointment_date} {appointment.appointment_time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Billing Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            required
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Status
          </label>
          <select
            id="payment_status"
            name="payment_status"
            value={formData.payment_status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {formData.payment_status === 'paid' && (
          <div>
            <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date
            </label>
            <input
              type="date"
              id="payment_date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors font-medium"
        >
          {loading ? 'Creating...' : 'Create Billing Record'}
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
