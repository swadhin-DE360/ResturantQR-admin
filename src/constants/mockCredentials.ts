/**
 * Mock Credentials Configuration
 * Static configuration for frontend mock authentication.
 * No backend or API calls.
 */

export interface MockCredential {
  email: string;
  password: string;
  name: string;
  role: string;
  restaurant: string;
}

export const MOCK_CREDENTIALS: MockCredential[] = [
  {
    email: 'admin@chefdesk.com',
    password: 'AdminPassword123!',
    name: 'Chef Alessandro Rossi',
    role: 'Executive Chef & Owner',
    restaurant: 'L’Osteria Della Spiga',
  },
  {
    email: 'manager@chefdesk.com',
    password: 'Manager2026!',
    name: 'Elena Rostova',
    role: 'General Floor Manager',
    restaurant: 'The Urban Bistro',
  },
];

export const DEFAULT_MOCK_LOGIN = MOCK_CREDENTIALS[0];

/**
 * Validates credentials against static mock data.
 * Pure frontend logic - no network or backend involved.
 */
export function verifyMockCredentials(email: string, password: string): MockCredential | null {
  const normalizedEmail = email.trim().toLowerCase();
  const found = MOCK_CREDENTIALS.find(
    (cred) => cred.email.toLowerCase() === normalizedEmail && cred.password === password
  );
  return found || null;
}
