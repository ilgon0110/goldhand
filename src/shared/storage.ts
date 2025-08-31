interface IStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
  clear(): void;
}

class MemoryStorage implements IStorage {
  private storage: Map<string, string> = new Map();

  get(key: string): string | null {
    return this.storage.get(key) || null;
  }

  set(key: string, value: string): void {
    if (key.length === 0 || key.length > 100) {
      throw new Error('Key의 길이는 1에서 100자 사이여야 합니다.');
    }
    this.storage.set(key, value);
  }

  remove(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }
}

class LocalStorage implements IStorage {
  public static canUse(): boolean {
    const TEST_KEY = generateTestKey();

    // 쿠키 차단이나 시크릿 모드같은 경우 localStorage에 접근 시 예외 발생
    try {
      localStorage.setItem(TEST_KEY, 'test');
      localStorage.removeItem(TEST_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  get(key: string): string | null {
    return localStorage.getItem(key);
  }
  set(key: string, value: string): void {
    if (key.length === 0 || key.length > 100) {
      throw new Error('Key의 길이는 1에서 100자 사이여야 합니다.');
    }
    localStorage.setItem(key, value);
  }
  remove(key: string): void {
    localStorage.removeItem(key);
  }
  clear(): void {
    localStorage.clear();
  }
}

class SessionStorage implements IStorage {
  public static canUse(): boolean {
    const TEST_KEY = generateTestKey();

    try {
      sessionStorage.setItem(TEST_KEY, 'test');
      sessionStorage.removeItem(TEST_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  get(key: string): string | null {
    return sessionStorage.getItem(key);
  }
  set(key: string, value: string): void {
    if (key.length === 0 || key.length > 100) {
      throw new Error('Key의 길이는 1에서 100자 사이여야 합니다.');
    }
    sessionStorage.setItem(key, value);
  }
  remove(key: string): void {
    sessionStorage.removeItem(key);
  }
  clear(): void {
    sessionStorage.clear();
  }
}

function generateTestKey(): string {
  return `test-${Math.random().toString(36).substring(2, 15)}`;
}

export function createStorage(): IStorage {
  if (LocalStorage.canUse()) {
    return new LocalStorage();
  }

  return new MemoryStorage();
}

export function createSessionStorage(): IStorage {
  if (SessionStorage.canUse()) {
    return new SessionStorage();
  }

  return new MemoryStorage();
}

export const safeLocalStorage = createStorage();
export const safeSessionStorage = createSessionStorage();
