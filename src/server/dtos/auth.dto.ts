export interface RegisterClientDTO {
  email: string;
  password?: string;
  displayName: string;
  companyName?: string;
  discordUsername?: string;
}

export interface RegisterDeveloperDTO {
  email: string;
  password?: string;
  displayName: string;
  bio?: string;
  specialization?: string;
  skills?: string[];
}

export interface LoginDTO {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDTO {
  currentPassword?: string;
  newPassword: string;
}

export interface VerifyEmailDTO {
  token: string;
}

export interface OAuthLoginDTO {
  provider: 'google' | 'discord';
  providerAccountId: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface LinkOAuthDTO {
  provider: 'google' | 'discord';
  providerAccountId: string;
  providerEmail?: string;
}
