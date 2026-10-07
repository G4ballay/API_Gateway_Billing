export interface ApiKey {
  _id: string;
  name: string;
  keyPrefix: string;
  status: 'active' | 'revoked';
  rateLimitPerMin: number;
  createdAt: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  credits: number;
}

export interface CreateKeyResponse {
  message: string;
  apiKey: string; // Token completo en texto plano (solo disponible en creación)
  keyInfo: ApiKey;
}