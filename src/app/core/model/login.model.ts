export interface Credential {
  email: string;
  password: string;
}

export interface Signup extends Credential {
    name: string;
    confirmPassword: string;
}