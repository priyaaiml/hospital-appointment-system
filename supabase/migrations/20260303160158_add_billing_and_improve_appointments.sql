/*
  # Improve Appointments and Add Billing System

  ## Overview
  Enhances the appointment system with proper status management using ENUM type and adds a comprehensive billing table for tracking payments.

  ## Changes to Existing Tables

  ### appointments table
  - Updated `status` column to use PostgreSQL ENUM type with values: 'scheduled', 'completed', 'cancelled'
  - ENUM provides data integrity at the database level
  - Prevents invalid status values from being inserted

  ## New Tables

  ### billing
  - `id` (uuid, primary key) - Unique billing record identifier
  - `appointment_id` (uuid, foreign key) - References appointments table
  - `amount` (decimal, not null) - Billing amount in currency units
  - `payment_status` (ENUM: 'unpaid', 'paid') - Current payment status
  - `payment_date` (timestamptz, nullable) - Date when payment was received
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on billing table
  - Allow public read and insert access (simplified for demo)
  - Foreign key constraint ensures billing records only link to valid appointments
  - ON DELETE CASCADE ensures billing records are cleaned up when appointments are deleted

  ## Data Integrity
  - ENUM types enforce valid status values at the database level
  - Foreign key constraints prevent orphaned billing records
  - NOT NULL constraints on critical fields ensure data completeness
*/

-- Create ENUM types for appointment status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
    CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
  END IF;
END $$;

-- Create ENUM type for payment status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM ('unpaid', 'paid');
  END IF;
END $$;

-- Update appointments table to use ENUM for status
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'status'
  ) THEN
    ALTER TABLE appointments ALTER COLUMN status DROP DEFAULT;
    ALTER TABLE appointments ALTER COLUMN status TYPE appointment_status USING status::appointment_status;
    ALTER TABLE appointments ALTER COLUMN status SET DEFAULT 'scheduled'::appointment_status;
  END IF;
END $$;

-- Create billing table
CREATE TABLE IF NOT EXISTS billing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
  amount decimal(10, 2) NOT NULL,
  payment_status payment_status DEFAULT 'unpaid',
  payment_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on billing table
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (simplified for demo)
CREATE POLICY "Allow public read access to billing"
  ON billing FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to billing"
  ON billing FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to billing"
  ON billing FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);