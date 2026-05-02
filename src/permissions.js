import { isAdmin, isOwner } from './database.js';

export const HIGHEST_RANK_ROLE_ID = '1397488831514808341';

export function hasHighestRank(member) {
  return member.roles.cache.has(HIGHEST_RANK_ROLE_ID);
}

export function checkOwner(member) {
  return hasHighestRank(member) || isOwner(member.id);
}

export function checkAdmin(member) {
  return hasHighestRank(member) || isOwner(member.id) || isAdmin(member.id);
}
