export type UserRole = 'student' | 'lecturer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  identifier: string; // NPM for student, NIP for lecturer
  avatarUrl?: string;
  deviceId?: string;
}

export interface Student extends User {
  role: 'student';
  identifier: string; // NPM
}

export interface Lecturer extends User {
  role: 'lecturer';
  identifier: string; // NIP
}
