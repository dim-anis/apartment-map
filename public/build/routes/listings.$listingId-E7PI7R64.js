import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-PMI65YMG.js";
import {
  createHotContext
} from "/build/_shared/chunk-SB4JKY4J.js";
import "/build/_shared/chunk-4JLKO6E3.js";
import "/build/_shared/chunk-2Q7FBYOG.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/listings.$listingId.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/listings.$listingId.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/listings.$listingId.tsx"
  );
  import.meta.hot.lastModified = "1723532104340.8296";
}
function Listing() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: "Listing" }, void 0, false, {
    fileName: "app/routes/listings.$listingId.tsx",
    lineNumber: 22,
    columnNumber: 10
  }, this);
}
_c = Listing;
var _c;
$RefreshReg$(_c, "Listing");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  Listing as default
};
//# sourceMappingURL=/build/routes/listings.$listingId-E7PI7R64.js.map
