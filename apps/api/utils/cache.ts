type CacheValue<T> = {
    data: T;
    expiresAt: number;
};

export class SimpleCache<K, V> {
    private cache = new Map<K, CacheValue<V>>();

    constructor(private ttlMs: number) { }

    get(key: K): V | null {
        const entry = this.cache.get(key);
        if (!entry || entry.expiresAt < Date.now()) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }

    set(key: K, value: V) {
        this.cache.set(key, {
            data: value,
            expiresAt: Date.now() + this.ttlMs,
        });
    }

    delete(key: K) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }
}