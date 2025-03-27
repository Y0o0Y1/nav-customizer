(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_ae3ee6b5._.js", {

"[project]/src/theme/theme.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$styles$2f$createTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__createTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/styles/createTheme.js [app-client] (ecmascript) <locals> <export default as createTheme>");
;
// Create a theme instance
const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$styles$2f$createTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__createTheme$3e$__["createTheme"])({
    palette: {
        primary: {
            main: '#4CAF50',
            light: '#80e27e',
            dark: '#087f23',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#f5f5f5',
            light: '#ffffff',
            dark: '#c2c2c2'
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff'
        },
        text: {
            primary: '#333333',
            secondary: '#666666'
        },
        error: {
            main: '#ea4335'
        }
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 500,
            fontSize: '1.75rem'
        },
        h5: {
            fontWeight: 500,
            fontSize: '1.5rem'
        },
        h6: {
            fontWeight: 500,
            fontSize: '1.125rem'
        },
        body1: {
            fontSize: '1rem'
        },
        body2: {
            fontSize: '0.875rem'
        }
    },
    shape: {
        borderRadius: 8
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none'
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 4
                }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#666666'
                }
            }
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    color: '#f5f5f5',
                    '&.Mui-checked': {
                        color: '#4CAF50'
                    },
                    '&.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4CAF50'
                    }
                },
                track: {
                    backgroundColor: '#c2c2c2'
                }
            }
        }
    }
});
const __TURBOPACK__default__export__ = theme;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/api/axiosBaseQuery.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "axiosBaseQuery": (()=>axiosBaseQuery)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const axiosInstance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.REACT_APP_BASE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});
const axiosBaseQuery = ({ baseUrl } = {
    baseUrl: ""
})=>async ({ url, method = "GET", data, params, headers })=>{
        try {
            const result = await axiosInstance({
                url: baseUrl + url,
                method,
                data,
                params,
                headers
            });
            return {
                data: result.data
            };
        } catch (axiosError) {
            const err = axiosError;
            return {
                error: {
                    status: err.response?.status || 500,
                    data: err.response?.data || err.message
                }
            };
        }
    };
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/api/services/navigationApi.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "navigationApi": (()=>navigationApi),
    "useGetNavigationQuery": (()=>useGetNavigationQuery),
    "useSaveNavigationMutation": (()=>useSaveNavigationMutation),
    "useTrackNavItemMoveMutation": (()=>useTrackNavItemMoveMutation)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axiosBaseQuery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/axiosBaseQuery.ts [app-client] (ecmascript)");
;
;
const mockNavItems = [
    {
        id: 1,
        title: 'Dashboard',
        target: '/dashboard',
        visible: true,
        level: 0
    },
    {
        id: 2,
        title: 'Job application',
        target: '#',
        visible: true,
        level: 0,
        children: [
            {
                id: 3,
                title: 'John Doe',
                target: '/john-doe',
                visible: true,
                level: 1
            },
            {
                id: 4,
                title: 'James Bond',
                target: '/james-bond',
                visible: true,
                level: 1
            },
            {
                id: 5,
                title: 'Scarlett Johansson',
                target: '/scarlett-johansson',
                visible: false,
                level: 1
            }
        ]
    },
    {
        id: 6,
        title: 'Qualifications',
        target: '#',
        visible: true,
        level: 0,
        children: []
    },
    {
        id: 7,
        title: 'About',
        target: '/about',
        visible: true,
        level: 0
    },
    {
        id: 8,
        title: 'Contact',
        target: '/contact',
        visible: true,
        level: 0
    }
];
const navigationApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: 'navigationApi',
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$axiosBaseQuery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axiosBaseQuery"])({
        baseUrl: 'http://localhost:8081'
    }),
    tagTypes: [
        'Navigation'
    ],
    endpoints: (builder)=>({
            getNavigation: builder.query({
                query: ()=>({
                        url: '/nav',
                        method: 'GET'
                    }),
                transformResponse: ()=>mockNavItems,
                providesTags: [
                    'Navigation'
                ]
            }),
            saveNavigation: builder.mutation({
                query: (navItems)=>({
                        url: '/nav',
                        method: 'POST',
                        data: navItems
                    }),
                invalidatesTags: [
                    'Navigation'
                ]
            }),
            trackNavItemMove: builder.mutation({
                query: (trackData)=>({
                        url: '/track',
                        method: 'POST',
                        data: trackData
                    })
            })
        })
});
const { useGetNavigationQuery, useSaveNavigationMutation, useTrackNavItemMoveMutation } = navigationApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/redux/slices/uiSlice.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "setLoading": (()=>setLoading),
    "setMenuOpen": (()=>setMenuOpen),
    "uiSlice": (()=>uiSlice)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$services$2f$navigationApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/services/navigationApi.ts [app-client] (ecmascript)");
;
;
const initialState = {
    isLoading: false,
    isMenuOpen: false
};
const uiSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: 'ui',
    initialState,
    reducers: {
        setLoading: (state, action)=>{
            state.isLoading = action.payload;
        },
        setMenuOpen: (state, action)=>{
            state.isMenuOpen = action.payload;
        }
    },
    extraReducers: (builder)=>{
        const navigationApiEndpoints = [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$services$2f$navigationApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["navigationApi"].endpoints.getNavigation,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$services$2f$navigationApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["navigationApi"].endpoints.saveNavigation,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$services$2f$navigationApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["navigationApi"].endpoints.trackNavItemMove
        ];
        navigationApiEndpoints.forEach((endpoint)=>{
            builder.addMatcher(endpoint.matchPending, (state)=>{
                state.isLoading = true;
            }).addMatcher(endpoint.matchFulfilled, (state)=>{
                state.isLoading = false;
            }).addMatcher(endpoint.matchRejected, (state)=>{
                state.isLoading = false;
            });
        });
    }
});
const { setLoading, setMenuOpen } = uiSlice.actions;
const __TURBOPACK__default__export__ = uiSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/redux/store.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "store": (()=>store)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$redux$2f$slices$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/redux/slices/uiSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$services$2f$navigationApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/services/navigationApi.ts [app-client] (ecmascript)");
;
;
;
const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
    reducer: {
        ui: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$redux$2f$slices$2f$uiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uiSlice"].reducer,
        [__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$services$2f$navigationApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["navigationApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$services$2f$navigationApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["navigationApi"].reducer
    },
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware().concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$services$2f$navigationApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["navigationApi"].middleware)
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/providers.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Providers": (()=>Providers)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$styles$2f$ThemeProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/styles/ThemeProvider.js [app-client] (ecmascript) <export default as ThemeProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$CssBaseline$2f$CssBaseline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/CssBaseline/CssBaseline.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/theme/theme.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$redux$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/redux/store.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"], {
        store: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$redux$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["store"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$styles$2f$ThemeProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__["ThemeProvider"], {
            theme: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$CssBaseline$2f$CssBaseline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/app/providers.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this),
                children
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/providers.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/providers.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_ae3ee6b5._.js.map