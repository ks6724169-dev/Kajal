import fetch from 'node-fetch';

async function test() {
  const payload = {
    schoolName: "Test School 2",
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

  const res = await fetch('http://localhost:3000/api/v1/school-registration/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log("Start Registration Response:", data);
}

test();
