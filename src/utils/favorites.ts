export type FavoriteType = 'oil' | 'disease' | 'content';

export interface FavoriteItem {
  id: string; // unique per type, e.g., oil-123
  type: FavoriteType;
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  addedAt: string; // ISO
  image?: string;
  url?: string;
}

const keyForUser = (userId?: string | null) =>
  userId ? `favorites:${userId}` : 'favorites:guest';

export function getFavorites(userId?: string | null): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(keyForUser(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setFavorites(items: FavoriteItem[], userId?: string | null) {
  localStorage.setItem(keyForUser(userId), JSON.stringify(items));
}

export function isFavorite(
  type: FavoriteType,
  rawId: string | number,
  userId?: string | null,
): boolean {
  const id = `${type}-${rawId}`;
  return getFavorites(userId).some((f) => f.id === id);
}

export function addFavorite(item: FavoriteItem, userId?: string | null) {
  const items = getFavorites(userId);
  if (items.some((f) => f.id === item.id)) return;
  const updated = [item, ...items];
  setFavorites(updated, userId);
}

export function removeFavorite(
  type: FavoriteType,
  rawId: string | number,
  userId?: string | null,
) {
  const id = `${type}-${rawId}`;
  const items = getFavorites(userId).filter((f) => f.id !== id);
  setFavorites(items, userId);
}

export function toggleFavorite(
  itemFactory: () => FavoriteItem,
  userId?: string | null,
): boolean {
  const item = itemFactory();
  const items = getFavorites(userId);
  const exists = items.some((f) => f.id === item.id);
  if (exists) {
    setFavorites(items.filter((f) => f.id !== item.id), userId);
    return false;
  } else {
    setFavorites([item, ...items], userId);
    return true;
  }
}


