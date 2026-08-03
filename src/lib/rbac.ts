import type { Role } from "@/generated/prisma/enums";

export const ROLES_BUREAU: Role[] = [
  "PRESIDENT",
  "SECRETAIRE_GENERAL",
  "TRESORIER",
  "CHARGE_ORGANISATION",
  "CHARGE_SPIRITUEL",
  "CHARGE_DISCIPLINE",
];

export function estMembreDuBureau(roles: Role[]): boolean {
  return roles.some((role) => ROLES_BUREAU.includes(role));
}

export function aLeRole(roles: Role[], ...rolesAutorises: Role[]): boolean {
  return roles.some((role) => rolesAutorises.includes(role));
}
