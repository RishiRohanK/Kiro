// Simple in-memory singleton for tokens (Reset on server restart)
// In production, this should be a Database or Redis.

interface ResetToken {
  email: string;
  expires: number;
}

class TokenStore {
  private static instance: TokenStore;
  private tokens: Map<string, ResetToken>;

  private constructor() {
    this.tokens = new Map();
  }

  public static getInstance(): TokenStore {
    if (!TokenStore.instance) {
      TokenStore.instance = new TokenStore();
    }
    return TokenStore.instance;
  }

  public set(token: string, data: ResetToken) {
    this.tokens.set(token, data);
  }

  public get(token: string): ResetToken | undefined {
    return this.tokens.get(token);
  }

  public delete(token: string) {
    this.tokens.delete(token);
  }
}

export const tokenStore = TokenStore.getInstance();
