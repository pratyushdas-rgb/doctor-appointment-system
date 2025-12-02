CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    role VARCHAR(50) CHECK (role IN ('patient', 'doctor', 'clinic_staff', 'admin')),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE specializations (
    specialization_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE doctors (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    specialization_id INT REFERENCES specializations(specialization_id) ON DELETE SET NULL,
    bio TEXT
);

CREATE TABLE patients (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    dob DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    address TEXT
);

CREATE TABLE clinic_staff (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL
);

CREATE TABLE admins (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    admin_level VARCHAR(50) NOT NULL
);

CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(user_id) ON DELETE CASCADE,
    doctor_id INT REFERENCES doctors(user_id) ON DELETE CASCADE,
    appointment_date TIMESTAMP,
    status VARCHAR(50) CHECK (status IN ('booked', 'completed', 'cancelled')),
    qr_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointment_logs (
    log_id SERIAL PRIMARY KEY,
    appointment_id INT REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    action VARCHAR(50) CHECK (action IN ('created', 'updated', 'cancelled', 'completed', 'rescheduled', 'checked_in', 'payment_received')),
    old_value JSONB,
    new_value JSONB,
    performed_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patient_logs (
    log_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(user_id) ON DELETE CASCADE,
    action VARCHAR(50) CHECK (action IN ('created', 'updated', 'appointment_booked', 'appointment_cancelled')),
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    appointment_id INT REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) CHECK (payment_method IN ('online', 'offline')),
    status VARCHAR(50) CHECK (status IN ('pending', 'paid', 'failed')),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('email', 'sms', 'push')),
    title VARCHAR(255),
    message TEXT,
    status VARCHAR(50) CHECK (status IN ('pending', 'sent', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP
);
