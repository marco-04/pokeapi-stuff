export type CacheEntry<T> = {
  createdAt: number,
  val: T
}

export class Cache {
  private cache = new Map<string, CacheEntry<any>>();
  private reapIntervalId: NodeJS.Timeout | undefined = undefined;
  private interval: number;

  constructor(interval: number) {
    this.interval = interval;
    this.startReapLoop();
  }

  add<T>(key: string, val: T) {
    this.cache.set(key, {
      createdAt: Date.now(),
      val: val
    });
  }

  get<T>(key: string) {
    const entry = this.cache.get(key)
    return entry !== undefined ? entry.val as T : undefined;
  }

  private reap() {
    for (const [k, v] of this.cache) {
      if (Date.now() - (v.createdAt + this.interval) >= 0) {
        this.cache.delete(k);
      }
    }
  }

  private startReapLoop() {
    this.reapIntervalId = setInterval(() => {
      this.reap();
    }, this.interval);
  }

  stopReapLoop() {
    clearInterval(this.reapIntervalId);
    this.reapIntervalId = undefined;
  }
}

