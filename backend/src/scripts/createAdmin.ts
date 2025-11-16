import { pool } from '../config/database';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await pool.query(
      "SELECT id, email FROM users WHERE role = 'admin'"
    );

    if (existingAdmin.rows.length > 0) {
      console.log('✅ Admin user already exists:');
      existingAdmin.rows.forEach(admin => {
        console.log(`   Email: ${admin.email} (ID: ${admin.id})`);
      });
      console.log('\nTo reset password, delete this user and run script again.');
      process.exit(0);
    }

    // Create admin user
    const adminEmail = 'admin@ecommerce.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role`,
      ['Admin User', adminEmail, hashedPassword, 'admin']
    );

    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Admin Credentials:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('\n⚠️  Please change the password after first login!');
    console.log('\nUser Details:', result.rows[0]);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdmin();
