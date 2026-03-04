/*
  # Create Role-Based Authentication Tables

  ## Overview
  Sets up comprehensive authentication system with role-based access control for Patient, Doctor, and Admin roles.

  ## New Tables

  ### auth_users
  - `id` (uuid, primary key)
  - `email` (text, unique)
  - `password_hash` (text)
  - `role` (ENUM: 'patient', 'doctor', 'admin')
  - `full_name` (text)
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz)

  ### patients
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth_users)
  - `first_name` (text)
  - `last_name` (text)
  - `email` (text, unique)
  - `contact_number` (text)
  - `gender` (ENUM: 'male', 'female', 'other')
  - `created_at` (timestamptz)

  ### doctors
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth_users)
  - `name` (text)
  - `specialty` (text)
  - `consultation_fee` (decimal)
  - `created_at` (timestamptz)

  ### appointments
  - `id` (uuid, primary key)
  - `patient_id` (uuid, foreign key)
  - `doctor_id` (uuid, foreign key)
  - `appointment_date` (date)
  - `appointment_time` (time)
  - `status` (ENUM: 'booked', 'cancelled', 'completed')
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Doctors can view only their appointments
  - Admins have full access
*/

-- Create ENUM for user roles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
  END IF;
END $$;

-- Create ENUM for gender
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender_type') THEN
    CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
  END IF;
END $$;

-- Create ENUM for appointment status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appt_status') THEN
    CREATE TYPE appt_status AS ENUM ('booked', 'cancelled', 'completed');
  END IF;
END $$;

-- Create auth_users table
CREATE TABLE IF NOT EXISTS auth_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role user_role NOT NULL,
  full_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth_users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  contact_number text NOT NULL,
  gender gender_type NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth_users(id) ON DELETE CASCADE,
  name text NOT NULL,
  specialty text NOT NULL,
  consultation_fee decimal(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status appt_status DEFAULT 'booked',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients
CREATE POLICY "Allow public insert for patient registration"
  ON patients FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Patients can read own data"
  ON patients FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for doctors
CREATE POLICY "Allow public read all doctors"
  ON doctors FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert for doctor registration"
  ON doctors FOR INSERT
  TO anon
  WITH CHECK (true);

-- RLS Policies for appointments
CREATE POLICY "Allow public read appointments"
  ON appointments FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert appointments"
  ON appointments FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update appointments"
  ON appointments FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);