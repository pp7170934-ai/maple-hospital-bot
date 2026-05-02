import { isAdmin, isOwner } from './database.js';

export const SUPER_ADMIN_ID = '1397488831514808341';

export function isSuperAdmin(member) {
  return member.id === SUPER_ADMIN_ID || member.roles.cache.has(SUPER_ADMIN_ID);
}

export function checkOwner(member) {
  return isSuperAdmin(member) || isOwner(member.id);
}

export function checkAdmin(member) {
  return isSuperAdmin(member) || isOwner(member.id) || isAdmin(member.id);
}
