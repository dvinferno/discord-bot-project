// Define the structure for a cached value, including the actual data and its expiration timestamp.
type CacheValue<T> = {
  data: T; // The actual data being cached.
  expiresAt: number; // Timestamp (in milliseconds) when this cache entry expires.
};

/**
 * A simple in-memory cache implementation with a Time-To-Live (TTL) mechanism.
 *
 * @template K The type of the cache keys.
 * @template V The type of the cache values.
 */
export class SimpleCache<K, V> {
  // Internal Map to store cache entries. Each entry contains the data and its expiration time.
  private cache = new Map<K, CacheValue<V>>();

  /**
   * Creates an instance of SimpleCache.
   * @param ttlMs The Time-To-Live (TTL) for cache entries in milliseconds.
   *              Entries will be considered stale and removed after this duration.
   */
  constructor(private ttlMs: number) {}

  /**
   * Retrieves a value from the cache.
   * If the entry does not exist or has expired, it is removed from the cache and `null` is returned.
   *
   * @param key The key of the value to retrieve.
   * @returns The cached value if found and not expired, otherwise `null`.
   */
  get(key: K): V | null {
    const entry = this.cache.get(key);
    // Check if the entry exists and if it's still valid (not expired).
    if (!entry || entry.expiresAt < Date.now()) {
      // If expired or not found, delete it from the cache to free up memory.
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  /**
   * Sets a value in the cache with the configured TTL.
   * The expiration time is calculated based on the current time and the `ttlMs` provided during construction.
   *
   * @param key The key under which to store the value.
   * @param value The value to store.
   */
  set(key: K, value: V) {
    this.cache.set(key, {
      data: value,
      expiresAt: Date.now() + this.ttlMs, // Calculate the expiration timestamp.
    });
  }

  /**
   * Deletes a specific entry from the cache.
   *
   * @param key The key of the entry to delete.
   */
  delete(key: K) {
    this.cache.delete(key);
  }

  /**
   * Clears all entries from the cache, effectively emptying it.
   */
  clear() {
    this.cache.clear();
  }
}