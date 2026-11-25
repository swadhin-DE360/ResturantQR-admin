export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  restaurantName: string;
  branch: string;
  avatarText: string;
  status: 'online' | 'busy' | 'away';
}

export const MOCK_ADMIN_PROFILE: AdminProfile = {
  name: 'Alessandro Rossi',
  email: 'admin@chefdesk.com',
  role: 'Executive Chef & Admin',
  restaurantName: 'The Grand Bistro',
  branch: 'Downtown Flagship',
  avatarText: 'AR',
  status: 'online',
};
