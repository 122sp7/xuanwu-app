/**
 * Narrow error shape used by auth flows when SDK or browser-thrown errors expose
 * only a code/message pair.
 */
type StructuredError = {
  code?: string
  message?: string
}

const IDENTITY_ERROR_MESSAGES: Record<string, string> = {
  "auth/network-request-failed": "We couldn’t reach the sign-in service. Check your connection and try again.",
  "auth/invalid-credential": "The email or password is incorrect.",
  "auth/invalid-login-credentials": "The email or password is incorrect.",
  "auth/user-not-found": "The email or password is incorrect.",
  "auth/wrong-password": "The email or password is incorrect.",
  "auth/email-already-in-use": "This email is already registered. Try signing in instead.",
  "auth/weak-password": "Password must be at least 6 characters long.",
  "auth/too-many-requests": "Too many attempts were made. Please wait a moment and try again.",
  "auth/user-disabled": "This account is currently disabled. Contact support for help.",
  "auth/operation-not-allowed": "This sign-in method is not available right now.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/missing-email": "Enter an email address.",
  "auth/missing-password": "Enter a password.",
}

/**
 * Convert Firebase/browser auth failures into stable user-facing copy.
 * Falls back to the supplied message when no mapped auth code can be found.
 */
export function toIdentityErrorMessage(error: unknown, fallback: string): string {
  /**
   * Extract Firebase auth codes from raw error messages and strip SDK-specific
   * prefixes so the UI never renders noisy Firebase boilerplate.
   */
  const resolveFromMessage = (message: string) => {
    const normalizedMessage = message.trim()
    const matchedCode = normalizedMessage.match(/auth\/[a-z-]+/)?.[0]?.toLowerCase()

    if (matchedCode && matchedCode in IDENTITY_ERROR_MESSAGES) {
      return IDENTITY_ERROR_MESSAGES[matchedCode]
    }

    return normalizedMessage
      .replace(/^Firebase:\s*/i, "")
      .replace(/^Error\s*/i, "")
      .trim()
  }

  if (typeof error === "object" && error !== null) {
    const { code, message } = error as StructuredError

    if (code && code in IDENTITY_ERROR_MESSAGES) {
      return IDENTITY_ERROR_MESSAGES[code]
    }

    if (typeof message === "string" && message.trim().length > 0) {
      return resolveFromMessage(message)
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return resolveFromMessage(error.message)
  }

  return fallback
}
