import { Pool } from 'pg';
import dotenv from 'dotenv';
import { SchoolRegistrationService } from '../server/services/SchoolRegistrationService.js';
dotenv.config();

async function test() {
  const service = new SchoolRegistrationService();
  try {
    const payload = {
      schoolName: "Test School 5",
      schoolType: "K-12",
      schoolCategory: "Private",
      board: "CBSE",
      establishmentYear: 2000
    };
    const reg = await service.startRegistration(payload);
    console.log("Started:", reg.registration_id);
    
    const formData = {
      schoolName: "Test School 5",
      schoolType: "K-12",
      schoolCategory: "Private",
      boardType: "CBSE",
      establishedYear: 2000,
      country: "India",
      state: "Delhi",
      district: "New Delhi",
      city: "New Delhi",
      pincode: "110001",
      address: "123 Test Street",
      principalName: "John Doe",
      principalEmail: "john@example.com",
      principalPhone: "1234567890",
      adminName: "Jane Doe",
      adminEmail: "jane@example.com",
      adminPhone: "0987654321",
      totalStudents: 1000,
      totalTeachers: 50,
      selectedPlan: "ENTERPRISE",
      billingCycle: "YEARLY",
      logoUrl: "",
      agreeTerms: true
    };
    
    const complete = await service.completeRegistration(reg.registration_id, formData, "password123");
    console.log("Completed:", complete.registration.status);
  } catch(e: any) {
    console.error(e.message);
  }
}

test();
