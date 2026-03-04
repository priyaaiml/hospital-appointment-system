/*
  # Hospital Appointment System Schema

  ## Overview
  Creates tables for managing patients, doctors, and appointments in a hospital system.

  ## New Tables
  
  ### 1. patients
  - `id` (uuid, primary key) - Unique patient identifier
  - `full_name` (text) - Patient's full name
  - `email` (text, unique) - Patient's email address
  - `phone` (text) - Patient's phone number
  - `date_of_birth` (date) - Patient's date of birth
  - `address` (text) - Patient's address
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. doctors
  - `id` (uuid, primary key) - Unique doctor identifier
  - `full_name` (text) - Doctor's full name
  - `email` (text, unique) - Doctor's email address
  - `phone` (text) - Doctor's phone number
  - `specialization` (text) - Doctor's medical specialization
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. appointments
  - `id` (uuid, primary key) - Unique appointment identifier
  - `patient_id` (uuid, foreign key) - References patients table
  - `doctor_id` (uuid, foreign key) - References doctors table
  - `appointment_date` (date) - Date of the appointment
  - `appointment_time` (time) - Time of the appointment
  - `reason` (text) - Reason for the appointment
  - `status` (text) - Appointment status (scheduled, completed, cancelled)
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Allow public read access for all tables (for simplicity in demo)
  - Allow public insert access for all tables (for simplicity in demo)
  
  ## Notes
  - This is a simplified schema for demonstration purposes
  - In production, you would implement proper authentication and user-specific RLS policies
*/

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  date_of_birth date NOT NULL,
  address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  specialization text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (simplified for demo)
CREATE POLICY "Allow public read access to patients"
  ON patients FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to patients"
  ON patients FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to doctors"
  ON doctors FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to doctors"
  ON doctors FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to appointments"
  ON appointments FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to appointments"
  ON appointments FOR INSERT
  TO anon
  WITH CHECK (true);