(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/(shell)/_components/account-switcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccountSwitcher",
    ()=>AccountSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/app-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/organization/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$interfaces$2f$_actions$2f$data$3a$4b2249__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/organization/interfaces/_actions/data:4b2249 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/input.tsx [app-client] (ecmascript)");
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
function AccountSwitcher({ personalAccount, organizationAccounts, activeAccountId, onSelectPersonal, onSelectOrganization, onOrganizationCreated }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { state: { accountsHydrated, bootstrapPhase } } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const [isCreateOrganizationOpen, setIsCreateOrganizationOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [organizationName, setOrganizationName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [organizationError, setOrganizationError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isCreatingOrganization, setIsCreatingOrganization] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    function resetCreateOrganizationDialog() {
        setOrganizationName("");
        setOrganizationError(null);
        setIsCreatingOrganization(false);
    }
    async function handleCreateOrganization(event) {
        event.preventDefault();
        if (!personalAccount) {
            setOrganizationError("帳號資訊已失效，請重新登入後再建立組織。");
            return;
        }
        const nextOrganizationName = organizationName.trim();
        if (!nextOrganizationName) {
            setOrganizationError("請輸入組織名稱。");
            return;
        }
        setIsCreatingOrganization(true);
        setOrganizationError(null);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$interfaces$2f$_actions$2f$data$3a$4b2249__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createOrganization"])({
            organizationName: nextOrganizationName,
            ownerId: personalAccount.id,
            ownerName: personalAccount.name,
            ownerEmail: personalAccount.email
        });
        if (!result.success) {
            setOrganizationError(result.error.message);
            setIsCreatingOrganization(false);
            return;
        }
        onOrganizationCreated?.({
            id: result.aggregateId,
            name: nextOrganizationName,
            accountType: "organization",
            ownerId: personalAccount.id
        });
        resetCreateOrganizationDialog();
        setIsCreateOrganizationOpen(false);
        router.push("/organization");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                        children: "帳號情境"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        "aria-label": "切換帳號情境",
                        value: activeAccountId ?? "",
                        onChange: (event)=>{
                            const nextId = event.target.value;
                            if (nextId === "__create_organization__") {
                                setIsCreateOrganizationOpen(true);
                                return;
                            }
                            if (!nextId || nextId === personalAccount?.id) {
                                onSelectPersonal();
                                return;
                            }
                            const nextAccount = organizationAccounts.find((account)=>account.id === nextId);
                            if (nextAccount) {
                                onSelectOrganization(nextAccount);
                            }
                        },
                        className: "w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground",
                        children: [
                            personalAccount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: personalAccount.id,
                                children: [
                                    personalAccount.name,
                                    "（個人）"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                lineNumber: 124,
                                columnNumber: 13
                            }, this),
                            organizationAccounts.map((account)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: account.id,
                                    children: [
                                        account.name,
                                        "（組織）"
                                    ]
                                }, account.id, true, {
                                    fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                    lineNumber: 127,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "__create_organization__",
                                children: "+建立組織"
                            }, void 0, false, {
                                fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    !accountsHydrated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-muted-foreground",
                        children: bootstrapPhase === "seeded" ? "正在同步組織上下文…" : "正在載入帳號上下文…"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isCreateOrganizationOpen,
                onOpenChange: (open)=>{
                    setIsCreateOrganizationOpen(open);
                    if (!open) {
                        resetCreateOrganizationDialog();
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    "aria-describedby": "create-organization-description",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: "建立新組織"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    id: "create-organization-description",
                                    children: "輸入名稱後會直接建立組織並切換到新的組織內容。"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "space-y-4",
                            onSubmit: handleCreateOrganization,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-foreground",
                                            htmlFor: "organization-name",
                                            children: "組織名稱"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                            lineNumber: 159,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "organization-name",
                                            value: organizationName,
                                            onChange: (event)=>{
                                                setOrganizationName(event.target.value);
                                                if (organizationError) {
                                                    setOrganizationError(null);
                                                }
                                            },
                                            placeholder: "例如：Gig Team",
                                            autoFocus: true,
                                            disabled: isCreatingOrganization,
                                            maxLength: 80
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                            lineNumber: 162,
                                            columnNumber: 15
                                        }, this),
                                        organizationError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-destructive",
                                            children: organizationError
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                            lineNumber: 176,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            variant: "outline",
                                            onClick: ()=>{
                                                resetCreateOrganizationDialog();
                                                setIsCreateOrganizationOpen(false);
                                            },
                                            disabled: isCreatingOrganization,
                                            children: "取消"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                            lineNumber: 180,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "submit",
                                            disabled: isCreatingOrganization || !personalAccount,
                                            children: isCreatingOrganization ? "建立中…" : "直接建立"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                            lineNumber: 191,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                                    lineNumber: 179,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                            lineNumber: 157,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/account-switcher.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(AccountSwitcher, "E1nH++TEFOWbjJq4TOIR1lw4LJw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"]
    ];
});
_c = AccountSwitcher;
var _c;
__turbopack_context__.k.register(_c, "AccountSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/app-breadcrumbs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppBreadcrumbs",
    ()=>AppBreadcrumbs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const SEGMENT_LABELS = {
    "dashboard": "儀表板",
    "organization": "組織",
    "workspace": "工作區",
    "wiki-beta": "Wiki-Beta",
    "rag-query": "RAG 查詢",
    "documents": "文件",
    "libraries": "Libraries",
    "pages": "頁面",
    "pages-dnd": "頁面 (DnD)",
    "block-editor": "區塊編輯器",
    "rag-reindex": "RAG 重新索引",
    "settings": "設定",
    "ai-chat": "AI 對話",
    "dev-tools": "開發工具",
    "namespaces": "命名空間",
    "members": "成員",
    "teams": "團隊",
    "permissions": "權限",
    "workspaces": "工作區清單",
    "schedule": "排程",
    "daily": "每日",
    "audit": "稽核"
};
function segmentLabel(segment) {
    return SEGMENT_LABELS[segment] ?? segment;
}
function AppBreadcrumbs() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const segments = pathname.split("/").filter(Boolean);
    // Only render when there's more than one segment (i.e., not just root page).
    if (segments.length <= 1) return null;
    const crumbs = segments.map((seg, idx)=>({
            label: segmentLabel(seg),
            href: "/" + segments.slice(0, idx + 1).join("/")
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Breadcrumb",
        className: "hidden items-center gap-1 text-xs text-muted-foreground sm:flex",
        children: crumbs.map((crumb, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex items-center gap-1",
                children: [
                    idx > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                        className: "size-3 opacity-40"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-breadcrumbs.tsx",
                        lineNumber: 52,
                        columnNumber: 23
                    }, this),
                    idx < crumbs.length - 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: crumb.href,
                        className: "transition hover:text-foreground",
                        children: crumb.label
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-breadcrumbs.tsx",
                        lineNumber: 54,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-foreground",
                        children: crumb.label
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-breadcrumbs.tsx",
                        lineNumber: 61,
                        columnNumber: 13
                    }, this)
                ]
            }, crumb.href, true, {
                fileName: "[project]/app/(shell)/_components/app-breadcrumbs.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/app/(shell)/_components/app-breadcrumbs.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(AppBreadcrumbs, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AppBreadcrumbs;
var _c;
__turbopack_context__.k.register(_c, "AppBreadcrumbs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/app-rail.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppRail",
    ()=>AppRail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Module: app-rail.tsx
 * Purpose: render the narrow leftmost icon rail (app rail) of the authenticated shell.
 * Responsibilities: app logo, account context switcher, top-level section icon nav with
 *   tooltips, and quick sign-out via user avatar dropdown at the bottom.
 * Constraints: UI-only; follows the two-column sidebar pattern from Plane's AppRailRoot.
 *   `h-full` ensures it fills the parent `h-screen` container.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-client] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flask-conical.js [app-client] (ecmascript) <export default as FlaskConical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$notebook$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__NotebookText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/notebook-text.js [app-client] (ecmascript) <export default as NotebookText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-round.js [app-client] (ecmascript) <export default as UserRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/organization/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$interfaces$2f$_actions$2f$data$3a$4b2249__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/organization/interfaces/_actions/data:4b2249 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/workspace/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$_actions$2f$data$3a$45dcaf__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/_actions/data:45dcaf [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/tooltip.tsx [app-client] (ecmascript)");
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
;
;
;
;
;
function isExactOrChildPath(targetPath, pathname) {
    return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}
function getInitial(name) {
    return name?.trim().charAt(0).toUpperCase() || "U";
}
function AppRail({ pathname, user, activeAccount, organizationAccounts, workspaces, workspacesHydrated, isOrganizationAccount, onSelectPersonal, onSelectOrganization, activeWorkspaceId, onSelectWorkspace, onOrganizationCreated, onSignOut }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isCreateOrgOpen, setIsCreateOrgOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [orgName, setOrgName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [orgError, setOrgError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isCreating, setIsCreating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [workspaceName, setWorkspaceName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [workspaceCreateError, setWorkspaceCreateError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isCreatingWorkspace, setIsCreatingWorkspace] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    function resetDialog() {
        setOrgName("");
        setOrgError(null);
        setIsCreating(false);
    }
    function resetWorkspaceDialog() {
        setWorkspaceName("");
        setWorkspaceCreateError(null);
        setIsCreatingWorkspace(false);
    }
    async function handleCreateWorkspace(event) {
        event.preventDefault();
        const name = workspaceName.trim();
        if (!name) {
            setWorkspaceCreateError("請輸入工作區名稱。");
            return;
        }
        if (!activeAccount) {
            setWorkspaceCreateError("帳號資訊已失效，請重新登入後再建立工作區。");
            return;
        }
        setIsCreatingWorkspace(true);
        setWorkspaceCreateError(null);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$_actions$2f$data$3a$45dcaf__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createWorkspace"])({
            name,
            accountId: activeAccount.id,
            accountType: isOrganizationAccount ? "organization" : "user"
        });
        if (!result.success) {
            setWorkspaceCreateError(result.error.message);
            setIsCreatingWorkspace(false);
            return;
        }
        resetWorkspaceDialog();
        setIsCreateWorkspaceOpen(false);
        router.push("/workspace");
    }
    async function handleCreateOrg(event) {
        event.preventDefault();
        if (!user) {
            setOrgError("帳號資訊已失效，請重新登入後再建立組織。");
            return;
        }
        const name = orgName.trim();
        if (!name) {
            setOrgError("請輸入組織名稱。");
            return;
        }
        setIsCreating(true);
        setOrgError(null);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$organization$2f$interfaces$2f$_actions$2f$data$3a$4b2249__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createOrganization"])({
            organizationName: name,
            ownerId: user.id,
            ownerName: user.name,
            ownerEmail: user.email
        });
        if (!result.success) {
            setOrgError(result.error.message);
            setIsCreating(false);
            return;
        }
        const newAccount = {
            id: result.aggregateId,
            name,
            accountType: "organization",
            ownerId: user.id
        };
        onOrganizationCreated?.(newAccount);
        resetDialog();
        setIsCreateOrgOpen(false);
        router.push("/organization");
    }
    function isActive(href) {
        return pathname === href || pathname.startsWith(`${href}/`);
    }
    const railItems = [
        {
            href: "/workspace",
            label: "工作區中心",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 192,
                columnNumber: 13
            }, this)
        },
        {
            href: "/wiki-beta",
            label: "Account Wiki-Beta",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 197,
                columnNumber: 13
            }, this)
        },
        {
            href: "/ai-chat",
            label: "AI 對話",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 202,
                columnNumber: 13
            }, this)
        },
        {
            href: "/organization/members",
            label: "成員",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__["UserRound"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 207,
                columnNumber: 13
            }, this),
            show: isOrganizationAccount,
            isActive: (currentPathname)=>isExactOrChildPath("/organization/members", currentPathname)
        },
        {
            href: "/organization/teams",
            label: "團隊",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 214,
                columnNumber: 13
            }, this),
            show: isOrganizationAccount,
            isActive: (currentPathname)=>isExactOrChildPath("/organization/teams", currentPathname)
        },
        {
            href: "/organization/permissions",
            label: "權限",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 221,
                columnNumber: 13
            }, this),
            show: isOrganizationAccount,
            isActive: (currentPathname)=>isExactOrChildPath("/organization/permissions", currentPathname)
        },
        {
            href: "/organization/daily",
            label: "每日",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$notebook$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__NotebookText$3e$__["NotebookText"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 228,
                columnNumber: 13
            }, this),
            show: isOrganizationAccount,
            isActive: (currentPathname)=>isExactOrChildPath("/organization/daily", currentPathname)
        },
        {
            href: "/organization/schedule",
            label: "排程",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 235,
                columnNumber: 13
            }, this),
            show: isOrganizationAccount,
            isActive: (currentPathname)=>isExactOrChildPath("/organization/schedule", currentPathname)
        },
        {
            href: "/organization/audit",
            label: "稽核",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 242,
                columnNumber: 13
            }, this),
            show: isOrganizationAccount,
            isActive: (currentPathname)=>isExactOrChildPath("/organization/audit", currentPathname)
        },
        {
            href: "/dev-tools",
            label: "開發工具",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flask$2d$conical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FlaskConical$3e$__["FlaskConical"], {
                className: "size-[18px]"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 249,
                columnNumber: 13
            }, this)
        }
    ];
    /** Settings is pinned above the avatar, separate from main nav */ const settingsHref = "/settings";
    const visibleRailItems = railItems.filter((item)=>item.show !== false);
    const sortedWorkspaces = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AppRail.useMemo[sortedWorkspaces]": ()=>[
                ...workspaces
            ].sort({
                "AppRail.useMemo[sortedWorkspaces]": (a, b)=>a.name.localeCompare(b.name, "zh-Hant")
            }["AppRail.useMemo[sortedWorkspaces]"])
    }["AppRail.useMemo[sortedWorkspaces]"], [
        workspaces
    ]);
    function buildWikiBetaWorkspaceHref(workspaceId) {
        if (pathname.startsWith("/wiki-beta")) {
            const targetPath = pathname === "/wiki-beta" ? "/wiki-beta/documents" : pathname;
            return `${targetPath}?workspaceId=${encodeURIComponent(workspaceId)}`;
        }
        return `/wiki-beta/documents?workspaceId=${encodeURIComponent(workspaceId)}`;
    }
    const accountName = activeAccount?.name ?? user?.name ?? "—";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipProvider"], {
        delayDuration: 400,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                "aria-label": "App navigation rail",
                className: "hidden h-full w-12 shrink-0 flex-col items-center border-r border-border/50 bg-card/40 py-2 md:flex",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                "aria-label": "切換帳號情境",
                                                className: "mb-1 flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold tracking-tight text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                                children: getInitial(accountName)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 284,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 283,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 282,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                        side: "right",
                                        className: "max-w-[180px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-medium",
                                                children: accountName
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 294,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-muted-foreground",
                                                children: isOrganizationAccount ? "組織帳號" : "個人帳號"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 295,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 293,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                lineNumber: 281,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                side: "right",
                                align: "start",
                                className: "w-52",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                        className: "text-xs text-muted-foreground",
                                        children: "切換帳號"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 302,
                                        columnNumber: 13
                                    }, this),
                                    user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: onSelectPersonal,
                                        className: activeAccount?.id === user.id ? "bg-primary/10 text-primary" : "",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: [
                                                user.name,
                                                " (Personal)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 308,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 304,
                                        columnNumber: 15
                                    }, this),
                                    organizationAccounts.map((account)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>{
                                                onSelectOrganization(account);
                                            },
                                            className: activeAccount?.id === account.id ? "bg-primary/10 text-primary" : "",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate",
                                                children: account.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 319,
                                                columnNumber: 17
                                            }, this)
                                        }, account.id, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 312,
                                            columnNumber: 15
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 322,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>{
                                            setIsCreateOrgOpen(true);
                                        },
                                        className: "gap-2 text-primary",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "size-3.5 shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 329,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "建立組織"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 330,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 323,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                lineNumber: 301,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "my-2 h-px w-7 bg-border/50"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "flex flex-col items-center gap-0.5",
                        "aria-label": "主要導覽",
                        children: visibleRailItems.map((item)=>{
                            const active = item.isActive?.(pathname) ?? isActive(item.href);
                            if (item.href === "/workspace") {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                    asChild: true,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                        asChild: true,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            "aria-current": active ? "page" : undefined,
                                                            "aria-label": "工作區中心：切換工作區",
                                                            className: `flex h-9 w-9 items-center justify-center rounded-lg transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                            children: item.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                            lineNumber: 348,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                        lineNumber: 347,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 346,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                    side: "right",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs",
                                                        children: "工作區中心：切換工作區"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                        lineNumber: 363,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 362,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 345,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                            side: "right",
                                            align: "start",
                                            className: "w-56",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "工作區"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 368,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: ()=>{
                                                        router.push("/workspace");
                                                    },
                                                    className: pathname === "/workspace" ? "bg-primary/10 text-primary" : "",
                                                    children: "工作區中心"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 369,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 377,
                                                    columnNumber: 21
                                                }, this),
                                                !workspacesHydrated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    disabled: true,
                                                    children: "工作區載入中..."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 379,
                                                    columnNumber: 23
                                                }, this) : sortedWorkspaces.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    disabled: true,
                                                    children: "目前帳號沒有工作區"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 23
                                                }, this) : sortedWorkspaces.map((workspace)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>{
                                                            onSelectWorkspace(workspace.id);
                                                            router.push(`/workspace/${workspace.id}`);
                                                        },
                                                        className: activeWorkspaceId === workspace.id ? "bg-primary/10 text-primary" : "",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "truncate",
                                                            children: workspace.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                            lineNumber: 392,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, workspace.id, false, {
                                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                        lineNumber: 384,
                                                        columnNumber: 25
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 396,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: ()=>{
                                                        setIsCreateWorkspaceOpen(true);
                                                    },
                                                    className: "gap-2 text-primary",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                            className: "size-3.5 shrink-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                            lineNumber: 403,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "建立工作區"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                            lineNumber: 404,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 397,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 367,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.href, true, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 344,
                                    columnNumber: 17
                                }, this);
                            }
                            if (item.href === "/wiki-beta") {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                                    asChild: true,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                        asChild: true,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            "aria-current": active ? "page" : undefined,
                                                            "aria-label": "Account Wiki-Beta: 切換工作區",
                                                            className: `flex h-9 w-9 items-center justify-center rounded-lg transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                            children: item.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                            lineNumber: 417,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                        lineNumber: 416,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 415,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                                    side: "right",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs",
                                                        children: "Account Wiki-Beta: 切換工作區"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                        lineNumber: 432,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 431,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 414,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                            side: "right",
                                            align: "start",
                                            className: "w-56",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                                    className: "text-xs text-muted-foreground",
                                                    children: "選擇工作區"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 437,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: ()=>{
                                                        onSelectWorkspace(null);
                                                        router.push("/wiki-beta");
                                                    },
                                                    className: !activeWorkspaceId ? "bg-primary/10 text-primary" : "",
                                                    children: "Account Wiki-Beta 首頁"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 438,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 447,
                                                    columnNumber: 21
                                                }, this),
                                                !workspacesHydrated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    disabled: true,
                                                    children: "工作區載入中..."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 449,
                                                    columnNumber: 23
                                                }, this) : sortedWorkspaces.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    disabled: true,
                                                    children: "目前帳號沒有工作區"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 23
                                                }, this) : sortedWorkspaces.map((workspace)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>{
                                                            onSelectWorkspace(workspace.id);
                                                            router.push(buildWikiBetaWorkspaceHref(workspace.id));
                                                        },
                                                        className: activeWorkspaceId === workspace.id ? "bg-primary/10 text-primary" : "",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "truncate",
                                                            children: workspace.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                            lineNumber: 462,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, workspace.id, false, {
                                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                        lineNumber: 454,
                                                        columnNumber: 25
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 436,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, item.href, true, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 413,
                                    columnNumber: 17
                                }, this);
                            }
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: item.href,
                                            "aria-current": active ? "page" : undefined,
                                            "aria-label": item.label,
                                            className: `flex h-9 w-9 items-center justify-center rounded-lg transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                            children: item.icon
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 474,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 473,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                        side: "right",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs",
                                            children: item.label
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 488,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 487,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, item.href, true, {
                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                lineNumber: 472,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                        lineNumber: 338,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                        lineNumber: 496,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: settingsHref,
                                        "aria-current": isActive(settingsHref) ? "page" : undefined,
                                        "aria-label": "個人設定",
                                        className: `flex h-9 w-9 items-center justify-center rounded-lg transition ${isActive(settingsHref) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                            className: "size-[18px]"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 512,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 502,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 501,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                    side: "right",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs",
                                        children: "個人設定"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 516,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 515,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                            lineNumber: 500,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                        lineNumber: 499,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                            asChild: true,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                "aria-label": "開啟使用者選單",
                                                className: "rounded-full ring-offset-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                                    size: "sm",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                                        className: "bg-primary/10 text-xs font-semibold text-primary",
                                                        children: getInitial(user?.name)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                        lineNumber: 532,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                    lineNumber: 531,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 526,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 525,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 524,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                        side: "right",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-medium",
                                                children: user?.name ?? "—"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 540,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-muted-foreground",
                                                children: user?.email ?? "—"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 541,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 539,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                lineNumber: 523,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                side: "right",
                                align: "end",
                                className: "w-48",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                        className: "space-y-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "truncate text-sm font-medium",
                                                children: user?.name ?? "—"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 547,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "truncate text-xs text-muted-foreground",
                                                children: user?.email ?? "—"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                                lineNumber: 548,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 546,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 550,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        variant: "destructive",
                                        onClick: onSignOut,
                                        children: "登出"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                        lineNumber: 551,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                lineNumber: 545,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                        lineNumber: 522,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                        lineNumber: 557,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 275,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isCreateOrgOpen,
                onOpenChange: (open)=>{
                    setIsCreateOrgOpen(open);
                    if (!open) resetDialog();
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    "aria-describedby": "rail-create-org-description",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: "建立新組織"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 570,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    id: "rail-create-org-description",
                                    children: "輸入名稱後會直接建立組織並切換到新的組織內容。"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 571,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                            lineNumber: 569,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "space-y-4",
                            onSubmit: handleCreateOrg,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-foreground",
                                            htmlFor: "rail-organization-name",
                                            children: "組織名稱"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 577,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "rail-organization-name",
                                            value: orgName,
                                            onChange: (e)=>{
                                                setOrgName(e.target.value);
                                                if (orgError) setOrgError(null);
                                            },
                                            placeholder: "例如：Gig Team",
                                            autoFocus: true,
                                            disabled: isCreating,
                                            maxLength: 80
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 580,
                                            columnNumber: 15
                                        }, this),
                                        orgError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-destructive",
                                            children: orgError
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 592,
                                            columnNumber: 28
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 576,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            variant: "outline",
                                            onClick: ()=>{
                                                resetDialog();
                                                setIsCreateOrgOpen(false);
                                            },
                                            disabled: isCreating,
                                            children: "取消"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 595,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "submit",
                                            disabled: isCreating || !user,
                                            children: isCreating ? "建立中…" : "直接建立"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 606,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 594,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                            lineNumber: 575,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                    lineNumber: 568,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 561,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isCreateWorkspaceOpen,
                onOpenChange: (open)=>{
                    setIsCreateWorkspaceOpen(open);
                    if (!open) resetWorkspaceDialog();
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    "aria-describedby": "rail-create-workspace-description",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: "建立新工作區"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 624,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    id: "rail-create-workspace-description",
                                    children: "輸入名稱後會直接建立工作區並加入目前帳號的工作區清單中。"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 625,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                            lineNumber: 623,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "space-y-4",
                            onSubmit: handleCreateWorkspace,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-medium text-foreground",
                                            htmlFor: "rail-workspace-name",
                                            children: "工作區名稱"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 631,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "rail-workspace-name",
                                            value: workspaceName,
                                            onChange: (e)=>{
                                                setWorkspaceName(e.target.value);
                                                if (workspaceCreateError) setWorkspaceCreateError(null);
                                            },
                                            placeholder: "例如：Project Alpha",
                                            autoFocus: true,
                                            disabled: isCreatingWorkspace,
                                            maxLength: 80
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 634,
                                            columnNumber: 15
                                        }, this),
                                        workspaceCreateError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-destructive",
                                            children: workspaceCreateError
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 646,
                                            columnNumber: 40
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 630,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            variant: "outline",
                                            onClick: ()=>{
                                                resetWorkspaceDialog();
                                                setIsCreateWorkspaceOpen(false);
                                            },
                                            disabled: isCreatingWorkspace,
                                            children: "取消"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 649,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "submit",
                                            disabled: isCreatingWorkspace || !activeAccount,
                                            children: isCreatingWorkspace ? "建立中…" : "直接建立"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                            lineNumber: 660,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                                    lineNumber: 648,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                            lineNumber: 629,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                    lineNumber: 622,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/app-rail.tsx",
                lineNumber: 615,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/_components/app-rail.tsx",
        lineNumber: 274,
        columnNumber: 5
    }, this);
}
_s(AppRail, "RMMNgS/Tuhll6lqbfJ6ElW6QBZU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AppRail;
var _c;
__turbopack_context__.k.register(_c, "AppRail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/customize-navigation-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomizeNavigationDialog",
    ()=>CustomizeNavigationDialog,
    "readNavPreferences",
    ()=>readNavPreferences
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Module: customize-navigation-dialog.tsx
 * Purpose: Let users pick which nav items stay pinned in the secondary sidebar.
 * Responsibilities: checkbox toggles per item, workspace nav-style radio, show-N-workspaces
 *   preference, all persisted to localStorage.
 * Constraints: UI-only; pure preference storage, no backend call.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-client] (ecmascript) <export default as GripVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$dragdrop$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-dragdrop/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2d$hitbox$2f$dist$2f$esm$2f$closest$2d$edge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop-hitbox/dist/esm/closest-edge.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$public$2d$utils$2f$combine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/public-utils/combine.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/adapter/element-adapter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2d$react$2d$drop$2d$indicator$2f$dist$2f$esm$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/dist/esm/box.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$public$2d$utils$2f$reorder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/public-utils/reorder.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/separator.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
const STORAGE_KEY = "xuanwu:nav-preferences";
// ── Personal nav items ─────────────────────────────────────────────────────
const PERSONAL_ITEMS = [
    {
        id: "recent-workspaces",
        labelKey: "recentWorkspaces"
    }
];
// ── Workspace / org-management items ──────────────────────────────────────
const WORKSPACE_NAV_ITEMS = [
    {
        id: "home",
        tabKey: "Overview",
        fallbackLabel: "Home"
    },
    {
        id: "recent",
        tabKey: "Recent",
        fallbackLabel: "Recent"
    },
    {
        id: "favorites",
        tabKey: "Favorites",
        fallbackLabel: "Favorites"
    },
    {
        id: "workspace-modules",
        tabKey: "workspaceModules",
        fallbackLabel: "Workspace Modules"
    },
    {
        id: "spaces",
        tabKey: "Spaces",
        fallbackLabel: "Spaces"
    },
    {
        id: "docs",
        tabKey: "Docs",
        fallbackLabel: "Docs"
    },
    {
        id: "wiki",
        tabKey: "Wiki",
        fallbackLabel: "WorkSpace Wiki-Beta"
    },
    {
        id: "meeting-notes",
        tabKey: "Meeting Notes",
        fallbackLabel: "Meeting Notes"
    },
    {
        id: "sop",
        tabKey: "SOP",
        fallbackLabel: "SOP"
    },
    {
        id: "engineering",
        tabKey: "Engineering",
        fallbackLabel: "Engineering"
    },
    {
        id: "product",
        tabKey: "Product",
        fallbackLabel: "Product"
    },
    {
        id: "design",
        tabKey: "Design",
        fallbackLabel: "Design"
    },
    {
        id: "databases",
        tabKey: "Databases",
        fallbackLabel: "Databases"
    },
    {
        id: "projects",
        tabKey: "Projects",
        fallbackLabel: "Projects"
    },
    {
        id: "roadmap",
        tabKey: "Roadmap",
        fallbackLabel: "Roadmap"
    },
    {
        id: "notes",
        tabKey: "Notes",
        fallbackLabel: "Notes"
    },
    {
        id: "documents",
        tabKey: "Documents",
        fallbackLabel: "Documents"
    },
    {
        id: "assets",
        tabKey: "Assets",
        fallbackLabel: "Assets"
    },
    {
        id: "crm",
        tabKey: "CRM",
        fallbackLabel: "CRM"
    },
    {
        id: "files",
        tabKey: "Files",
        fallbackLabel: "Files"
    },
    {
        id: "tags",
        tabKey: "Tags",
        fallbackLabel: "Tags"
    },
    {
        id: "templates",
        tabKey: "Templates",
        fallbackLabel: "Templates"
    },
    {
        id: "members",
        tabKey: "Members",
        fallbackLabel: "Members"
    },
    {
        id: "trash",
        tabKey: "Trash",
        fallbackLabel: "Trash"
    },
    {
        id: "daily",
        tabKey: "Daily",
        fallbackLabel: "Daily"
    },
    {
        id: "schedule",
        tabKey: "Schedule",
        fallbackLabel: "Schedule"
    },
    {
        id: "audit",
        tabKey: "Audit",
        fallbackLabel: "Audit"
    }
];
const ORGANIZATION_NAV_ITEMS = [
    {
        id: "teams",
        zhLabel: "團隊",
        enLabel: "Teams"
    },
    {
        id: "permissions",
        zhLabel: "權限",
        enLabel: "Permissions"
    },
    {
        id: "workspaces",
        zhLabel: "工作區",
        enLabel: "Workspaces"
    }
];
const DIALOG_TEXT = {
    zh: {
        title: "Customize navigation",
        description: "已勾選項目會固定顯示於側欄。此設定僅影響你自己的介面，不會影響其他成員。",
        sectionPersonal: "個人",
        sectionWorkspace: "工作區",
        sectionOrganization: "組織管理",
        sectionDisplay: "顯示設定",
        limitedLabel: "側欄僅顯示固定數量的最近工作區",
        limitedInputLabel: "工作區數量",
        done: "完成",
        recentWorkspaces: "最近工作區"
    },
    en: {
        title: "Customize navigation",
        description: "Checked items stay visible in your sidebar. This setting is personal and does not affect other members.",
        sectionPersonal: "Personal",
        sectionWorkspace: "Workspace",
        sectionOrganization: "Organization",
        sectionDisplay: "Display",
        limitedLabel: "Show a limited number of recent workspaces in sidebar",
        limitedInputLabel: "Number of workspaces",
        done: "Done",
        recentWorkspaces: "Recent workspaces"
    }
};
const DEFAULT_PREFS = {
    pinnedPersonal: [
        "recent-workspaces"
    ],
    pinnedWorkspace: [
        ...WORKSPACE_NAV_ITEMS.map((item)=>item.id),
        ...ORGANIZATION_NAV_ITEMS.map((item)=>item.id)
    ],
    showLimitedWorkspaces: true,
    maxWorkspaces: 10,
    workspaceOrder: WORKSPACE_NAV_ITEMS.map((item)=>item.id)
};
const VALID_PERSONAL_ITEM_IDS = new Set(PERSONAL_ITEMS.map((item)=>item.id));
const VALID_WORKSPACE_ITEM_IDS = new Set([
    ...WORKSPACE_NAV_ITEMS.map((item)=>item.id),
    ...ORGANIZATION_NAV_ITEMS.map((item)=>item.id)
]);
const VALID_WORKSPACE_ORDER_IDS = new Set(WORKSPACE_NAV_ITEMS.map((item)=>item.id));
function normalizePinnedIds(ids, validSet, fallback) {
    if (!Array.isArray(ids)) {
        return fallback;
    }
    const normalized = ids.filter((id)=>typeof id === "string").filter((id)=>validSet.has(id));
    return normalized.length > 0 ? Array.from(new Set(normalized)) : fallback;
}
function normalizeWorkspaceOrder(order) {
    const fallback = DEFAULT_PREFS.workspaceOrder;
    if (!Array.isArray(order)) {
        return fallback;
    }
    const validOrder = order.filter((id)=>typeof id === "string").filter((id)=>VALID_WORKSPACE_ORDER_IDS.has(id));
    const deduped = Array.from(new Set(validOrder));
    for (const id of fallback){
        if (!deduped.includes(id)) {
            deduped.push(id);
        }
    }
    return deduped;
}
function readNavPreferences() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_PREFS;
        const parsed = JSON.parse(raw);
        return {
            pinnedPersonal: normalizePinnedIds(parsed.pinnedPersonal, VALID_PERSONAL_ITEM_IDS, DEFAULT_PREFS.pinnedPersonal),
            pinnedWorkspace: normalizePinnedIds(parsed.pinnedWorkspace, VALID_WORKSPACE_ITEM_IDS, DEFAULT_PREFS.pinnedWorkspace),
            showLimitedWorkspaces: parsed.showLimitedWorkspaces ?? DEFAULT_PREFS.showLimitedWorkspaces,
            maxWorkspaces: typeof parsed.maxWorkspaces === "number" ? parsed.maxWorkspaces : DEFAULT_PREFS.maxWorkspaces,
            workspaceOrder: normalizeWorkspaceOrder(parsed.workspaceOrder)
        };
    } catch  {
        return DEFAULT_PREFS;
    }
}
function writeNavPreferences(prefs) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}
function CheckRow({ id, label, checked, onToggle }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-muted/50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__["GripVertical"], {
                className: "size-4 shrink-0 cursor-grab text-muted-foreground/40 active:cursor-grabbing"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                lineNumber: 231,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                id: `nav-check-${id}`,
                checked: checked,
                onCheckedChange: onToggle,
                className: "shrink-0"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                htmlFor: `nav-check-${id}`,
                className: "cursor-pointer select-none text-sm font-normal",
                children: label
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                lineNumber: 238,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
        lineNumber: 230,
        columnNumber: 5
    }, this);
}
_c = CheckRow;
function WorkspaceCheckRow({ id, label, checked, activeDropEdge, isDropTarget, onToggle, onDragOverItem, onDragLeaveItem, onReorder }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkspaceCheckRow.useEffect": ()=>{
            const element = ref.current;
            if (!element) {
                return;
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$public$2d$utils$2f$combine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["combine"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["draggable"])({
                element,
                getInitialData: {
                    "WorkspaceCheckRow.useEffect": ()=>({
                            type: "workspace-nav-item",
                            itemId: id
                        })
                }["WorkspaceCheckRow.useEffect"]
            }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dropTargetForElements"])({
                element,
                canDrop: {
                    "WorkspaceCheckRow.useEffect": ({ source })=>{
                        return source.data.type === "workspace-nav-item" && source.data.itemId !== id;
                    }
                }["WorkspaceCheckRow.useEffect"],
                getData: {
                    "WorkspaceCheckRow.useEffect": ({ input, element: dropElement })=>{
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2d$hitbox$2f$dist$2f$esm$2f$closest$2d$edge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["attachClosestEdge"])({
                            type: "workspace-nav-item",
                            itemId: id
                        }, {
                            input,
                            element: dropElement,
                            allowedEdges: [
                                "top",
                                "bottom"
                            ]
                        });
                    }
                }["WorkspaceCheckRow.useEffect"],
                onDragEnter: {
                    "WorkspaceCheckRow.useEffect": ({ self })=>{
                        onDragOverItem(id, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2d$hitbox$2f$dist$2f$esm$2f$closest$2d$edge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractClosestEdge"])(self.data));
                    }
                }["WorkspaceCheckRow.useEffect"],
                onDrag: {
                    "WorkspaceCheckRow.useEffect": ({ self })=>{
                        onDragOverItem(id, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2d$hitbox$2f$dist$2f$esm$2f$closest$2d$edge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractClosestEdge"])(self.data));
                    }
                }["WorkspaceCheckRow.useEffect"],
                onDragLeave: {
                    "WorkspaceCheckRow.useEffect": ()=>{
                        onDragLeaveItem(id);
                    }
                }["WorkspaceCheckRow.useEffect"],
                onDrop: {
                    "WorkspaceCheckRow.useEffect": ({ source, self })=>{
                        const sourceId = typeof source.data.itemId === "string" ? source.data.itemId : null;
                        if (!sourceId || sourceId === id) {
                            onDragLeaveItem(id);
                            return;
                        }
                        onReorder(sourceId, id, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2d$hitbox$2f$dist$2f$esm$2f$closest$2d$edge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["extractClosestEdge"])(self.data));
                        onDragLeaveItem(id);
                    }
                }["WorkspaceCheckRow.useEffect"]
            }));
        }
    }["WorkspaceCheckRow.useEffect"], [
        id,
        onDragLeaveItem,
        onDragOverItem,
        onReorder
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-muted/50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__["GripVertical"], {
                        className: "size-4 shrink-0 cursor-grab text-muted-foreground/40 active:cursor-grabbing"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                        lineNumber: 330,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                        id: `nav-check-${id}`,
                        checked: checked,
                        onCheckedChange: onToggle,
                        className: "shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                        lineNumber: 331,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                        htmlFor: `nav-check-${id}`,
                        className: "cursor-pointer select-none text-sm font-normal",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                        lineNumber: 337,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                lineNumber: 329,
                columnNumber: 7
            }, this),
            isDropTarget && activeDropEdge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-x-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2d$react$2d$drop$2d$indicator$2f$dist$2f$esm$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropIndicator"], {
                    edge: activeDropEdge
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 347,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                lineNumber: 346,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
        lineNumber: 328,
        columnNumber: 5
    }, this);
}
_s(WorkspaceCheckRow, "8uVE59eA/r6b92xF80p7sH8rXLk=");
_c1 = WorkspaceCheckRow;
function CustomizeNavigationDialog({ open, onOpenChange, onPreferencesChange }) {
    _s1();
    const [prefs, setPrefs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "CustomizeNavigationDialog.useState": ()=>readNavPreferences()
    }["CustomizeNavigationDialog.useState"]);
    const [dragTarget, setDragTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const uiLocale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CustomizeNavigationDialog.useMemo[uiLocale]": ()=>{
            if (typeof navigator === "undefined") {
                return "zh";
            }
            const language = navigator.language?.toLowerCase() ?? "";
            return language.startsWith("zh") ? "zh" : "en";
        }
    }["CustomizeNavigationDialog.useMemo[uiLocale]"], []);
    const [localeBundle, setLocaleBundle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomizeNavigationDialog.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const localeFile = uiLocale === "zh" ? "/localized-files/zh-TW.json" : "/localized-files/en.json";
            let canceled = false;
            fetch(localeFile).then({
                "CustomizeNavigationDialog.useEffect": (res)=>{
                    if (!res.ok) {
                        throw new Error(`Failed to load locale file: ${res.status}`);
                    }
                    return res.json();
                }
            }["CustomizeNavigationDialog.useEffect"]).then({
                "CustomizeNavigationDialog.useEffect": (json)=>{
                    if (!canceled) {
                        setLocaleBundle(json);
                    }
                }
            }["CustomizeNavigationDialog.useEffect"]).catch({
                "CustomizeNavigationDialog.useEffect": ()=>{
                    if (!canceled) {
                        setLocaleBundle(null);
                    }
                }
            }["CustomizeNavigationDialog.useEffect"]);
            return ({
                "CustomizeNavigationDialog.useEffect": ()=>{
                    canceled = true;
                }
            })["CustomizeNavigationDialog.useEffect"];
        }
    }["CustomizeNavigationDialog.useEffect"], [
        uiLocale
    ]);
    const text = DIALOG_TEXT[uiLocale];
    const workspaceItemsById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CustomizeNavigationDialog.useMemo[workspaceItemsById]": ()=>Object.fromEntries(WORKSPACE_NAV_ITEMS.map({
                "CustomizeNavigationDialog.useMemo[workspaceItemsById]": (item)=>[
                        item.id,
                        item
                    ]
            }["CustomizeNavigationDialog.useMemo[workspaceItemsById]"]))
    }["CustomizeNavigationDialog.useMemo[workspaceItemsById]"], []);
    const orderedWorkspaceItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CustomizeNavigationDialog.useMemo[orderedWorkspaceItems]": ()=>{
            return prefs.workspaceOrder.map({
                "CustomizeNavigationDialog.useMemo[orderedWorkspaceItems]": (id)=>workspaceItemsById[id]
            }["CustomizeNavigationDialog.useMemo[orderedWorkspaceItems]"]).filter({
                "CustomizeNavigationDialog.useMemo[orderedWorkspaceItems]": (item)=>item != null
            }["CustomizeNavigationDialog.useMemo[orderedWorkspaceItems]"]);
        }
    }["CustomizeNavigationDialog.useMemo[orderedWorkspaceItems]"], [
        prefs.workspaceOrder,
        workspaceItemsById
    ]);
    const getWorkspaceLabel = (item)=>{
        return localeBundle?.workspace?.tabLabels?.[item.tabKey] ?? item.fallbackLabel;
    };
    const getOrganizationLabel = (item)=>{
        return uiLocale === "zh" ? item.zhLabel : item.enLabel;
    };
    function updatePrefs(update) {
        const next = {
            ...prefs,
            ...update
        };
        writeNavPreferences(next);
        setPrefs(next);
        onPreferencesChange?.(next);
    }
    function togglePersonal(id) {
        const next = prefs.pinnedPersonal.includes(id) ? prefs.pinnedPersonal.filter((x)=>x !== id) : [
            ...prefs.pinnedPersonal,
            id
        ];
        updatePrefs({
            pinnedPersonal: next
        });
    }
    function toggleWorkspace(id) {
        const next = prefs.pinnedWorkspace.includes(id) ? prefs.pinnedWorkspace.filter((x)=>x !== id) : [
            ...prefs.pinnedWorkspace,
            id
        ];
        updatePrefs({
            pinnedWorkspace: next
        });
    }
    function reorderWorkspaceItems(sourceId, targetId, edge) {
        const startIndex = prefs.workspaceOrder.indexOf(sourceId);
        const targetIndex = prefs.workspaceOrder.indexOf(targetId);
        if (startIndex === -1 || targetIndex === -1) {
            return;
        }
        const destinationIndex = edge === "bottom" ? targetIndex + 1 : targetIndex;
        const nextOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$public$2d$utils$2f$reorder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reorder"])({
            list: prefs.workspaceOrder,
            startIndex,
            finishIndex: destinationIndex
        });
        updatePrefs({
            workspaceOrder: nextOrder
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "max-h-[85vh] overflow-y-auto sm:max-w-lg",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: text.title
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 473,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: text.description
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 474,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 472,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-2 space-y-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                            children: text.sectionPersonal
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 479,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border/60 bg-background/50",
                            children: PERSONAL_ITEMS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckRow, {
                                    id: item.id,
                                    label: text[item.labelKey],
                                    checked: prefs.pinnedPersonal.includes(item.id),
                                    onToggle: ()=>{
                                        togglePersonal(item.id);
                                    }
                                }, item.id, false, {
                                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                    lineNumber: 484,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 482,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 478,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                    className: "my-2"
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 497,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                            children: text.sectionWorkspace
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 501,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border/60 bg-background/50",
                            children: orderedWorkspaceItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WorkspaceCheckRow, {
                                    id: item.id,
                                    label: getWorkspaceLabel(item),
                                    checked: prefs.pinnedWorkspace.includes(item.id),
                                    isDropTarget: dragTarget?.id === item.id,
                                    activeDropEdge: dragTarget?.id === item.id ? dragTarget.edge : null,
                                    onToggle: ()=>{
                                        toggleWorkspace(item.id);
                                    },
                                    onDragOverItem: (targetId, edge)=>{
                                        setDragTarget({
                                            id: targetId,
                                            edge
                                        });
                                    },
                                    onDragLeaveItem: (targetId)=>{
                                        setDragTarget((current)=>current?.id === targetId ? null : current);
                                    },
                                    onReorder: reorderWorkspaceItems
                                }, item.id, false, {
                                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                    lineNumber: 506,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 504,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 500,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                    className: "my-2"
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 528,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-1 px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                            children: text.sectionOrganization
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 532,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border/60 bg-background/50",
                            children: ORGANIZATION_NAV_ITEMS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckRow, {
                                    id: item.id,
                                    label: getOrganizationLabel(item),
                                    checked: prefs.pinnedWorkspace.includes(item.id),
                                    onToggle: ()=>{
                                        toggleWorkspace(item.id);
                                    }
                                }, item.id, false, {
                                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                    lineNumber: 537,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 535,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 531,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                    className: "my-2"
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 550,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                            children: text.sectionDisplay
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 554,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border/60 bg-background/50 px-4 py-3 space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                            id: "nav-limit-workspaces",
                                            checked: prefs.showLimitedWorkspaces,
                                            onCheckedChange: (checked)=>{
                                                updatePrefs({
                                                    showLimitedWorkspaces: Boolean(checked)
                                                });
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                            lineNumber: 561,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "nav-limit-workspaces",
                                            className: "cursor-pointer text-sm font-medium",
                                            children: text.limitedLabel
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                            lineNumber: 568,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                    lineNumber: 560,
                                    columnNumber: 13
                                }, this),
                                prefs.showLimitedWorkspaces && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5 pl-7",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "nav-max-workspaces",
                                            className: "text-xs text-muted-foreground",
                                            children: text.limitedInputLabel
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                            lineNumber: 574,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            id: "nav-max-workspaces",
                                            type: "number",
                                            min: 1,
                                            max: 50,
                                            value: prefs.maxWorkspaces,
                                            onChange: (e)=>{
                                                const val = parseInt(e.target.value, 10);
                                                if (!isNaN(val) && val >= 1) {
                                                    updatePrefs({
                                                        maxWorkspaces: Math.min(val, 50)
                                                    });
                                                }
                                            },
                                            className: "w-full"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                            lineNumber: 577,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                                    lineNumber: 573,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                            lineNumber: 559,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 553,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end pt-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        type: "button",
                        onClick: ()=>{
                            onOpenChange(false);
                        },
                        children: text.done
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                        lineNumber: 598,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
                    lineNumber: 597,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
            lineNumber: 471,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(shell)/_components/customize-navigation-dialog.tsx",
        lineNumber: 470,
        columnNumber: 5
    }, this);
}
_s1(CustomizeNavigationDialog, "ricU83cylus+Fiy8S+xyzSmiDE0=");
_c2 = CustomizeNavigationDialog;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "CheckRow");
__turbopack_context__.k.register(_c1, "WorkspaceCheckRow");
__turbopack_context__.k.register(_c2, "CustomizeNavigationDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/dashboard-sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardSidebar",
    ()=>DashboardSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Module: dashboard-sidebar.tsx
 * Purpose: render the secondary navigation panel of the authenticated shell.
 * Responsibilities: account switcher, search hint, org management sub-nav, and
 *   recent workspace quick-access list.  Top-level section navigation is in AppRail.
 * Constraints: UI-only; workspace data sourced from module interfaces.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftClose$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panel-left-close.js [app-client] (ecmascript) <export default as PanelLeftClose>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-round.js [app-client] (ecmascript) <export default as UserRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/workspace/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/workspace-tabs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/firestore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$customize$2d$navigation$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/customize-navigation-dialog.tsx [app-client] (ecmascript)");
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
;
const ORGANIZATION_MANAGEMENT_ITEMS = [];
const ACCOUNT_NAV_ITEMS = [
    {
        id: "schedule",
        label: "排程",
        href: "/organization/schedule"
    },
    {
        id: "dispatcher",
        label: "調度台",
        href: "/organization/schedule/dispatcher"
    },
    {
        id: "daily",
        label: "每日",
        href: "/organization/daily"
    },
    {
        id: "audit",
        label: "稽核",
        href: "/organization/audit"
    }
];
const ACCOUNT_SECTION_MATCHERS = [
    "/organization/daily",
    "/organization/schedule",
    "/organization/audit"
];
const MAX_VISIBLE_RECENT_WORKSPACES = 10;
const RECENT_WORKSPACES_STORAGE_PREFIX = "xuanwu:recent-workspaces:";
function createWorkspaceLinkItems(group) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceTabsByGroup"])(group).map((value)=>({
            value,
            label: (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceTabLabel"])(value)
        }));
}
const WORKSPACE_PRIMARY_LINK_ITEMS = createWorkspaceLinkItems("primary");
const WORKSPACE_SPACE_ITEMS = createWorkspaceLinkItems("spaces");
const WORKSPACE_DATABASE_ITEMS = createWorkspaceLinkItems("databases");
const WORKSPACE_LIBRARY_LINK_ITEMS = createWorkspaceLinkItems("library");
const WORKSPACE_MODULE_LINK_ITEMS = createWorkspaceLinkItems("modules");
function getStorageKey(accountId) {
    return `${RECENT_WORKSPACES_STORAGE_PREFIX}${accountId}`;
}
function readRecentWorkspaceIds(accountId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = window.localStorage.getItem(getStorageKey(accountId));
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((item)=>typeof item === "string" && item.length > 0);
    } catch  {
        return [];
    }
}
function persistRecentWorkspaceIds(accountId, workspaceIds) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.setItem(getStorageKey(accountId), JSON.stringify(workspaceIds));
}
function trackWorkspaceFromPath(pathname, accountId) {
    const match = pathname.match(/^\/workspace\/([^/]+)/);
    if (!match) return;
    const workspaceId = decodeURIComponent(match[1]);
    const recentIds = readRecentWorkspaceIds(accountId);
    const deduped = [
        workspaceId,
        ...recentIds.filter((id)=>id !== workspaceId)
    ].slice(0, 50);
    persistRecentWorkspaceIds(accountId, deduped);
}
function getWorkspaceIdFromPath(pathname) {
    const match = pathname.match(/^\/workspace\/([^/]+)/);
    if (!match) return null;
    return decodeURIComponent(match[1]);
}
function resolveNavSection(pathname) {
    if (pathname.startsWith("/workspace") || pathname.startsWith("/dashboard")) return "workspace";
    if (pathname.startsWith("/wiki-beta")) return "wiki-beta";
    if (pathname.startsWith("/ai-chat")) return "ai-chat";
    if (ACCOUNT_SECTION_MATCHERS.some((prefix)=>pathname === prefix || pathname.startsWith(`${prefix}/`))) return "account";
    if (pathname.startsWith("/organization")) return "organization";
    if (pathname.startsWith("/settings")) return "settings";
    return "other";
}
// ── Section icon labels for the title bar ────────────────────────────────────
const SECTION_TITLES = {
    workspace: {
        label: "工作區",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
            className: "size-3"
        }, void 0, false, {
            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
            lineNumber: 139,
            columnNumber: 36
        }, ("TURBOPACK compile-time value", void 0))
    },
    "wiki-beta": {
        label: "Account Wiki-Beta",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
            className: "size-3"
        }, void 0, false, {
            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
            lineNumber: 140,
            columnNumber: 52
        }, ("TURBOPACK compile-time value", void 0))
    },
    "ai-chat": {
        label: "AI Chat",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
            className: "size-3"
        }, void 0, false, {
            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
            lineNumber: 141,
            columnNumber: 40
        }, ("TURBOPACK compile-time value", void 0))
    },
    account: {
        label: "Account",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserRound$3e$__["UserRound"], {
            className: "size-3"
        }, void 0, false, {
            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
            lineNumber: 142,
            columnNumber: 38
        }, ("TURBOPACK compile-time value", void 0))
    },
    organization: {
        label: "組織",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
            className: "size-3"
        }, void 0, false, {
            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
            lineNumber: 143,
            columnNumber: 38
        }, ("TURBOPACK compile-time value", void 0))
    },
    settings: {
        label: "設定",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
            className: "size-3"
        }, void 0, false, {
            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
            lineNumber: 144,
            columnNumber: 34
        }, ("TURBOPACK compile-time value", void 0))
    },
    other: {
        label: "導覽",
        icon: null
    }
};
function isActiveOrganizationAccount(activeAccount) {
    return activeAccount != null && "accountType" in activeAccount && activeAccount.accountType === "organization";
}
function DashboardSidebar({ pathname, activeAccount, workspaces, workspacesHydrated, activeWorkspaceId, collapsed, onToggleCollapsed, onSelectWorkspace }) {
    _s();
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isWikiBetaWorkspacesExpanded, setIsWikiBetaWorkspacesExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [wikiBetaQuickCreateOpen, setWikiBetaQuickCreateOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [creatingKind, setCreatingKind] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isWorkspaceSpacesExpanded, setIsWorkspaceSpacesExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isWorkspaceDatabasesExpanded, setIsWorkspaceDatabasesExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isWorkspaceModulesExpanded, setIsWorkspaceModulesExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [navPrefs, setNavPrefs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "DashboardSidebar.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$customize$2d$navigation$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readNavPreferences"])()
    }["DashboardSidebar.useState"]);
    const [customizeOpen, setCustomizeOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [localeBundle, setLocaleBundle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    function toggleCollapsed() {
        onToggleCollapsed();
    }
    const showAccountManagement = isActiveOrganizationAccount(activeAccount);
    const visibleOrganizationManagementItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardSidebar.useMemo[visibleOrganizationManagementItems]": ()=>{
            return ORGANIZATION_MANAGEMENT_ITEMS.filter({
                "DashboardSidebar.useMemo[visibleOrganizationManagementItems]": (item)=>navPrefs.pinnedWorkspace.includes(item.id)
            }["DashboardSidebar.useMemo[visibleOrganizationManagementItems]"]);
        }
    }["DashboardSidebar.useMemo[visibleOrganizationManagementItems]"], [
        navPrefs.pinnedWorkspace
    ]);
    const visibleAccountItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardSidebar.useMemo[visibleAccountItems]": ()=>{
            return ACCOUNT_NAV_ITEMS.filter({
                "DashboardSidebar.useMemo[visibleAccountItems]": (item)=>navPrefs.pinnedWorkspace.includes(item.id)
            }["DashboardSidebar.useMemo[visibleAccountItems]"]);
        }
    }["DashboardSidebar.useMemo[visibleAccountItems]"], [
        navPrefs.pinnedWorkspace
    ]);
    // Whether to show recent workspaces section (controlled by personal prefs)
    const showRecentWorkspaces = navPrefs.pinnedPersonal.includes("recent-workspaces");
    // Max workspaces to show (apply user preference)
    const effectiveMaxWorkspaces = navPrefs.showLimitedWorkspaces ? navPrefs.maxWorkspaces : MAX_VISIBLE_RECENT_WORKSPACES;
    function isActiveRoute(href) {
        return pathname === href || pathname.startsWith(`${href}/`);
    }
    // Track recently visited workspaces in localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardSidebar.useEffect": ()=>{
            const accountId = activeAccount?.id;
            if (!accountId) return;
            trackWorkspaceFromPath(pathname, accountId);
        }
    }["DashboardSidebar.useEffect"], [
        activeAccount?.id,
        pathname
    ]);
    const workspacesById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardSidebar.useMemo[workspacesById]": ()=>Object.fromEntries(workspaces.map({
                "DashboardSidebar.useMemo[workspacesById]": (workspace)=>[
                        workspace.id,
                        workspace
                    ]
            }["DashboardSidebar.useMemo[workspacesById]"]))
    }["DashboardSidebar.useMemo[workspacesById]"], [
        workspaces
    ]);
    const recentWorkspaceIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardSidebar.useMemo[recentWorkspaceIds]": ()=>{
            const accountId = activeAccount?.id;
            if (!accountId) return [];
            const stored = readRecentWorkspaceIds(accountId);
            const currentId = getWorkspaceIdFromPath(pathname);
            if (!currentId) return stored;
            return [
                currentId,
                ...stored.filter({
                    "DashboardSidebar.useMemo[recentWorkspaceIds]": (id)=>id !== currentId
                }["DashboardSidebar.useMemo[recentWorkspaceIds]"])
            ];
        }
    }["DashboardSidebar.useMemo[recentWorkspaceIds]"], [
        activeAccount?.id,
        pathname
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardSidebar.useEffect": ()=>{
            const pathWorkspaceId = getWorkspaceIdFromPath(pathname);
            if (pathWorkspaceId && pathWorkspaceId !== activeWorkspaceId) {
                onSelectWorkspace(pathWorkspaceId);
                return;
            }
            if (("TURBOPACK compile-time value", "object") === "undefined" || !pathname.startsWith("/wiki-beta")) {
                return;
            }
            const searchWorkspaceId = new URLSearchParams(window.location.search).get("workspaceId")?.trim() || "";
            if (searchWorkspaceId && searchWorkspaceId !== activeWorkspaceId) {
                onSelectWorkspace(searchWorkspaceId);
            }
        }
    }["DashboardSidebar.useEffect"], [
        pathname,
        activeWorkspaceId,
        onSelectWorkspace
    ]);
    const recentWorkspaceLinks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardSidebar.useMemo[recentWorkspaceLinks]": ()=>{
            return recentWorkspaceIds.map({
                "DashboardSidebar.useMemo[recentWorkspaceLinks]": (workspaceId)=>{
                    const ws = workspacesById[workspaceId];
                    if (!ws) return null;
                    return {
                        id: ws.id,
                        name: ws.name,
                        href: `/workspace/${ws.id}`
                    };
                }
            }["DashboardSidebar.useMemo[recentWorkspaceLinks]"]).filter({
                "DashboardSidebar.useMemo[recentWorkspaceLinks]": (item)=>item !== null
            }["DashboardSidebar.useMemo[recentWorkspaceLinks]"]);
        }
    }["DashboardSidebar.useMemo[recentWorkspaceLinks]"], [
        recentWorkspaceIds,
        workspacesById
    ]);
    const hasOverflow = recentWorkspaceLinks.length > effectiveMaxWorkspaces;
    const visibleRecentWorkspaceLinks = isExpanded ? recentWorkspaceLinks : recentWorkspaceLinks.slice(0, effectiveMaxWorkspaces);
    const buildWorkspaceContextHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DashboardSidebar.useCallback[buildWorkspaceContextHref]": (workspaceId)=>{
            if (pathname.startsWith("/wiki-beta")) {
                const targetPath = pathname === "/wiki-beta" ? "/wiki-beta/documents" : pathname;
                return `${targetPath}?workspaceId=${encodeURIComponent(workspaceId)}`;
            }
            return `/workspace/${workspaceId}`;
        }
    }["DashboardSidebar.useCallback[buildWorkspaceContextHref]"], [
        pathname
    ]);
    const allWorkspaceLinks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardSidebar.useMemo[allWorkspaceLinks]": ()=>{
            return Object.values(workspacesById).map({
                "DashboardSidebar.useMemo[allWorkspaceLinks]": (workspace)=>({
                        id: workspace.id,
                        name: workspace.name,
                        href: buildWorkspaceContextHref(workspace.id)
                    })
            }["DashboardSidebar.useMemo[allWorkspaceLinks]"]).sort({
                "DashboardSidebar.useMemo[allWorkspaceLinks]": (a, b)=>a.name.localeCompare(b.name, "zh-Hant")
            }["DashboardSidebar.useMemo[allWorkspaceLinks]"]);
        }
    }["DashboardSidebar.useMemo[allWorkspaceLinks]"], [
        workspacesById,
        buildWorkspaceContextHref
    ]);
    const section = resolveNavSection(pathname);
    const sectionMeta = SECTION_TITLES[section];
    const workspacePathId = getWorkspaceIdFromPath(pathname);
    const rawWorkspaceTab = searchParams.get("tab") ?? "Overview";
    const activeWorkspaceTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWorkspaceTabValue"])(rawWorkspaceTab) ? rawWorkspaceTab : "Overview";
    function buildWorkspaceTabHref(workspaceId, tab) {
        return `/workspace/${workspaceId}?tab=${encodeURIComponent(tab)}`;
    }
    function tWorkspaceTab(tab, fallback) {
        return localeBundle?.workspace?.tabLabels?.[tab] ?? fallback;
    }
    function tWorkspaceTabWithDevStatus(tab, fallback) {
        if (tab === "Wiki") {
            const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceTabStatus"])(tab);
            return `${status} WorkSpace Wiki-Beta`;
        }
        const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceTabStatus"])(tab);
        return `${status} ${tWorkspaceTab(tab, fallback)}`;
    }
    function tWorkspaceGroup(groupKey, fallback) {
        return localeBundle?.workspace?.groups?.[groupKey] ?? fallback;
    }
    function getWorkspacePrefId(tabValue) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWorkspaceTabValue"])(tabValue)) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$workspace$2d$tabs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceTabPrefId"])(tabValue);
        }
        return tabValue.toLowerCase().replace(/\s+/g, "-");
    }
    function isWorkspaceItemEnabled(prefId) {
        return navPrefs.pinnedWorkspace.includes(prefId);
    }
    function getWorkspaceItemOrder(prefId) {
        const index = navPrefs.workspaceOrder.indexOf(prefId);
        return index === -1 ? Number.MAX_SAFE_INTEGER : index;
    }
    function sortWorkspaceItemsByPreferenceOrder(items) {
        return [
            ...items
        ].sort((left, right)=>getWorkspaceItemOrder(getWorkspacePrefId(left.value)) - getWorkspaceItemOrder(getWorkspacePrefId(right.value)));
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardSidebar.useEffect": ()=>{
            let cancelled = false;
            async function loadSidebarLocale() {
                const isZhHant = typeof navigator !== "undefined" && /^(zh-TW|zh-HK|zh-MO|zh-Hant)/i.test(navigator.language);
                const localeFile = isZhHant ? "zh-TW.json" : "en.json";
                try {
                    const response = await fetch(`/localized-files/${localeFile}`, {
                        cache: "no-store"
                    });
                    if (!response.ok) return;
                    const data = await response.json();
                    if (!cancelled) {
                        setLocaleBundle(data);
                    }
                } catch  {
                // Keep fallback labels when localization files are unavailable.
                }
            }
            void loadSidebarLocale();
            return ({
                "DashboardSidebar.useEffect": ()=>{
                    cancelled = true;
                }
            })["DashboardSidebar.useEffect"];
        }
    }["DashboardSidebar.useEffect"], []);
    async function handleWikiBetaQuickCreate(kind) {
        const accountId = activeAccount?.id ?? "";
        if (!accountId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("目前沒有 active account，無法建立");
            return;
        }
        setCreatingKind(kind);
        try {
            const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseFirestore"])();
            const collectionName = kind === "page" ? "pages" : "databases";
            const baseTitle = kind === "page" ? "未命名頁面" : "未命名資料庫";
            const payload = {
                title: baseTitle,
                kind,
                accountId,
                createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].serverTimestamp(),
                updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].serverTimestamp()
            };
            if (activeWorkspaceId) {
                payload.spaceId = activeWorkspaceId;
            }
            if (kind === "database") {
                payload.template = "task-governance";
                payload.metadata = {
                    model: [
                        "tasks",
                        "task_dependencies",
                        "skills",
                        "task_skill_thresholds"
                    ],
                    description: "任務依賴與技能門檻分類模板"
                };
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].addDoc(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].collection(db, "accounts", accountId, collectionName), payload);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(kind === "page" ? "已建立頁面" : "已建立資料庫");
            setWikiBetaQuickCreateOpen(false);
        } catch (error) {
            console.error(error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(kind === "page" ? "建立頁面失敗" : "建立資料庫失敗");
        } finally{
            setCreatingKind(null);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                "aria-label": "Secondary navigation",
                className: `hidden h-full shrink-0 flex-col overflow-hidden transition-[width] duration-200 md:flex ${collapsed ? "w-0" : "w-52 border-r border-border/50 bg-card/30"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex shrink-0 items-center border-b border-border/40 px-2 py-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex flex-1 items-center gap-1 px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70",
                                    children: [
                                        sectionMeta.icon,
                                        sectionMeta.label
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                    lineNumber: 425,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-0.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            title: "設定",
                                            "aria-label": "設定",
                                            onClick: ()=>{
                                                setCustomizeOpen(true);
                                            },
                                            className: "flex size-5 items-center justify-center rounded text-muted-foreground/70 transition hover:bg-muted hover:text-foreground",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                                className: "size-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 440,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 431,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: toggleCollapsed,
                                            "aria-label": "收起側欄",
                                            title: "收起側欄",
                                            className: "flex size-5 items-center justify-center rounded text-muted-foreground transition hover:bg-muted hover:text-foreground",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftClose$3e$__["PanelLeftClose"], {
                                                className: "size-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 449,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 442,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                    lineNumber: 430,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                            lineNumber: 423,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto px-3 py-3",
                            children: [
                                section === "account" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        showAccountManagement && visibleAccountItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                            className: "space-y-0.5",
                                            "aria-label": "Account navigation",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70",
                                                    children: "Account"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 460,
                                                    columnNumber: 21
                                                }, this),
                                                visibleAccountItems.map((item)=>{
                                                    const active = isActiveRoute(item.href);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: item.href,
                                                        "aria-current": active ? "page" : undefined,
                                                        className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                        children: item.label
                                                    }, item.href, false, {
                                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                        lineNumber: 466,
                                                        columnNumber: 25
                                                    }, this);
                                                })
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 459,
                                            columnNumber: 19
                                        }, this),
                                        !showAccountManagement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "px-2 py-4 text-[11px] text-muted-foreground",
                                            children: "請切換到組織帳號以查看 Account 選項。"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 483,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true),
                                section === "organization" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        showAccountManagement && visibleOrganizationManagementItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                            className: "space-y-0.5",
                                            "aria-label": "Organization management",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70",
                                                    children: "組織管理"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 494,
                                                    columnNumber: 21
                                                }, this),
                                                visibleOrganizationManagementItems.map((item)=>{
                                                    const active = isActiveRoute(item.href);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: item.href,
                                                        "aria-current": active ? "page" : undefined,
                                                        className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                        children: item.label
                                                    }, item.href, false, {
                                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                        lineNumber: 500,
                                                        columnNumber: 25
                                                    }, this);
                                                })
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 493,
                                            columnNumber: 19
                                        }, this),
                                        !showAccountManagement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "px-2 py-4 text-[11px] text-muted-foreground",
                                            children: "請切換到組織帳號以查看管理選項。"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 517,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true),
                                section === "workspace" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: workspacePathId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                        className: "space-y-3",
                                        "aria-label": "Workspace navigation",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-0.5",
                                                children: sortWorkspaceItemsByPreferenceOrder(WORKSPACE_PRIMARY_LINK_ITEMS).filter((item)=>isWorkspaceItemEnabled(getWorkspacePrefId(item.value))).map((item)=>{
                                                    const isActive = activeWorkspaceTab === item.value;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: buildWorkspaceTabHref(workspacePathId, item.value),
                                                        "aria-current": isActive ? "page" : undefined,
                                                        className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                        children: tWorkspaceTabWithDevStatus(item.value, item.label)
                                                    }, item.value, false, {
                                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                        lineNumber: 534,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 528,
                                                columnNumber: 21
                                            }, this),
                                            isWorkspaceItemEnabled("workspace-modules") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "my-1.5 border-t border-border/40"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 551,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-0.5",
                                                children: isWorkspaceItemEnabled("workspace-modules") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                setIsWorkspaceModulesExpanded((prev)=>!prev);
                                                            },
                                                            className: "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                                                            "aria-expanded": isWorkspaceModulesExpanded,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: tWorkspaceGroup("workspaceModules", "Workspace Modules")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 565,
                                                                    columnNumber: 29
                                                                }, this),
                                                                isWorkspaceModulesExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                    className: "size-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 566,
                                                                    columnNumber: 59
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                    className: "size-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 566,
                                                                    columnNumber: 98
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 557,
                                                            columnNumber: 27
                                                        }, this),
                                                        isWorkspaceModulesExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-0.5 pl-2",
                                                            children: sortWorkspaceItemsByPreferenceOrder(WORKSPACE_MODULE_LINK_ITEMS).filter((item)=>isWorkspaceItemEnabled(getWorkspacePrefId(item.value))).map((item)=>{
                                                                const isActive = activeWorkspaceTab === item.value;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: buildWorkspaceTabHref(workspacePathId, item.value),
                                                                    "aria-current": isActive ? "page" : undefined,
                                                                    className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                                    children: tWorkspaceTabWithDevStatus(item.value, item.label)
                                                                }, item.value, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 576,
                                                                    columnNumber: 35
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 570,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 554,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-0.5",
                                                children: isWorkspaceItemEnabled("spaces") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                setIsWorkspaceSpacesExpanded((prev)=>!prev);
                                                            },
                                                            className: "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                                                            "aria-expanded": isWorkspaceSpacesExpanded,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: tWorkspaceGroup("spaces", "Spaces")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 607,
                                                                    columnNumber: 29
                                                                }, this),
                                                                isWorkspaceSpacesExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                    className: "size-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 608,
                                                                    columnNumber: 58
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                    className: "size-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 608,
                                                                    columnNumber: 97
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 599,
                                                            columnNumber: 27
                                                        }, this),
                                                        isWorkspaceSpacesExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-0.5 pl-2",
                                                            children: sortWorkspaceItemsByPreferenceOrder(WORKSPACE_SPACE_ITEMS).filter((item)=>isWorkspaceItemEnabled(getWorkspacePrefId(item.value))).map((item)=>{
                                                                const isActive = activeWorkspaceTab === item.value;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: buildWorkspaceTabHref(workspacePathId, item.value),
                                                                    "aria-current": isActive ? "page" : undefined,
                                                                    className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                                    children: tWorkspaceTabWithDevStatus(item.value, item.label)
                                                                }, item.value, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 618,
                                                                    columnNumber: 35
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 612,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 596,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-0.5",
                                                children: isWorkspaceItemEnabled("databases") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                setIsWorkspaceDatabasesExpanded((prev)=>!prev);
                                                            },
                                                            className: "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                                                            "aria-expanded": isWorkspaceDatabasesExpanded,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: tWorkspaceGroup("databases", "Databases")
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 649,
                                                                    columnNumber: 29
                                                                }, this),
                                                                isWorkspaceDatabasesExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                    className: "size-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 650,
                                                                    columnNumber: 61
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                    className: "size-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 650,
                                                                    columnNumber: 100
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 641,
                                                            columnNumber: 27
                                                        }, this),
                                                        isWorkspaceDatabasesExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-0.5 pl-2",
                                                            children: sortWorkspaceItemsByPreferenceOrder(WORKSPACE_DATABASE_ITEMS).filter((item)=>isWorkspaceItemEnabled(getWorkspacePrefId(item.value))).map((item)=>{
                                                                const isActive = activeWorkspaceTab === item.value;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: buildWorkspaceTabHref(workspacePathId, item.value),
                                                                    "aria-current": isActive ? "page" : undefined,
                                                                    className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                                    children: tWorkspaceTabWithDevStatus(item.value, item.label)
                                                                }, item.value, false, {
                                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                                    lineNumber: 660,
                                                                    columnNumber: 35
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 654,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 638,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-0.5",
                                                children: sortWorkspaceItemsByPreferenceOrder(WORKSPACE_LIBRARY_LINK_ITEMS).filter((item)=>isWorkspaceItemEnabled(getWorkspacePrefId(item.value))).map((item)=>{
                                                    const isActive = activeWorkspaceTab === item.value;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: buildWorkspaceTabHref(workspacePathId, item.value),
                                                        "aria-current": isActive ? "page" : undefined,
                                                        className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                        children: tWorkspaceTabWithDevStatus(item.value, item.label)
                                                    }, item.value, false, {
                                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                        lineNumber: 686,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 680,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                        lineNumber: 527,
                                        columnNumber: 19
                                    }, this) : // ── Workspace hub: show recent workspaces ──────────────
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: showRecentWorkspaces && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-0.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70",
                                                    children: "最近工作區"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 708,
                                                    columnNumber: 25
                                                }, this),
                                                visibleRecentWorkspaceLinks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "px-2 py-2 text-[11px] text-muted-foreground",
                                                    children: "尚無最近開啟的工作區。"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 712,
                                                    columnNumber: 27
                                                }, this) : visibleRecentWorkspaceLinks.map((ws)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: ws.href,
                                                        onClick: ()=>{
                                                            onSelectWorkspace(ws.id);
                                                        },
                                                        className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${activeWorkspaceId === ws.id || isActiveRoute(ws.href) ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted hover:text-foreground"}`,
                                                        title: ws.name,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "truncate",
                                                            children: ws.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 730,
                                                            columnNumber: 31
                                                        }, this)
                                                    }, ws.id, false, {
                                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                        lineNumber: 717,
                                                        columnNumber: 29
                                                    }, this)),
                                                hasOverflow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>{
                                                        setIsExpanded((prev)=>!prev);
                                                    },
                                                    className: "px-2 py-1 text-[11px] font-medium text-primary hover:underline",
                                                    children: isExpanded ? "收起" : "顯示更多"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 735,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 707,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false)
                                }, void 0, false),
                                section === "wiki-beta" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                    className: "space-y-0.5",
                                    "aria-label": "Account Wiki-Beta navigation",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70",
                                            children: "Account Wiki-Beta"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 754,
                                            columnNumber: 17
                                        }, this),
                                        [
                                            {
                                                href: "/wiki-beta",
                                                label: "知識總覽"
                                            },
                                            {
                                                href: "/wiki-beta/block-editor",
                                                label: "區塊編輯器"
                                            },
                                            {
                                                href: "/wiki-beta/pages-dnd",
                                                label: "頁面 (DnD)"
                                            },
                                            {
                                                href: "/wiki-beta/rag-query",
                                                label: "RAG Query"
                                            }
                                        ].map((item)=>{
                                            const active = isActiveRoute(item.href);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                "aria-current": active ? "page" : undefined,
                                                className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                children: item.label
                                            }, item.href, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 767,
                                                columnNumber: 21
                                            }, this);
                                        }),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex items-center rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/wiki-beta/documents",
                                                    "aria-current": isActiveRoute("/wiki-beta/documents") ? "page" : undefined,
                                                    className: `flex-1 ${isActiveRoute("/wiki-beta/documents") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`,
                                                    children: "Documents"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 783,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: (event)=>{
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        setWikiBetaQuickCreateOpen((prev)=>!prev);
                                                    },
                                                    className: "ml-1 inline-flex size-5 items-center justify-center rounded transition hover:bg-muted-foreground/15",
                                                    "aria-label": "快速新增頁面或資料庫",
                                                    title: "快速新增",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        className: "size-3.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                        lineNumber: 805,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 794,
                                                    columnNumber: 19
                                                }, this),
                                                wikiBetaQuickCreateOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute right-0 top-8 z-10 min-w-36 rounded-md border border-border/60 bg-popover p-1 shadow-md",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>void handleWikiBetaQuickCreate("page"),
                                                            disabled: creatingKind !== null,
                                                            className: "flex w-full items-center rounded px-2 py-1.5 text-left text-xs text-foreground transition hover:bg-muted disabled:opacity-50",
                                                            children: creatingKind === "page" ? "建立中..." : "新增頁面"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 810,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>void handleWikiBetaQuickCreate("database"),
                                                            disabled: creatingKind !== null,
                                                            className: "flex w-full items-center rounded px-2 py-1.5 text-left text-xs text-foreground transition hover:bg-muted disabled:opacity-50",
                                                            children: creatingKind === "database" ? "建立中..." : "新增資料庫"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                            lineNumber: 818,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 809,
                                                    columnNumber: 21
                                                }, this) : null
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 782,
                                            columnNumber: 17
                                        }, this),
                                        [
                                            {
                                                href: "/wiki-beta/pages",
                                                label: "Pages"
                                            },
                                            {
                                                href: "/wiki-beta/libraries",
                                                label: "Libraries"
                                            },
                                            {
                                                href: "/wiki-beta/rag-reindex",
                                                label: "RAG Reindex"
                                            }
                                        ].map((item)=>{
                                            const active = isActiveRoute(item.href);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                "aria-current": active ? "page" : undefined,
                                                className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                children: item.label
                                            }, item.href, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 839,
                                                columnNumber: 21
                                            }, this);
                                        }),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "my-1.5 border-t border-border/40"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 854,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                setIsWikiBetaWorkspacesExpanded((prev)=>!prev);
                                            },
                                            className: "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                                            "aria-expanded": isWikiBetaWorkspacesExpanded,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Workspaces"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 864,
                                                    columnNumber: 19
                                                }, this),
                                                isWikiBetaWorkspacesExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                    className: "size-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 865,
                                                    columnNumber: 51
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                    className: "size-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 865,
                                                    columnNumber: 90
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 856,
                                            columnNumber: 17
                                        }, this),
                                        isWikiBetaWorkspacesExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-0.5 pl-2",
                                            children: !workspacesHydrated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "px-2 py-1.5 text-[11px] text-muted-foreground",
                                                children: "工作區載入中..."
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 871,
                                                columnNumber: 23
                                            }, this) : allWorkspaceLinks.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "px-2 py-1.5 text-[11px] text-muted-foreground",
                                                children: "目前帳號沒有工作區"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 873,
                                                columnNumber: 23
                                            }, this) : allWorkspaceLinks.map((workspace)=>{
                                                const active = activeWorkspaceId === workspace.id;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: workspace.href,
                                                    onClick: ()=>{
                                                        onSelectWorkspace(workspace.id);
                                                    },
                                                    "aria-current": active ? "page" : undefined,
                                                    className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                    title: workspace.name,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "truncate",
                                                        children: workspace.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                        lineNumber: 892,
                                                        columnNumber: 29
                                                    }, this)
                                                }, workspace.id, false, {
                                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                    lineNumber: 878,
                                                    columnNumber: 27
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 869,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                    lineNumber: 753,
                                    columnNumber: 15
                                }, this),
                                section === "ai-chat" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                    className: "space-y-0.5",
                                    "aria-label": "AI Chat navigation",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70",
                                            children: "AI Chat"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 904,
                                            columnNumber: 17
                                        }, this),
                                        [
                                            {
                                                href: "/ai-chat",
                                                label: "對話紀錄"
                                            }
                                        ].map((item)=>{
                                            const active = isActiveRoute(item.href);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                "aria-current": active ? "page" : undefined,
                                                className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                children: item.label
                                            }, item.href, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 914,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                    lineNumber: 903,
                                    columnNumber: 15
                                }, this),
                                section === "settings" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                    className: "space-y-0.5",
                                    "aria-label": "Settings navigation",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70",
                                            children: "個人設定"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                            lineNumber: 933,
                                            columnNumber: 17
                                        }, this),
                                        [
                                            {
                                                href: "/settings/profile",
                                                label: "個人資料"
                                            },
                                            {
                                                href: "/settings/general",
                                                label: "一般"
                                            },
                                            {
                                                href: "/settings/notifications",
                                                label: "推播通知"
                                            }
                                        ].map((item)=>{
                                            const active = isActiveRoute(item.href);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                "aria-current": active ? "page" : undefined,
                                                className: `flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                                                children: item.label
                                            }, item.href, false, {
                                                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                                lineNumber: 945,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                                    lineNumber: 932,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                            lineNumber: 455,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                lineNumber: 415,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$customize$2d$navigation$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CustomizeNavigationDialog"], {
                open: customizeOpen,
                onOpenChange: setCustomizeOpen,
                onPreferencesChange: setNavPrefs
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/dashboard-sidebar.tsx",
                lineNumber: 965,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true);
}
_s(DashboardSidebar, "w8Z87pcJZdwzZZcBU1MXpemslrE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = DashboardSidebar;
var _c;
__turbopack_context__.k.register(_c, "DashboardSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/global-search-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlobalSearchDialog",
    ()=>GlobalSearchDialog,
    "useGlobalSearch",
    ()=>useGlobalSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panels$2d$top$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layout$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panels-top-left.js [app-client] (ecmascript) <export default as Layout>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/command.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const NAV_ITEMS = [
    {
        href: "/dashboard",
        label: "儀表板",
        group: "導覽"
    },
    {
        href: "/wiki-beta",
        label: "Account Wiki-Beta",
        group: "導覽"
    },
    {
        href: "/wiki-beta/block-editor",
        label: "區塊編輯器",
        group: "Wiki-Beta"
    },
    {
        href: "/wiki-beta/pages-dnd",
        label: "頁面樹 (DnD)",
        group: "Wiki-Beta"
    },
    {
        href: "/wiki-beta/libraries",
        label: "Libraries 表格",
        group: "Wiki-Beta"
    },
    {
        href: "/wiki-beta/rag-query",
        label: "RAG 查詢",
        group: "Wiki-Beta"
    },
    {
        href: "/wiki-beta/documents",
        label: "文件管理",
        group: "Wiki-Beta"
    },
    {
        href: "/settings",
        label: "個人設定",
        group: "設定"
    }
];
const GROUP_ICONS = {
    "導覽": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panels$2d$top$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layout$3e$__["Layout"], {
        className: "size-4 mr-2 opacity-60"
    }, void 0, false, {
        fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
        lineNumber: 29,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    "Wiki-Beta": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
        className: "size-4 mr-2 opacity-60"
    }, void 0, false, {
        fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
        lineNumber: 30,
        columnNumber: 16
    }, ("TURBOPACK compile-time value", void 0)),
    "設定": /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
        className: "size-4 mr-2 opacity-60"
    }, void 0, false, {
        fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
        lineNumber: 31,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0))
};
function GlobalSearchDialog({ open, onOpenChange }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    function handleSelect(href) {
        onOpenChange(false);
        router.push(href);
    }
    const groups = Array.from(new Set(NAV_ITEMS.map((i)=>i.group)));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandDialog"], {
        title: "全域搜尋",
        description: "搜尋頁面或功能",
        open: open,
        onOpenChange: onOpenChange,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandInput"], {
                placeholder: "搜尋頁面或功能…"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandList"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandEmpty"], {
                        children: "找不到結果。"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    groups.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                            heading: group,
                            children: NAV_ITEMS.filter((i)=>i.group === group).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                    onSelect: ()=>handleSelect(item.href),
                                    children: [
                                        GROUP_ICONS[group],
                                        item.label,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandShortcut"], {
                                            className: "text-[10px] opacity-50",
                                            children: item.href
                                        }, void 0, false, {
                                            fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
                                            lineNumber: 68,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, item.href, true, {
                                    fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
                                    lineNumber: 62,
                                    columnNumber: 15
                                }, this))
                        }, group, false, {
                            fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/_components/global-search-dialog.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
_s(GlobalSearchDialog, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = GlobalSearchDialog;
function useGlobalSearch() {
    _s1();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useGlobalSearch.useEffect": ()=>{
            function onKeyDown(event) {
                if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                    event.preventDefault();
                    setOpen({
                        "useGlobalSearch.useEffect.onKeyDown": (prev)=>!prev
                    }["useGlobalSearch.useEffect.onKeyDown"]);
                }
            }
            document.addEventListener("keydown", onKeyDown);
            return ({
                "useGlobalSearch.useEffect": ()=>document.removeEventListener("keydown", onKeyDown)
            })["useGlobalSearch.useEffect"];
        }
    }["useGlobalSearch.useEffect"], []);
    return {
        open,
        setOpen
    };
}
_s1(useGlobalSearch, "e27cRtNMdAs0U0o1oHlS6A8OEBo=");
var _c;
__turbopack_context__.k.register(_c, "GlobalSearchDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/translation-switcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TranslationSwitcher",
    ()=>TranslationSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Module: translation-switcher.tsx
 * Purpose: provide a reusable locale switch control for shell-level UI.
 * Responsibilities: persist locale preference and sync html lang attribute.
 * Constraints: keep state client-side and avoid coupling to business modules.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/languages.js [app-client] (ecmascript) <export default as Languages>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dropdown-menu.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const LOCALE_STORAGE_KEY = "xuanwu_locale";
const localeOptions = [
    {
        value: "en",
        label: "English"
    },
    {
        value: "zh-TW",
        label: "繁體中文"
    }
];
function isLocaleValue(value) {
    return value === "en" || value === "zh-TW";
}
function TranslationSwitcher() {
    _s();
    const [locale, setLocale] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "TranslationSwitcher.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const storedValue = window.localStorage.getItem(LOCALE_STORAGE_KEY);
            return isLocaleValue(storedValue) ? storedValue : "en";
        }
    }["TranslationSwitcher.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TranslationSwitcher.useEffect": ()=>{
            document.documentElement.lang = locale;
            window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
        }
    }["TranslationSwitcher.useEffect"], [
        locale
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    type: "button",
                    variant: "outline",
                    size: "icon-sm",
                    "aria-label": "Switch language",
                    className: "text-muted-foreground",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__["Languages"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                align: "end",
                className: "w-40",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                        children: "Language"
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuRadioGroup"], {
                        value: locale,
                        onValueChange: (value)=>{
                            if (isLocaleValue(value)) {
                                setLocale(value);
                            }
                        },
                        children: localeOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuRadioItem"], {
                                value: option.value,
                                children: option.label
                            }, option.value, false, {
                                fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/_components/translation-switcher.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s(TranslationSwitcher, "dJ1yLvb1i1TTfCoJY8Tb6GrYGVo=");
_c = TranslationSwitcher;
var _c;
__turbopack_context__.k.register(_c, "TranslationSwitcher");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/header-controls.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeaderControls",
    ()=>HeaderControls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Module: header-controls.tsx
 * Purpose: compose shell header utility controls.
 * Responsibilities: language switch, theme toggle, and notification entry.
 * Constraints: presentation-only, no domain orchestration.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/auth-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/notification/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$_actions$2f$data$3a$b33af8__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/notification/interfaces/_actions/data:b33af8 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$_actions$2f$data$3a$c5c06d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/notification/interfaces/_actions/data:c5c06d [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$queries$2f$notification$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/notification/interfaces/queries/notification.queries.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$translation$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/translation-switcher.tsx [app-client] (ecmascript)");
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
const THEME_KEY = "xuanwu_theme";
const NOTIFICATION_LIMIT = 20;
function formatNotificationTime(timestamp) {
    return new Intl.DateTimeFormat("zh-TW", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(timestamp));
}
function HeaderControls() {
    _s();
    const { state: authState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "HeaderControls.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const storedTheme = window.localStorage.getItem(THEME_KEY);
            if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
            return document.documentElement.classList.contains("dark") ? "dark" : "light";
        }
    }["HeaderControls.useState"]);
    const [isNotificationOpen, setIsNotificationOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNotificationLoading, setIsNotificationLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNotificationMutating, setIsNotificationMutating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const recipientId = authState.user?.id ?? "";
    const unreadCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "HeaderControls.useMemo[unreadCount]": ()=>notifications.reduce({
                "HeaderControls.useMemo[unreadCount]": (count, notification)=>count + (notification.read ? 0 : 1)
            }["HeaderControls.useMemo[unreadCount]"], 0)
    }["HeaderControls.useMemo[unreadCount]"], [
        notifications
    ]);
    const loadNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HeaderControls.useCallback[loadNotifications]": async ()=>{
            if (!recipientId) {
                setNotifications([]);
                return;
            }
            setIsNotificationLoading(true);
            try {
                const nextNotifications = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$queries$2f$notification$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNotificationsForRecipient"])(recipientId, NOTIFICATION_LIMIT);
                setNotifications(nextNotifications);
            } finally{
                setIsNotificationLoading(false);
            }
        }
    }["HeaderControls.useCallback[loadNotifications]"], [
        recipientId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeaderControls.useEffect": ()=>{
            document.documentElement.classList.toggle("dark", theme === "dark");
            window.localStorage.setItem(THEME_KEY, theme);
        }
    }["HeaderControls.useEffect"], [
        theme
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeaderControls.useEffect": ()=>{
            void loadNotifications();
        }
    }["HeaderControls.useEffect"], [
        loadNotifications
    ]);
    function toggleTheme() {
        setTheme((current)=>current === "light" ? "dark" : "light");
    }
    async function handleNotificationOpenChange(nextOpen) {
        setIsNotificationOpen(nextOpen);
        if (nextOpen) {
            await loadNotifications();
        }
    }
    async function handleMarkOneRead(notificationId) {
        if (!recipientId) return;
        setIsNotificationMutating(true);
        const previous = notifications;
        setNotifications((current)=>current.map((notification)=>notification.id === notificationId ? {
                    ...notification,
                    read: true
                } : notification));
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$_actions$2f$data$3a$c5c06d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["markNotificationRead"])(notificationId, recipientId);
            if (!result.success) {
                setNotifications(previous);
            }
        } finally{
            setIsNotificationMutating(false);
        }
    }
    async function handleMarkAllRead() {
        if (!recipientId || unreadCount === 0) return;
        setIsNotificationMutating(true);
        const previous = notifications;
        setNotifications((current)=>current.map((notification)=>({
                    ...notification,
                    read: true
                })));
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$notification$2f$interfaces$2f$_actions$2f$data$3a$b33af8__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["markAllNotificationsRead"])(recipientId);
            if (!result.success) {
                setNotifications(previous);
            }
        } finally{
            setIsNotificationMutating(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$translation$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TranslationSwitcher"], {}, void 0, false, {
                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                type: "button",
                variant: "outline",
                size: "icon-sm",
                onClick: toggleTheme,
                "aria-label": "Toggle theme",
                className: "text-muted-foreground",
                children: theme === "light" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                    lineNumber: 135,
                    columnNumber: 30
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                    lineNumber: 135,
                    columnNumber: 61
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                open: isNotificationOpen,
                onOpenChange: handleNotificationOpenChange,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "button",
                            variant: "outline",
                            size: "icon-sm",
                            "aria-label": "Open notifications",
                            className: "relative text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                    lineNumber: 147,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute -right-1 -top-1 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] font-semibold leading-4 text-primary-foreground",
                                    children: unreadCount > 99 ? "99+" : unreadCount
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                        align: "end",
                        className: "w-80 p-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between px-3 py-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold",
                                        children: "Notifications"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                        lineNumber: 155,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        variant: "ghost",
                                        size: "sm",
                                        className: "h-7 px-2 text-xs",
                                        disabled: isNotificationMutating || unreadCount === 0,
                                        onClick: handleMarkAllRead,
                                        children: "Mark all read"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                        lineNumber: 156,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "max-h-80 overflow-y-auto",
                                children: isNotificationLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "px-3 py-6 text-center text-sm text-muted-foreground",
                                    children: "Loading..."
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                    lineNumber: 170,
                                    columnNumber: 15
                                }, this) : notifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "px-3 py-6 text-center text-sm text-muted-foreground",
                                    children: "No notifications"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this) : notifications.map((notification)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>void handleMarkOneRead(notification.id),
                                        disabled: isNotificationMutating,
                                        className: "block w-full border-b border-border/60 px-3 py-2 text-left transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-70",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-medium",
                                                        children: notification.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                                        lineNumber: 183,
                                                        columnNumber: 21
                                                    }, this),
                                                    !notification.read ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "mt-1 h-2 w-2 shrink-0 rounded-full bg-primary",
                                                        "aria-hidden": "true"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                                        lineNumber: 185,
                                                        columnNumber: 23
                                                    }, this) : null
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                                lineNumber: 182,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
                                                children: notification.message
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                                lineNumber: 188,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-[11px] text-muted-foreground",
                                                children: formatNotificationTime(notification.timestamp)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                                lineNumber: 191,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, notification.id, true, {
                                        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                        lineNumber: 175,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/_components/header-controls.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/_components/header-controls.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_s(HeaderControls, "vcnFljCU5kyuPeItf/Oav4C8Mbo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = HeaderControls;
var _c;
__turbopack_context__.k.register(_c, "HeaderControls");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/header-user-avatar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeaderUserAvatar",
    ()=>HeaderUserAvatar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Module: header-user-avatar.tsx
 * Purpose: render top-right signed-in user identity as avatar with quick actions.
 * Responsibilities: display user identity and expose sign-out action.
 * Constraints: keep header interaction lightweight and presentation-oriented.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/dropdown-menu.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function toInitial(name, email) {
    const source = name.trim() || email.trim();
    return source.charAt(0).toUpperCase() || "U";
}
function HeaderUserAvatar({ name, email, onSignOut }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    "aria-label": "開啟使用者選單",
                    className: "rounded-full ring-offset-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                        size: "sm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                            className: "bg-primary/10 text-xs font-semibold text-primary",
                            children: toInitial(name, email)
                        }, void 0, false, {
                            fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                            lineNumber: 43,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                align: "end",
                className: "w-64",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-2 px-4 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                size: "lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                    className: "bg-primary/10 text-lg font-semibold text-primary",
                                    children: toInitial(name, email)
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold text-foreground",
                                        children: name
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                        lineNumber: 58,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: email
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                        lineNumber: 59,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/settings",
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                    className: "size-4 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "設定"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/settings?tab=preferences",
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                                    className: "size-4 shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "偏好設定"
                                }, void 0, false, {
                                    fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                        variant: "destructive",
                        onClick: onSignOut,
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                className: "size-4 shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "登出"
                            }, void 0, false, {
                                fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/_components/header-user-avatar.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_c = HeaderUserAvatar;
var _c;
__turbopack_context__.k.register(_c, "HeaderUserAvatar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/_components/shell-guard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShellGuard",
    ()=>ShellGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * shell-guard.tsx
 * Client-side auth guard for the authenticated shell.
 *
 * Responsibilities:
 *  1. Redirect to `/` (public auth page) when auth status is "unauthenticated"
 *  2. Mount useTokenRefreshListener for [S6] Claims refresh (Party 3)
 *  3. Show a loading state while auth is initializing
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/auth-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/identity/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$interfaces$2f$hooks$2f$useTokenRefreshListener$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/identity/interfaces/hooks/useTokenRefreshListener.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ShellGuard({ children }) {
    _s();
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { user, status } = state;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // [S6] Party 3: force-refresh ID token when a TOKEN_REFRESH_SIGNAL is emitted
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$interfaces$2f$hooks$2f$useTokenRefreshListener$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTokenRefreshListener"])(user?.id ?? null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShellGuard.useEffect": ()=>{
            if (status === "unauthenticated") {
                router.replace("/");
            }
        }
    }["ShellGuard.useEffect"], [
        status,
        router
    ]);
    if (status === "initializing") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen items-center justify-center bg-background",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
            }, void 0, false, {
                fileName: "[project]/app/(shell)/_components/shell-guard.tsx",
                lineNumber: 40,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(shell)/_components/shell-guard.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this);
    }
    if (status === "unauthenticated") {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(ShellGuard, "fX6TzYGk4Ak4M53uRycFGjIykN8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$identity$2f$interfaces$2f$hooks$2f$useTokenRefreshListener$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTokenRefreshListener"]
    ];
});
_c = ShellGuard;
var _c;
__turbopack_context__.k.register(_c, "ShellGuard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(shell)/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShellLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Module: shell layout
 * Purpose: compose authenticated shell frame with sidebar, header, and content area.
 * Responsibilities: account switching, route guards, and shell-level UI composition.
 * Constraints: keep business logic in modules and providers, not layout rendering.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panel-left-open.js [app-client] (ecmascript) <export default as PanelLeftOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/app-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/auth-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$account$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/account-switcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$app$2d$breadcrumbs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/app-breadcrumbs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$app$2d$rail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/app-rail.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$dashboard$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/dashboard-sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$global$2d$search$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/global-search-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$header$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/header-controls.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$header$2d$user$2d$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/header-user-avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$shell$2d$guard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/(shell)/_components/shell-guard.tsx [app-client] (ecmascript)");
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
;
;
;
;
;
;
;
const routeTitles = {
    "/dashboard": "儀表板",
    "/organization": "組織治理",
    "/organization/daily": "Account · 每日",
    "/organization/schedule": "Account · 排程",
    "/organization/schedule/dispatcher": "Account · 調度台",
    "/organization/audit": "Account · 稽核",
    "/workspace": "工作區中心",
    "/wiki-beta": "Account Wiki-Beta",
    "/wiki-beta/rag-query": "Account Wiki-Beta · RAG 查詢",
    "/wiki-beta/documents": "Account Wiki-Beta · 文件",
    "/ai-chat": "AI 對話",
    "/settings": "個人設定",
    "/dev-tools": "開發工具"
};
/** Used only by the mobile header nav strip (md:hidden). Desktop nav is in AppRail. */ const mobileNavItems = [
    {
        href: "/dashboard",
        label: "儀表板"
    },
    {
        href: "/workspace",
        label: "工作區"
    },
    {
        href: "/settings",
        label: "個人設定"
    }
];
const organizationManagementItems = [
    {
        label: "成員",
        href: "/organization/members"
    },
    {
        label: "團隊",
        href: "/organization/teams"
    },
    {
        label: "權限",
        href: "/organization/permissions"
    },
    {
        label: "工作區",
        href: "/organization/workspaces"
    },
    {
        label: "排程",
        href: "/organization/schedule"
    },
    {
        label: "每日",
        href: "/organization/daily"
    },
    {
        label: "稽核",
        href: "/organization/audit"
    }
];
function isOrganizationAccount(activeAccount) {
    return activeAccount != null && "accountType" in activeAccount && activeAccount.accountType === "organization";
}
function resolveShellRouteForAccount(pathname, nextAccount) {
    const nextAccountIsOrganization = nextAccount != null && "accountType" in nextAccount && nextAccount.accountType === "organization";
    if (pathname === "/settings" && nextAccountIsOrganization) {
        return "/organization";
    }
    if (pathname === "/organization" && !nextAccountIsOrganization) {
        return "/settings";
    }
    return null;
}
function ShellLayout({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { state: authState, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { state: appState, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const [logoutError, setLogoutError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { open: searchOpen, setOpen: setSearchOpen } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$global$2d$search$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGlobalSearch"])();
    const [sidebarCollapsed, setSidebarCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ShellLayout.useState": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return window.localStorage.getItem("xuanwu:sidebar-collapsed") === "true";
        }
    }["ShellLayout.useState"]);
    function toggleSidebar() {
        setSidebarCollapsed((prev)=>{
            const next = !prev;
            if ("TURBOPACK compile-time truthy", 1) {
                window.localStorage.setItem("xuanwu:sidebar-collapsed", String(next));
            }
            return next;
        });
    }
    const pageTitle = routeTitles[pathname] ?? "工作區";
    const organizationAccounts = Object.values(appState.accounts ?? {});
    const accountWorkspaces = Object.values(appState.workspaces ?? {});
    const showAccountManagement = isOrganizationAccount(appState.activeAccount);
    function isActiveRoute(href) {
        return pathname === href || pathname.startsWith(`${href}/`);
    }
    function handleSelectOrganization(account) {
        dispatch({
            type: "SET_ACTIVE_ACCOUNT",
            payload: account
        });
        const nextRoute = resolveShellRouteForAccount(pathname, account);
        if (nextRoute) {
            router.replace(nextRoute);
        }
    }
    function handleSelectPersonal() {
        if (!authState.user) return;
        dispatch({
            type: "SET_ACTIVE_ACCOUNT",
            payload: authState.user
        });
        const nextRoute = resolveShellRouteForAccount(pathname, authState.user);
        if (nextRoute) {
            router.replace(nextRoute);
        }
    }
    function handleOrganizationCreated(account) {
        dispatch({
            type: "SET_ACTIVE_ACCOUNT",
            payload: account
        });
    }
    function handleSelectWorkspace(workspaceId) {
        dispatch({
            type: "SET_ACTIVE_WORKSPACE",
            payload: workspaceId
        });
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShellLayout.useEffect": ()=>{
            if (!appState.accountsHydrated || !appState.activeAccount) {
                return;
            }
            const nextRoute = resolveShellRouteForAccount(pathname, appState.activeAccount);
            if (nextRoute && nextRoute !== pathname) {
                router.replace(nextRoute);
            }
        }
    }["ShellLayout.useEffect"], [
        appState.accountsHydrated,
        appState.activeAccount,
        pathname,
        router
    ]);
    async function handleLogout() {
        setLogoutError(null);
        try {
            await logout();
        } catch  {
            setLogoutError("登出失敗，請稍後再試。");
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$shell$2d$guard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShellGuard"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$global$2d$search$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlobalSearchDialog"], {
                open: searchOpen,
                onOpenChange: setSearchOpen
            }, void 0, false, {
                fileName: "[project]/app/(shell)/layout.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-screen overflow-hidden bg-background",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$app$2d$rail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppRail"], {
                        pathname: pathname,
                        user: authState.user,
                        activeAccount: appState.activeAccount,
                        organizationAccounts: organizationAccounts,
                        workspaces: accountWorkspaces,
                        workspacesHydrated: appState.workspacesHydrated,
                        isOrganizationAccount: showAccountManagement,
                        onSelectPersonal: handleSelectPersonal,
                        onSelectOrganization: handleSelectOrganization,
                        activeWorkspaceId: appState.activeWorkspaceId,
                        onSelectWorkspace: handleSelectWorkspace,
                        onOrganizationCreated: handleOrganizationCreated,
                        onSignOut: ()=>{
                            void handleLogout();
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/layout.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$dashboard$2d$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DashboardSidebar"], {
                        pathname: pathname,
                        activeAccount: appState.activeAccount,
                        workspaces: accountWorkspaces,
                        workspacesHydrated: appState.workspacesHydrated,
                        activeWorkspaceId: appState.activeWorkspaceId,
                        collapsed: sidebarCollapsed,
                        onToggleCollapsed: toggleSidebar,
                        onSelectWorkspace: handleSelectWorkspace
                    }, void 0, false, {
                        fileName: "[project]/app/(shell)/layout.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex min-w-0 flex-1 flex-col overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                className: "shrink-0 border-b border-border/50 bg-background/80 px-4 backdrop-blur md:px-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-12 items-center justify-between gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0 flex items-center gap-3",
                                                children: [
                                                    sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: toggleSidebar,
                                                        "aria-label": "展開側欄",
                                                        title: "展開側欄",
                                                        className: "hidden size-7 items-center justify-center rounded text-muted-foreground transition hover:bg-muted hover:text-foreground md:flex",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftOpen$3e$__["PanelLeftOpen"], {
                                                            className: "size-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(shell)/layout.tsx",
                                                            lineNumber: 208,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/layout.tsx",
                                                        lineNumber: 201,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-sm font-semibold tracking-tight",
                                                        children: pageTitle
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/layout.tsx",
                                                        lineNumber: 211,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$app$2d$breadcrumbs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppBreadcrumbs"], {}, void 0, false, {
                                                        fileName: "[project]/app/(shell)/layout.tsx",
                                                        lineNumber: 212,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        "aria-label": "全域搜尋",
                                                        className: "hidden items-center gap-1.5 rounded-md border border-border/50 bg-background/50 px-2.5 py-1 text-xs text-muted-foreground transition hover:border-border hover:bg-muted sm:flex",
                                                        onClick: ()=>setSearchOpen(true),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                className: "size-3 shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                                lineNumber: 220,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "搜尋…"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                                lineNumber: 221,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                                                className: "ml-1 rounded bg-muted px-1 text-[10px] text-muted-foreground/60",
                                                                children: "⌘K"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                                lineNumber: 222,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(shell)/layout.tsx",
                                                        lineNumber: 214,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                lineNumber: 199,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "ml-auto flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$header$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HeaderControls"], {}, void 0, false, {
                                                        fileName: "[project]/app/(shell)/layout.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$header$2d$user$2d$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HeaderUserAvatar"], {
                                                        name: authState.user?.name ?? "Dimension Member",
                                                        email: authState.user?.email ?? "—",
                                                        onSignOut: ()=>{
                                                            void handleLogout();
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(shell)/layout.tsx",
                                                        lineNumber: 228,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                lineNumber: 226,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(shell)/layout.tsx",
                                        lineNumber: 198,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3 pb-3 md:hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$account$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccountSwitcher"], {
                                                personalAccount: authState.user,
                                                organizationAccounts: organizationAccounts,
                                                activeAccountId: appState.activeAccount?.id ?? null,
                                                onSelectPersonal: handleSelectPersonal,
                                                onSelectOrganization: handleSelectOrganization,
                                                onOrganizationCreated: handleOrganizationCreated
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                lineNumber: 239,
                                                columnNumber: 15
                                            }, this),
                                            showAccountManagement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                                "aria-label": "Organization management",
                                                className: "flex gap-2 overflow-auto",
                                                children: organizationManagementItems.map((item)=>{
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: item.href,
                                                        className: "whitespace-nowrap rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted",
                                                        children: item.label
                                                    }, item.href, false, {
                                                        fileName: "[project]/app/(shell)/layout.tsx",
                                                        lineNumber: 252,
                                                        columnNumber: 23
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                lineNumber: 249,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(shell)/layout.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                        "aria-label": "Main navigation",
                                        className: "flex gap-2 overflow-auto pb-3 md:hidden",
                                        children: mobileNavItems.map((item)=>{
                                            const isActive = isActiveRoute(item.href);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                "aria-current": isActive ? "page" : undefined,
                                                className: `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${isActive ? "bg-primary/10 text-primary" : "border border-border/60 text-muted-foreground hover:bg-muted"}`,
                                                children: item.label
                                            }, item.href, false, {
                                                fileName: "[project]/app/(shell)/layout.tsx",
                                                lineNumber: 269,
                                                columnNumber: 19
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/app/(shell)/layout.tsx",
                                        lineNumber: 265,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(shell)/layout.tsx",
                                lineNumber: 197,
                                columnNumber: 11
                            }, this),
                            logoutError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "shrink-0 px-4 pt-3 text-xs text-destructive md:px-6",
                                children: logoutError
                            }, void 0, false, {
                                fileName: "[project]/app/(shell)/layout.tsx",
                                lineNumber: 287,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                                className: "flex-1 overflow-auto p-6",
                                children: children
                            }, void 0, false, {
                                fileName: "[project]/app/(shell)/layout.tsx",
                                lineNumber: 290,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(shell)/layout.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(shell)/layout.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(shell)/layout.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
_s(ShellLayout, "5fzwlf5jS9xOsFbe8N2hHi19yCU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$shell$292f$_components$2f$global$2d$search$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGlobalSearch"]
    ];
});
_c = ShellLayout;
var _c;
__turbopack_context__.k.register(_c, "ShellLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_%28shell%29_e01cc6a2._.js.map