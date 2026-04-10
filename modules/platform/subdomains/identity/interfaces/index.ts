export { ShellGuard } from "./components/ShellGuard";
export {
  AuthContext,
  type AuthState,
  type AuthAction,
  type AuthContextValue,
  type AuthStatus,
  type AuthUser,
} from "./contexts/auth-context";
export { AuthProvider, useAuth } from "./providers/auth-provider";
export {
  DEV_DEMO_ACCOUNT_EMAIL,
  isLocalDevDemoAllowed,
  isDevDemoCredential,
  createDevDemoUser,
  readDevDemoSession,
  writeDevDemoSession,
  clearDevDemoSession,
} from "./utils/dev-demo-auth";
export {
  register,
  sendPasswordResetEmail,
  signIn,
  signInAnonymously,
  signOut,
} from "./_actions/identity.actions";
export { useTokenRefreshListener } from "./hooks/useTokenRefreshListener";
