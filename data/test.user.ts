function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env and fill it in.`,
    );
  }
  return value;
}

export const adminUser = {
  username: requiredEnv("ADMIN_USER"),
  password: requiredEnv("ADMIN_USER_PASSWORD"),
};
