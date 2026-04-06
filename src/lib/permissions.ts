import { UserRole } from "@prisma/client";

export function canManageOperations(role: UserRole) {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN;
}

export function canManageContent(role: UserRole) {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN || role === UserRole.EDITOR;
}

export function canManageSensitiveSettings(role: UserRole) {
  return role === UserRole.SUPER_ADMIN;
}
