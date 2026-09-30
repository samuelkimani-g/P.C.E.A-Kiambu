export const ROLES = {
  ADMIN: 'admin',
  PASTOR: 'pastor',
  STAFF: 'staff',
  MEMBER: 'member',
};

export const ROLE_GROUPS = {
  ADMIN_TEAM: [ROLES.ADMIN, ROLES.PASTOR, ROLES.STAFF],
  MANAGEMENT: [ROLES.ADMIN, ROLES.PASTOR],
};

export const DISTRICTS = [
  { label: 'Bethany District', value: 'bethany' },
  { label: 'Faith District', value: 'faith' },
  { label: 'Grace District', value: 'grace' },
  { label: 'Hope District', value: 'hope' },
  { label: 'Love District', value: 'love' },
  { label: 'Mission District', value: 'mission' },
];

export const MEMBERSHIP_STATUSES = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Transferred', value: 'transferred' },
];

export const ANNOUNCEMENT_CATEGORIES = [
  { label: 'General', value: 'general' },
  { label: 'Group', value: 'group' },
  { label: 'District', value: 'district' },
  { label: 'Visitors', value: 'visitors' },
];

export const HYMN_LANGUAGES = [
  { label: 'English', value: 'english' },
  { label: 'Kikuyu', value: 'kikuyu' },
  { label: 'Swahili', value: 'swahili' },
];

export const LIVESTREAM_STATUSES = [
  { label: 'Live', value: 'live' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
];

export const ATTENDANCE_STATUSES = [
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
  { label: 'Excused', value: 'excused' },
];

export const PAYMENT_METHODS = [
  { label: 'Cash', value: 'cash' },
  { label: 'M-Pesa', value: 'mpesa' },
  { label: 'Bank', value: 'bank' },
  { label: 'Cheque', value: 'cheque' },
  { label: 'Other', value: 'other' },
];

export const OFFERING_TYPES = [
  { label: 'General Offering', value: 'general' },
  { label: 'Thanksgiving', value: 'thanksgiving' },
  { label: 'Building Fund', value: 'building' },
  { label: 'Missions', value: 'missions' },
  { label: 'Special Offering', value: 'special' },
  { label: 'Other', value: 'other' },
];
