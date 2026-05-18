-- SQL INSERT Statement to add the 4 users to the "User" table in PostgreSQL
-- Hashed password is for 'StudentForge2026!' (salt rounds: 12)
-- Role is set to 'INTERN' (adjust to 'TECHNICAL_TEAM', etc., if necessary)
-- isApproved is set to true so they can log in immediately

INSERT INTO "User" (
    "id", 
    "name", 
    "email", 
    "password", 
    "role", 
    "isApproved", 
    "batch", 
    "createdAt", 
    "updatedAt"
) VALUES 
(
    'c224db27fd5128babcb551b27', 
    'P. Vishnu Vardhan', 
    'podilivishnuvardhan24@gmail.com', 
    '$2b$12$Ti/IDI0zp1VRMhTNI2Gpse5fdEDRlq3wzY5ReWMrY.qqvIfobKV4q', 
    'INTERN'::"Role", 
    true, 
    'Batch 3', 
    NOW(), 
    NOW()
),
(
    'c80ca85d45b17d3b6c6b25b40', 
    'S. Vamsi', 
    'vamsisaripalli7@gmail.com', 
    '$2b$12$Ti/IDI0zp1VRMhTNI2Gpse5fdEDRlq3wzY5ReWMrY.qqvIfobKV4q', 
    'INTERN'::"Role", 
    true, 
    'Batch 3', 
    NOW(), 
    NOW()
),
(
    'c743200957f92d84dcd0ad1ea', 
    'D. Ram Ganesh', 
    'ramganeshdintakurthi@gmail.com', 
    '$2b$12$Ti/IDI0zp1VRMhTNI2Gpse5fdEDRlq3wzY5ReWMrY.qqvIfobKV4q', 
    'INTERN'::"Role", 
    true, 
    'Batch 3', 
    NOW(), 
    NOW()
),
(
    'cb6bf72a37287754f01d280be', 
    'K. Pavan', 
    'pavankuppili93@gmail.com', 
    '$2b$12$Ti/IDI0zp1VRMhTNI2Gpse5fdEDRlq3wzY5ReWMrY.qqvIfobKV4q', 
    'INTERN'::"Role", 
    true, 
    'Batch 3', 
    NOW(), 
    NOW()
);
