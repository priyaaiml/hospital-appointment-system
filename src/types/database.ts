export interface Patient {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  specialization: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: string;
  created_at: string;
}

export interface AppointmentWithDetails extends Appointment {
  patient_name?: string;
  doctor_name?: string;
  doctor_specialization?: string;
}

export interface Billing {
  id: string;
  appointment_id: string;
  amount: number;
  payment_status: 'unpaid' | 'paid';
  payment_date: string | null;
  created_at: string;
  updated_at: string;
}
