// Turns Supabase / network errors into messages a user can understand
type MaybeAuthError = {
  message?: string;
  code?: string;
  status?: number;
  name?: string;
};

export function getAuthErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Something went wrong. Please try again.";
  }

  const err = error as MaybeAuthError;
  const message = (err.message ?? "").toLowerCase();

  // Wrong email or password
  if (
    err.code === "invalid_credentials" ||
    message.includes("invalid login credentials")
  ) {
    return "Incorrect email or password. Please try again.";
  }

  // Password rejected by Supabase
  if (err.code === "weak_password" || message.includes("password should")) {
    return "That password is too weak. Use at least 8 characters, including a number and an uppercase letter.";
  }

  // Email already has an account
  if (
    err.code === "user_already_exists" ||
    err.code === "email_exists" ||
    message.includes("already registered")
  ) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (err.code === "email_not_confirmed") {
    return "Please confirm your email address before signing in.";
  }

  // Too many attempts
  if (err.code === "over_request_rate_limit" || err.status === 429) {
    return "Too many attempts. Please wait a minute and try again.";
  }

  // No internet / server unreachable
  if (
    err.name === "AuthRetryableFetchError" ||
    message.includes("network") ||
    message.includes("failed to fetch")
  ) {
    return "Network error. Check your internet connection and try again.";
  }
  return err.message || "Something went wrong. Please try again.";
}
