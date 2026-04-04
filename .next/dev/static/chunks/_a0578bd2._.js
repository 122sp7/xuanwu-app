(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/packages/shared-types/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ─── Primitive types ──────────────────────────────────────────────────────────
__turbopack_context__.s([
    "commandFailure",
    ()=>commandFailure,
    "commandFailureFrom",
    ()=>commandFailureFrom,
    "commandSuccess",
    ()=>commandSuccess
]);
function commandSuccess(aggregateId, version) {
    return {
        success: true,
        aggregateId,
        version
    };
}
function commandFailure(error) {
    return {
        success: false,
        error
    };
}
function commandFailureFrom(code, message, context) {
    return commandFailure({
        code,
        message,
        context
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/application/identity-error-message.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Narrow error shape used by auth flows when SDK or browser-thrown errors expose
 * only a code/message pair.
 */ __turbopack_context__.s([
    "toIdentityErrorMessage",
    ()=>toIdentityErrorMessage
]);
const IDENTITY_ERROR_MESSAGES = {
    // Firebase/browser-thrown auth failures have surfaced both hyphenated and
    // underscored credential codes in different environments, so we normalize both.
    "auth/network-request-failed": "We couldn’t reach the sign-in service. Check your connection and try again.",
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-login-credentials": "The email or password is incorrect.",
    "auth/invalid_login_credentials": "The email or password is incorrect.",
    "auth/user-not-found": "The email or password is incorrect.",
    "auth/wrong-password": "The email or password is incorrect.",
    "auth/email-already-in-use": "This email is already registered. Try signing in instead.",
    "auth/weak-password": "Password must be at least 6 characters long.",
    "auth/too-many-requests": "Too many attempts were made. Please wait a moment and try again.",
    "auth/user-disabled": "This account is currently disabled. Contact support for help.",
    "auth/operation-not-allowed": "This sign-in method is not available right now.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/missing-email": "Enter an email address.",
    "auth/missing-password": "Enter a password."
};
function toIdentityErrorMessage(error, fallback) {
    /**
   * Extract Firebase auth codes from raw error messages and strip SDK-specific
   * prefixes so the UI never renders noisy Firebase boilerplate.
   */ const resolveFromMessage = (message)=>{
        const normalizedMessage = message.trim();
        const matchedCode = normalizedMessage.match(/auth\/[a-z][a-z0-9_-]*/)?.[0]?.toLowerCase();
        if (matchedCode && matchedCode in IDENTITY_ERROR_MESSAGES) {
            return IDENTITY_ERROR_MESSAGES[matchedCode];
        }
        return normalizedMessage.replace(/^Firebase:\s*/i, "").replace(/^Error\s*/i, "").trim();
    };
    if (typeof error === "object" && error !== null) {
        const { code, message } = error;
        if (code && code in IDENTITY_ERROR_MESSAGES) {
            return IDENTITY_ERROR_MESSAGES[code];
        }
        if (typeof message === "string" && message.trim().length > 0) {
            return resolveFromMessage(message);
        }
    }
    if (error instanceof Error && error.message.trim().length > 0) {
        return resolveFromMessage(error.message);
    }
    return fallback;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/application/use-cases/identity.use-cases.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RegisterUseCase",
    ()=>RegisterUseCase,
    "SendPasswordResetEmailUseCase",
    ()=>SendPasswordResetEmailUseCase,
    "SignInAnonymouslyUseCase",
    ()=>SignInAnonymouslyUseCase,
    "SignInUseCase",
    ()=>SignInUseCase,
    "SignOutUseCase",
    ()=>SignOutUseCase
]);
/**
 * Identity Use Cases — pure business workflows.
 * No React, no Firebase SDK, no UI framework.
 * Depends only on the IdentityRepository port.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/application/identity-error-message.ts [app-client] (ecmascript)");
;
;
class SignInUseCase {
    identityRepo;
    constructor(identityRepo){
        this.identityRepo = identityRepo;
    }
    async execute(credentials) {
        try {
            const identity = await this.identityRepo.signInWithEmailAndPassword(credentials);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(identity.uid, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SIGN_IN_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Sign-in failed"));
        }
    }
}
class SignInAnonymouslyUseCase {
    identityRepo;
    constructor(identityRepo){
        this.identityRepo = identityRepo;
    }
    async execute() {
        try {
            const identity = await this.identityRepo.signInAnonymously();
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(identity.uid, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SIGN_IN_ANONYMOUS_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Anonymous sign-in failed"));
        }
    }
}
class RegisterUseCase {
    identityRepo;
    constructor(identityRepo){
        this.identityRepo = identityRepo;
    }
    async execute(input) {
        try {
            const identity = await this.identityRepo.createUserWithEmailAndPassword(input);
            await this.identityRepo.updateDisplayName(identity.uid, input.name);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(identity.uid, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("REGISTRATION_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Registration failed"));
        }
    }
}
class SendPasswordResetEmailUseCase {
    identityRepo;
    constructor(identityRepo){
        this.identityRepo = identityRepo;
    }
    async execute(email) {
        try {
            await this.identityRepo.sendPasswordResetEmail(email);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(email, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("PASSWORD_RESET_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Password reset failed"));
        }
    }
}
class SignOutUseCase {
    identityRepo;
    constructor(identityRepo){
        this.identityRepo = identityRepo;
    }
    async execute() {
        const currentUser = this.identityRepo.getCurrentUser();
        const aggregateId = currentUser?.uid ?? "anonymous";
        try {
            await this.identityRepo.signOut();
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(aggregateId, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("SIGN_OUT_FAILED", (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$identity$2d$error$2d$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toIdentityErrorMessage"])(err, "Sign-out failed"));
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/application/use-cases/token-refresh.use-cases.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmitTokenRefreshSignalUseCase",
    ()=>EmitTokenRefreshSignalUseCase
]);
/**
 * Token Refresh Use Cases — pure business workflows for [S6] Claims refresh.
 * No React, no Firebase SDK, no UI framework.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-client] (ecmascript)");
;
class EmitTokenRefreshSignalUseCase {
    tokenRefreshRepo;
    constructor(tokenRefreshRepo){
        this.tokenRefreshRepo = tokenRefreshRepo;
    }
    async execute(accountId, reason, traceId) {
        // Guard: accountId must be a safe document ID (alphanumeric + hyphen/underscore)
        if (!/^[\w-]+$/.test(accountId)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("TOKEN_REFRESH_INVALID_ACCOUNT_ID", `accountId '${accountId}' is not a valid Firestore document ID`);
        }
        try {
            await this.tokenRefreshRepo.emit({
                accountId,
                reason,
                issuedAt: new Date().toISOString(),
                ...traceId ? {
                    traceId
                } : {}
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(accountId, 0);
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("TOKEN_REFRESH_EMIT_FAILED", err instanceof Error ? err.message : "Failed to emit token refresh signal");
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/infrastructure/firebase/FirebaseIdentityRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseIdentityRepository",
    ()=>FirebaseIdentityRepository
]);
/**
 * FirebaseIdentityRepository — Infrastructure adapter implementing IdentityRepository port.
 * Translates Firebase Auth SDK calls into domain entities.
 * Firebase SDK only exists in this file, never in domain or application layers.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-client] (ecmascript)");
;
;
// ─── Mapper: Firebase User → Domain IdentityEntity ──────────────────────────
function toIdentityEntity(user) {
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAnonymous: user.isAnonymous,
        emailVerified: user.emailVerified
    };
}
class FirebaseIdentityRepository {
    get auth() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async signInWithEmailAndPassword(credentials) {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(this.auth, credentials.email, credentials.password);
        return toIdentityEntity(result.user);
    }
    async signInAnonymously() {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInAnonymously"])(this.auth);
        return toIdentityEntity(result.user);
    }
    async createUserWithEmailAndPassword(input) {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUserWithEmailAndPassword"])(this.auth, input.email, input.password);
        return toIdentityEntity(result.user);
    }
    async updateDisplayName(uid, displayName) {
        const currentUser = this.auth.currentUser;
        if (currentUser && currentUser.uid === uid) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfile"])(currentUser, {
                displayName
            });
        }
    }
    async sendPasswordResetEmail(email) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendPasswordResetEmail"])(this.auth, email);
    }
    async signOut() {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(this.auth);
    }
    getCurrentUser() {
        const user = this.auth.currentUser;
        return user ? toIdentityEntity(user) : null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/infrastructure/firebase/FirebaseTokenRefreshRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseTokenRefreshRepository",
    ()=>FirebaseTokenRefreshRepository
]);
/**
 * FirebaseTokenRefreshRepository — Infrastructure adapter for [S6] TOKEN_REFRESH_SIGNAL.
 * Writes/reads `tokenRefreshSignals/{accountId}` in Firestore.
 * Firebase SDK only exists in this file.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-client] (ecmascript)");
;
;
const COLLECTION = "tokenRefreshSignals";
class FirebaseTokenRefreshRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async emit(signal) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, COLLECTION, signal.accountId), {
            accountId: signal.accountId,
            reason: signal.reason,
            issuedAt: signal.issuedAt,
            ...signal.traceId ? {
                traceId: signal.traceId
            } : {}
        }, {
            merge: true
        });
    }
    subscribe(accountId, onSignal) {
        let isFirstEmission = true;
        const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, COLLECTION, accountId);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])(ref, ()=>{
            if (isFirstEmission) {
                isFirstEmission = false;
                return;
            }
            onSignal();
        });
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/interfaces/hooks/useTokenRefreshListener.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTokenRefreshListener",
    ()=>useTokenRefreshListener
]);
/**
 * useTokenRefreshListener — Client Token Refresh Listener [S6].
 *
 * Party 3 of the three-way Claims refresh handshake:
 *   Party 1 (Claims Handler) — emits TOKEN_REFRESH_SIGNAL to `tokenRefreshSignals/{accountId}`
 *   Party 2 (IER CRITICAL_LANE) — routes role/policy change events
 *   Party 3 (this hook) — listens for signal and force-refreshes Firebase ID token
 *
 * Client obligation per SK_TOKEN_REFRESH_CONTRACT [S6]:
 *   On receiving TOKEN_REFRESH_SIGNAL → getIdToken(true) → new token on subsequent requests.
 *
 * Must be mounted once per authenticated session (e.g. shell layout).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/integration-firebase/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseTokenRefreshRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/infrastructure/firebase/FirebaseTokenRefreshRepository.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const tokenRefreshRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseTokenRefreshRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseTokenRefreshRepository"]();
function useTokenRefreshListener(accountId) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTokenRefreshListener.useEffect": ()=>{
            if (!accountId) return;
            // Guard: accountId must be a valid Firestore document ID
            if (!/^[\w-]+$/.test(accountId)) return;
            const unsubscribe = tokenRefreshRepo.subscribe(accountId, {
                "useTokenRefreshListener.useEffect.unsubscribe": ()=>{
                    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseAuth"])();
                    const currentUser = auth.currentUser;
                    if (!currentUser) return;
                    // [S6] Force-refresh the ID token so subsequent requests carry updated Custom Claims.
                    void currentUser.getIdToken(/* forceRefresh */ true).catch({
                        "useTokenRefreshListener.useEffect.unsubscribe": ()=>{
                        // Non-fatal: token refreshes naturally on next expiry cycle.
                        }
                    }["useTokenRefreshListener.useEffect.unsubscribe"]);
                }
            }["useTokenRefreshListener.useEffect.unsubscribe"]);
            return ({
                "useTokenRefreshListener.useEffect": ()=>unsubscribe()
            })["useTokenRefreshListener.useEffect"];
        }
    }["useTokenRefreshListener.useEffect"], [
        accountId
    ]);
}
_s(useTokenRefreshListener, "OD7bBpZva5O2jO+Puf00hKivP7c=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * identity module public API
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$use$2d$cases$2f$identity$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/application/use-cases/identity.use-cases.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$use$2d$cases$2f$token$2d$refresh$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/application/use-cases/token-refresh.use-cases.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseIdentityRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/infrastructure/firebase/FirebaseIdentityRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseTokenRefreshRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/infrastructure/firebase/FirebaseTokenRefreshRepository.ts [app-client] (ecmascript)");
// Client-only hook — must be imported from the module barrel only from "use client" files
// to avoid RSC bundle contamination.
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$interfaces$2f$hooks$2f$useTokenRefreshListener$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/interfaces/hooks/useTokenRefreshListener.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/identity/api/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "identityApi",
    ()=>identityApi
]);
/**
 * identity 模組公開跨域 API。
 * 所有跨模組呼叫均需透過此檔案，禁止直接引用 identity 模組內部實作。
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseTokenRefreshRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/infrastructure/firebase/FirebaseTokenRefreshRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$use$2d$cases$2f$token$2d$refresh$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/application/use-cases/token-refresh.use-cases.ts [app-client] (ecmascript)");
;
;
// ─── 內部單例 ──────────────────────────────────────────────────────────────────
const tokenRefreshRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseTokenRefreshRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseTokenRefreshRepository"]();
const emitUseCase = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$use$2d$cases$2f$token$2d$refresh$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmitTokenRefreshSignalUseCase"](tokenRefreshRepo);
const identityApi = {
    /**
   * [S6] 發送 TOKEN_REFRESH_SIGNAL，通知前端重新整理 Custom Claims。
   * 應在角色或政策變更後呼叫。
   */ async emitTokenRefreshSignal (input) {
        await emitUseCase.execute(input.accountId, input.reason, input.traceId);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/account/application/use-cases/account.use-cases.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssignAccountRoleUseCase",
    ()=>AssignAccountRoleUseCase,
    "CreateUserAccountUseCase",
    ()=>CreateUserAccountUseCase,
    "CreditWalletUseCase",
    ()=>CreditWalletUseCase,
    "DebitWalletUseCase",
    ()=>DebitWalletUseCase,
    "RevokeAccountRoleUseCase",
    ()=>RevokeAccountRoleUseCase,
    "UpdateUserProfileUseCase",
    ()=>UpdateUserProfileUseCase
]);
/**
 * Account Use Cases — pure business workflows.
 * No React, no Firebase, no UI framework.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/api/index.ts [app-client] (ecmascript)");
;
;
class CreateUserAccountUseCase {
    accountRepo;
    constructor(accountRepo){
        this.accountRepo = accountRepo;
    }
    async execute(userId, name, email) {
        try {
            await this.accountRepo.save({
                id: userId,
                name,
                email,
                accountType: "user"
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(userId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_USER_ACCOUNT_FAILED", err instanceof Error ? err.message : "Failed to create user account");
        }
    }
}
class UpdateUserProfileUseCase {
    accountRepo;
    constructor(accountRepo){
        this.accountRepo = accountRepo;
    }
    async execute(userId, data) {
        try {
            await this.accountRepo.updateProfile(userId, data);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(userId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_USER_PROFILE_FAILED", err instanceof Error ? err.message : "Failed to update user profile");
        }
    }
}
class CreditWalletUseCase {
    accountRepo;
    constructor(accountRepo){
        this.accountRepo = accountRepo;
    }
    async execute(accountId, amount, description) {
        try {
            if (amount <= 0) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WALLET_INVALID_AMOUNT", "Credit amount must be positive");
            }
            const tx = await this.accountRepo.creditWallet(accountId, amount, description);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(tx.id, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WALLET_CREDIT_FAILED", err instanceof Error ? err.message : "Failed to credit wallet");
        }
    }
}
class DebitWalletUseCase {
    accountRepo;
    constructor(accountRepo){
        this.accountRepo = accountRepo;
    }
    async execute(accountId, amount, description) {
        try {
            if (amount <= 0) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WALLET_INVALID_AMOUNT", "Debit amount must be positive");
            }
            const balance = await this.accountRepo.getWalletBalance(accountId);
            if (balance < amount) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WALLET_INSUFFICIENT_FUNDS", "Insufficient wallet balance");
            }
            const tx = await this.accountRepo.debitWallet(accountId, amount, description);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(tx.id, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WALLET_DEBIT_FAILED", err instanceof Error ? err.message : "Failed to debit wallet");
        }
    }
}
class AssignAccountRoleUseCase {
    accountRepo;
    constructor(accountRepo){
        this.accountRepo = accountRepo;
    }
    async execute(accountId, role, grantedBy, traceId) {
        try {
            const record = await this.accountRepo.assignRole(accountId, role, grantedBy);
            // [S6] Emit TOKEN_REFRESH_SIGNAL so frontend force-refreshes Custom Claims.
            await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identityApi"].emitTokenRefreshSignal({
                accountId,
                reason: "role:changed",
                ...traceId ? {
                    traceId
                } : {}
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(record.accountId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("ASSIGN_ROLE_FAILED", err instanceof Error ? err.message : "Failed to assign role");
        }
    }
}
class RevokeAccountRoleUseCase {
    accountRepo;
    constructor(accountRepo){
        this.accountRepo = accountRepo;
    }
    async execute(accountId) {
        try {
            await this.accountRepo.revokeRole(accountId);
            // [S6] Emit TOKEN_REFRESH_SIGNAL after role revocation.
            await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identityApi"].emitTokenRefreshSignal({
                accountId,
                reason: "role:changed"
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(accountId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("REVOKE_ROLE_FAILED", err instanceof Error ? err.message : "Failed to revoke role");
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/account/application/use-cases/account-policy.use-cases.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CreateAccountPolicyUseCase",
    ()=>CreateAccountPolicyUseCase,
    "DeleteAccountPolicyUseCase",
    ()=>DeleteAccountPolicyUseCase,
    "UpdateAccountPolicyUseCase",
    ()=>UpdateAccountPolicyUseCase
]);
/**
 * Account Policy Use Cases — pure business workflows.
 * Per [S6]: account policy changes trigger CUSTOM_CLAIMS refresh (via TOKEN_REFRESH_SIGNAL).
 * No React, no Firebase, no UI framework.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/api/index.ts [app-client] (ecmascript)");
;
;
class CreateAccountPolicyUseCase {
    policyRepo;
    constructor(policyRepo){
        this.policyRepo = policyRepo;
    }
    async execute(input) {
        try {
            const policy = await this.policyRepo.create(input);
            // [S6] Emit token refresh signal after policy change so frontend refreshes claims.
            await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identityApi"].emitTokenRefreshSignal({
                accountId: input.accountId,
                reason: "policy:changed",
                ...input.traceId ? {
                    traceId: input.traceId
                } : {}
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(policy.id, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CREATE_ACCOUNT_POLICY_FAILED", err instanceof Error ? err.message : "Failed to create account policy");
        }
    }
}
class UpdateAccountPolicyUseCase {
    policyRepo;
    constructor(policyRepo){
        this.policyRepo = policyRepo;
    }
    async execute(policyId, accountId, data) {
        try {
            const existing = await this.policyRepo.findById(policyId);
            if (!existing) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("ACCOUNT_POLICY_NOT_FOUND", `Policy ${policyId} not found`);
            }
            await this.policyRepo.update(policyId, data);
            // [S6] Emit refresh signal after policy change.
            await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identityApi"].emitTokenRefreshSignal({
                accountId,
                reason: "policy:changed"
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(policyId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("UPDATE_ACCOUNT_POLICY_FAILED", err instanceof Error ? err.message : "Failed to update account policy");
        }
    }
}
class DeleteAccountPolicyUseCase {
    policyRepo;
    constructor(policyRepo){
        this.policyRepo = policyRepo;
    }
    async execute(policyId, accountId) {
        try {
            const existing = await this.policyRepo.findById(policyId);
            if (!existing) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("ACCOUNT_POLICY_NOT_FOUND", `Policy ${policyId} not found`);
            }
            await this.policyRepo.delete(policyId);
            // [S6] Emit refresh signal after policy deletion.
            await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["identityApi"].emitTokenRefreshSignal({
                accountId,
                reason: "policy:changed"
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(policyId, Date.now());
        } catch (err) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("DELETE_ACCOUNT_POLICY_FAILED", err instanceof Error ? err.message : "Failed to delete account policy");
        }
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/account/infrastructure/firebase/FirebaseAccountRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseAccountRepository",
    ()=>FirebaseAccountRepository
]);
/**
 * FirebaseAccountRepository — Infrastructure adapter for account persistence.
 * Translates Firestore documents ↔ Domain AccountEntity.
 * Firebase SDK only exists in this file.
 * Wallet operations use Firestore transactions for atomic balance enforcement.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-client] (ecmascript)");
;
;
// ─── Firestore ↔ Domain Mapper ────────────────────────────────────────────────
function toAccountEntity(id, data) {
    return {
        id,
        name: typeof data.name === "string" ? data.name : "",
        accountType: data.accountType === "organization" ? "organization" : "user",
        email: typeof data.email === "string" ? data.email : undefined,
        photoURL: typeof data.photoURL === "string" ? data.photoURL : undefined,
        bio: typeof data.bio === "string" ? data.bio : undefined,
        wallet: data.wallet != null ? data.wallet : undefined,
        theme: data.theme != null ? data.theme : undefined,
        members: Array.isArray(data.members) ? data.members : undefined,
        memberIds: Array.isArray(data.memberIds) ? data.memberIds : undefined,
        teams: Array.isArray(data.teams) ? data.teams : undefined,
        ownerId: typeof data.ownerId === "string" ? data.ownerId : undefined,
        createdAt: data.createdAt
    };
}
class FirebaseAccountRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async findById(id) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, "accounts", id));
        if (!snap.exists()) return null;
        return toAccountEntity(snap.id, snap.data());
    }
    async save(account) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, "accounts", account.id), {
            name: account.name,
            accountType: account.accountType,
            email: account.email ?? null,
            photoURL: account.photoURL ?? null,
            bio: account.bio ?? null,
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
    async updateProfile(userId, data) {
        const updates = {
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        };
        if (data.name !== undefined) updates.name = data.name;
        if (data.bio !== undefined) updates.bio = data.bio;
        if (data.photoURL !== undefined) updates.photoURL = data.photoURL;
        if (data.theme !== undefined) updates.theme = data.theme;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, "accounts", userId), updates);
    }
    async getWalletBalance(accountId) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, "accounts", accountId));
        if (!snap.exists()) return 0;
        const data = snap.data();
        const wallet = data.wallet;
        return typeof wallet?.balance === "number" ? wallet.balance : 0;
    }
    async creditWallet(accountId, amount, description) {
        const db = this.db;
        const accountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(db, "accounts", accountId);
        let txId;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runTransaction"])(db, async (txn)=>{
            const snap = await txn.get(accountRef);
            const current = snap.exists() ? snap.data().wallet : undefined;
            const currentBalance = typeof current?.balance === "number" ? current.balance : 0;
            txn.update(accountRef, {
                "wallet.balance": currentBalance + amount,
                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
        });
        // Append ledger entry
        const txRef = await __turbopack_context__.A("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript, async loader)").then(async ({ addDoc })=>{
            txId = crypto.randomUUID();
            return addDoc((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(db, "accounts", accountId, "walletTransactions"), {
                id: txId,
                accountId,
                type: "credit",
                amount,
                reason: description,
                occurredAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
        });
        return {
            id: txRef.id,
            accountId,
            amount,
            description,
            createdAt: {
                seconds: Date.now() / 1000,
                nanoseconds: 0,
                toDate: ()=>new Date()
            }
        };
    }
    async debitWallet(accountId, amount, description) {
        const db = this.db;
        const accountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(db, "accounts", accountId);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runTransaction"])(db, async (txn)=>{
            const snap = await txn.get(accountRef);
            const current = snap.exists() ? snap.data().wallet : undefined;
            const currentBalance = typeof current?.balance === "number" ? current.balance : 0;
            if (currentBalance < amount) {
                throw new Error(`Insufficient wallet balance: have ${currentBalance}, need ${amount}`);
            }
            txn.update(accountRef, {
                "wallet.balance": currentBalance - amount,
                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
        });
        const txRef = await __turbopack_context__.A("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript, async loader)").then(async ({ addDoc })=>addDoc((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(db, "accounts", accountId, "walletTransactions"), {
                accountId,
                type: "debit",
                amount,
                reason: description,
                occurredAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            }));
        return {
            id: txRef.id,
            accountId,
            amount,
            description,
            createdAt: {
                seconds: Date.now() / 1000,
                nanoseconds: 0,
                toDate: ()=>new Date()
            }
        };
    }
    async assignRole(accountId, role, grantedBy) {
        const now = new Date().toISOString();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, "accountRoles", accountId), {
            accountId,
            role,
            grantedBy,
            grantedAt: now,
            isActive: true,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        }, {
            merge: true
        });
        return {
            accountId,
            role,
            grantedBy,
            grantedAt: {
                seconds: Date.now() / 1000,
                nanoseconds: 0,
                toDate: ()=>new Date()
            }
        };
    }
    async revokeRole(accountId) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, "accountRoles", accountId), {
            isActive: false,
            revokedAt: new Date().toISOString(),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
    async getRole(accountId) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, "accountRoles", accountId));
        if (!snap.exists()) return null;
        const data = snap.data();
        return {
            accountId,
            role: data.role,
            grantedBy: data.grantedBy,
            grantedAt: data.grantedAt
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/account/infrastructure/firebase/FirebaseAccountPolicyRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseAccountPolicyRepository",
    ()=>FirebaseAccountPolicyRepository
]);
/**
 * FirebaseAccountPolicyRepository — Infrastructure adapter for account policy persistence.
 * Firebase SDK only exists in this file.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-client] (ecmascript)");
;
;
function toAccountPolicy(id, data) {
    return {
        id,
        accountId: data.accountId,
        name: typeof data.name === "string" ? data.name : "",
        description: typeof data.description === "string" ? data.description : "",
        rules: Array.isArray(data.rules) ? data.rules : [],
        isActive: data.isActive === true,
        createdAt: typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
        updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
        traceId: typeof data.traceId === "string" ? data.traceId : undefined
    };
}
class FirebaseAccountPolicyRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async findById(id) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, "accountPolicies", id));
        if (!snap.exists()) return null;
        return toAccountPolicy(snap.id, snap.data());
    }
    async findAllByAccountId(accountId) {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(this.db, "accountPolicies"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("accountId", "==", accountId));
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
        return snaps.docs.map((d)=>toAccountPolicy(d.id, d.data()));
    }
    async findActiveByAccountId(accountId) {
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(this.db, "accountPolicies"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("accountId", "==", accountId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("isActive", "==", true));
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
        return snaps.docs.map((d)=>toAccountPolicy(d.id, d.data()));
    }
    async create(input) {
        const now = new Date().toISOString();
        const ref = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(this.db, "accountPolicies"), {
            accountId: input.accountId,
            name: input.name,
            description: input.description,
            rules: input.rules,
            isActive: true,
            createdAt: now,
            updatedAt: now,
            ...input.traceId ? {
                traceId: input.traceId
            } : {},
            _createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        return {
            id: ref.id,
            accountId: input.accountId,
            name: input.name,
            description: input.description,
            rules: input.rules,
            isActive: true,
            createdAt: now,
            updatedAt: now,
            traceId: input.traceId
        };
    }
    async update(id, data) {
        const updates = {
            updatedAt: new Date().toISOString(),
            _updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        };
        if (data.name !== undefined) updates.name = data.name;
        if (data.description !== undefined) updates.description = data.description;
        if (data.rules !== undefined) updates.rules = data.rules;
        if (data.isActive !== undefined) updates.isActive = data.isActive;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, "accountPolicies", id), updates);
    }
    async delete(id) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, "accountPolicies", id));
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/account/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * account module public API
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$account$2f$application$2f$use$2d$cases$2f$account$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/account/application/use-cases/account.use-cases.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$account$2f$application$2f$use$2d$cases$2f$account$2d$policy$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/account/application/use-cases/account-policy.use-cases.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$account$2f$infrastructure$2f$firebase$2f$FirebaseAccountRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/account/infrastructure/firebase/FirebaseAccountRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$account$2f$infrastructure$2f$firebase$2f$FirebaseAccountPolicyRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/account/infrastructure/firebase/FirebaseAccountPolicyRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$account$2f$infrastructure$2f$firebase$2f$FirebaseAccountQueryRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/account/infrastructure/firebase/FirebaseAccountQueryRepository.ts [app-client] (ecmascript)");
// Read queries (callable from React hooks/components)
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$account$2f$interfaces$2f$queries$2f$account$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/account/interfaces/queries/account.queries.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(public)/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PublicPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * app/(public)/page.tsx
 * Public landing page with top-right auth entry and inline auth panel.
 * Uses identity module use cases directly on the client so Firebase auth state
 * actually updates AuthProvider via onAuthStateChanged.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/auth-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/identity/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseIdentityRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/infrastructure/firebase/FirebaseIdentityRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$use$2d$cases$2f$identity$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/application/use-cases/identity.use-cases.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$account$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/account/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$account$2f$application$2f$use$2d$cases$2f$account$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/account/application/use-cases/account.use-cases.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$account$2f$infrastructure$2f$firebase$2f$FirebaseAccountRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/account/infrastructure/firebase/FirebaseAccountRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$dev$2d$demo$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/dev-demo-auth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function PublicPage() {
    _s();
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("login");
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [resetSent, setResetSent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAuthPanelOpen, setIsAuthPanelOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { signInUseCase, signInAnonymouslyUseCase, registerUseCase, sendPasswordResetEmailUseCase, createUserAccountUseCase } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PublicPage.useMemo": ()=>{
            const identityRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$infrastructure$2f$firebase$2f$FirebaseIdentityRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseIdentityRepository"]();
            const accountRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$account$2f$infrastructure$2f$firebase$2f$FirebaseAccountRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseAccountRepository"]();
            return {
                signInUseCase: new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$use$2d$cases$2f$identity$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SignInUseCase"](identityRepo),
                signInAnonymouslyUseCase: new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$use$2d$cases$2f$identity$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SignInAnonymouslyUseCase"](identityRepo),
                registerUseCase: new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$use$2d$cases$2f$identity$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RegisterUseCase"](identityRepo),
                sendPasswordResetEmailUseCase: new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$application$2f$use$2d$cases$2f$identity$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SendPasswordResetEmailUseCase"](identityRepo),
                createUserAccountUseCase: new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$account$2f$application$2f$use$2d$cases$2f$account$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreateUserAccountUseCase"](accountRepo)
            };
        }
    }["PublicPage.useMemo"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PublicPage.useEffect": ()=>{
            if (state.status === "authenticated") {
                router.replace("/dashboard");
            }
        }
    }["PublicPage.useEffect"], [
        state.status,
        router
    ]);
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$dev$2d$demo$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLocalDevDemoAllowed"])() && tab === "login" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$dev$2d$demo$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDevDemoCredential"])(email, password)) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$dev$2d$demo$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeDevDemoSession"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$dev$2d$demo$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDevDemoUser"])());
                window.location.assign("/dashboard");
                return;
            }
            const result = tab === "login" ? await signInUseCase.execute({
                email,
                password
            }) : await registerUseCase.execute({
                email,
                password,
                name
            });
            if (!result.success) {
                setError(result.error.message);
                return;
            }
            if (tab === "register") {
                const accountResult = await createUserAccountUseCase.execute(result.aggregateId, name, email);
                if (!accountResult.success) {
                    setError(accountResult.error.message);
                }
            }
        } finally{
            setIsLoading(false);
        }
    }
    async function handleGuestAccess() {
        setError(null);
        setIsLoading(true);
        try {
            const result = await signInAnonymouslyUseCase.execute();
            if (!result.success) {
                // Dev-mode fallback: when Firebase anonymous auth is unavailable (e.g. network
                // blocked in sandboxes), create a local guest session so the shell can be tested.
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$dev$2d$demo$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLocalDevDemoAllowed"])()) {
                    const guestUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$dev$2d$demo$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDevDemoUser"])();
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$dev$2d$demo$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeDevDemoSession"])(guestUser);
                    dispatch({
                        type: "SET_AUTH_STATE",
                        payload: {
                            user: guestUser,
                            status: "authenticated"
                        }
                    });
                } else {
                    setError(result.error.message);
                }
            }
        } finally{
            setIsLoading(false);
        }
    }
    async function handlePasswordReset() {
        if (!email) {
            setError("Enter your email address first.");
            return;
        }
        setIsLoading(true);
        try {
            const result = await sendPasswordResetEmailUseCase.execute(email);
            if (result.success) {
                setResetSent(true);
                setError(null);
            } else {
                setError(result.error.message);
            }
        } finally{
            setIsLoading(false);
        }
    }
    if (state.status === "initializing") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "h-8 w-8 animate-spin text-primary"
            }, void 0, false, {
                fileName: "[project]/app/(public)/page.tsx",
                lineNumber: 150,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(public)/page.tsx",
            lineNumber: 149,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "mx-auto flex w-full max-w-6xl items-center justify-end px-6 py-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: ()=>{
                        setError(null);
                        setResetSent(false);
                        setIsAuthPanelOpen((prev)=>!prev);
                    },
                    className: "rounded-lg border border-border/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted",
                    children: isAuthPanelOpen ? "Close" : "Sign In"
                }, void 0, false, {
                    fileName: "[project]/app/(public)/page.tsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(public)/page.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto grid w-full max-w-6xl gap-8 px-6 pb-10 pt-4 md:grid-cols-[1fr_420px] md:items-start",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-border/40 bg-card/40 p-8 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold tracking-tight md:text-4xl",
                                children: "Xuanwu App"
                            }, void 0, false, {
                                fileName: "[project]/app/(public)/page.tsx",
                                lineNumber: 173,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-3 max-w-xl text-sm leading-6 text-muted-foreground md:text-base",
                                children: "Unified MDDD/Hexagonal workspace for identity, account, and organization modules. Use the top-right sign in button to access your dashboard."
                            }, void 0, false, {
                                fileName: "[project]/app/(public)/page.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(public)/page.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    isAuthPanelOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full rounded-2xl border border-border/50 bg-card shadow-xl ring-1 ring-border/30",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center pb-4 pt-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 ring-1 ring-primary/20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                        className: "h-7 w-7 text-primary/90"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(public)/page.tsx",
                                        lineNumber: 184,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(public)/page.tsx",
                                    lineNumber: 183,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(public)/page.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-6 grid h-10 grid-cols-2 rounded-lg border border-border/40 bg-muted/30 p-1",
                                        children: [
                                            "login",
                                            "register"
                                        ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    setTab(t);
                                                    setError(null);
                                                },
                                                className: `rounded-md text-xs font-semibold capitalize tracking-tight transition-all ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
                                                children: t === "login" ? "Sign In" : "Register"
                                            }, t, false, {
                                                fileName: "[project]/app/(public)/page.tsx",
                                                lineNumber: 191,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/(public)/page.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleSubmit,
                                        className: "flex flex-col gap-4",
                                        children: [
                                            tab === "register" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-xs font-semibold text-muted-foreground",
                                                        children: "Name"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(public)/page.tsx",
                                                        lineNumber: 212,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: name,
                                                        onChange: (e)=>setName(e.target.value),
                                                        placeholder: "Your display name",
                                                        required: true,
                                                        className: "h-10 rounded-lg border border-border/50 bg-background/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(public)/page.tsx",
                                                        lineNumber: 213,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(public)/page.tsx",
                                                lineNumber: 211,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-xs font-semibold text-muted-foreground",
                                                        children: "Email"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(public)/page.tsx",
                                                        lineNumber: 225,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "email",
                                                        value: email,
                                                        onChange: (e)=>setEmail(e.target.value),
                                                        placeholder: "email@example.com",
                                                        autoComplete: "email",
                                                        required: true,
                                                        className: "h-10 rounded-lg border border-border/50 bg-background/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(public)/page.tsx",
                                                        lineNumber: 226,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(public)/page.tsx",
                                                lineNumber: 224,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs font-semibold text-muted-foreground",
                                                                children: "Password"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(public)/page.tsx",
                                                                lineNumber: 239,
                                                                columnNumber: 21
                                                            }, this),
                                                            tab === "login" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: handlePasswordReset,
                                                                className: "text-xs text-primary/70 hover:text-primary",
                                                                children: resetSent ? "Email sent!" : "Forgot password?"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(public)/page.tsx",
                                                                lineNumber: 241,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(public)/page.tsx",
                                                        lineNumber: 238,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "password",
                                                        value: password,
                                                        onChange: (e)=>setPassword(e.target.value),
                                                        placeholder: "••••••••",
                                                        autoComplete: tab === "login" ? "current-password" : "new-password",
                                                        required: true,
                                                        className: "h-10 rounded-lg border border-border/50 bg-background/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(public)/page.tsx",
                                                        lineNumber: 250,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(public)/page.tsx",
                                                lineNumber: 237,
                                                columnNumber: 17
                                            }, this),
                                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive",
                                                children: error
                                            }, void 0, false, {
                                                fileName: "[project]/app/(public)/page.tsx",
                                                lineNumber: 262,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "submit",
                                                disabled: isLoading,
                                                className: "mt-1 flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-105 disabled:opacity-60",
                                                children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "h-4 w-4 animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(public)/page.tsx",
                                                    lineNumber: 273,
                                                    columnNumber: 21
                                                }, this) : tab === "login" ? "Enter Dimension" : "Create Account"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(public)/page.tsx",
                                                lineNumber: 267,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(public)/page.tsx",
                                        lineNumber: 209,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(public)/page.tsx",
                                lineNumber: 188,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 border-t border-border/40 bg-muted/10 px-6 pb-7 pt-5",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleGuestAccess,
                                    disabled: isLoading,
                                    className: "flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/55 text-xs font-semibold text-muted-foreground transition-all hover:border-primary/35 hover:bg-primary/5 hover:text-primary disabled:opacity-60",
                                    children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "h-4 w-4 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(public)/page.tsx",
                                        lineNumber: 290,
                                        columnNumber: 30
                                    }, this) : "Continue as Guest"
                                }, void 0, false, {
                                    fileName: "[project]/app/(public)/page.tsx",
                                    lineNumber: 284,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(public)/page.tsx",
                                lineNumber: 283,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(public)/page.tsx",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(public)/page.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(public)/page.tsx",
        lineNumber: 156,
        columnNumber: 5
    }, this);
}
_s(PublicPage, "1UZrrNzWuYDjDMWakc0+SmNwxpE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = PublicPage;
var _c;
__turbopack_context__.k.register(_c, "PublicPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Loader2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ShieldCheck
]);
/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y"
        }
    ],
    [
        "path",
        {
            d: "m9 12 2 2 4-4",
            key: "dzmm74"
        }
    ]
];
const ShieldCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("shield-check", __iconNode);
;
 //# sourceMappingURL=shield-check.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShieldCheck",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_a0578bd2._.js.map