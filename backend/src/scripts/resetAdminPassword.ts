import { pool } from '../config/database';
import bcrypt from 'bcryptjs';

async function resetAdminPassword() {
  try {
    const adminEmail = 'admin@ecommerce.com';
    const newPassword = 'admin123';
    
    // Check if admin exists
    const existingAdmin = await pool.query(
      "SELECT id, email, role FROM users WHERE email = $1",
      [adminEmail]
    );

    if (existingAdmin.rows.length === 0) {
      console.log('❌ Admin user not found. Creating new admin...');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const result = await pool.query(
        `INSERT INTO users (name, email, password, role) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, name, email, role`,
        ['Admin User', adminEmail, hashedPassword, 'admin']
      );
      
      console.log('✅ Admin user created successfully!');
      console.log('\n📧 Admin Credentials:');
      console.log('   Email:', adminEmail);
      console.log('   Password:', newPassword);
      console.log('\nUser Details:', result.rows[0]);
    } else {
      // Reset password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await pool.query(
        "UPDATE users SET password = $1, role = 'admin' WHERE email = $2",
        [hashedPassword, adminEmail]
      );
      
      console.log('✅ Admin password reset successfully!');
      console.log('\n📧 Admin Credentials:');
      console.log('   Email:', adminEmail);
      console.log('   Password:', newPassword);
      console.log('   User ID:', existingAdmin.rows[0].id);
      console.log('   Role:', 'admin');
    }

  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

resetAdminPassword();
