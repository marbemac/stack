import { isServer, delegateEvents, createComponent as createComponent$1, spread, mergeProps as mergeProps$1, template } from 'solid-js/web';
import { createSignal, onCleanup, getOwner, runWithOwner, createMemo, createContext, useContext, untrack, createRenderEffect, createComponent, on, startTransition, resetErrorBoundaries, children, createRoot, Show, mergeProps, splitProps } from 'solid-js';

function bindEvent(target, type, handler) {
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
}
function intercept([value, setValue], get, set) {
  return [get ? () => get(value()) : value, set ? v => setValue(set(v)) : setValue];
}
function querySelector(selector) {
  // Guard against selector being an invalid CSS selector
  try {
    return document.querySelector(selector);
  } catch (e) {
    return null;
  }
}
function scrollToHash(hash, fallbackTop) {
  const el = querySelector(`#${hash}`);
  if (el) {
    el.scrollIntoView();
  } else if (fallbackTop) {
    window.scrollTo(0, 0);
  }
}
function createMemoryHistory() {
  const entries = ["/"];
  let index = 0;
  const listeners = [];
  const go = n => {
    // https://github.com/remix-run/react-router/blob/682810ca929d0e3c64a76f8d6e465196b7a2ac58/packages/router/history.ts#L245
    index = Math.max(0, Math.min(index + n, entries.length - 1));
    const value = entries[index];
    listeners.forEach(listener => listener(value));
  };
  return {
    get: () => entries[index],
    set: ({
      value,
      scroll,
      replace
    }) => {
      if (replace) {
        entries[index] = value;
      } else {
        entries.splice(index + 1, entries.length - index, value);
        index++;
      }
      if (scroll) {
        scrollToHash(value.split("#")[1] || "", true);
      }
    },
    back: () => {
      go(-1);
    },
    forward: () => {
      go(1);
    },
    go,
    listen: listener => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
    }
  };
}
function createIntegration(get, set, init, utils) {
  let ignore = false;
  const wrap = value => typeof value === "string" ? {
    value
  } : value;
  const signal = intercept(createSignal(wrap(get()), {
    equals: (a, b) => a.value === b.value
  }), undefined, next => {
    !ignore && set(next);
    return next;
  });
  init && onCleanup(init((value = get()) => {
    ignore = true;
    signal[1](wrap(value));
    ignore = false;
  }));
  return {
    signal,
    utils
  };
}
function normalizeIntegration(integration) {
  if (!integration) {
    return {
      signal: createSignal({
        value: ""
      })
    };
  } else if (Array.isArray(integration)) {
    return {
      signal: integration
    };
  }
  return integration;
}
function staticIntegration(obj) {
  return {
    signal: [() => obj, next => Object.assign(obj, next)]
  };
}
function pathIntegration() {
  return createIntegration(() => ({
    value: window.location.pathname + window.location.search + window.location.hash,
    state: history.state
  }), ({
    value,
    replace,
    scroll,
    state
  }) => {
    if (replace) {
      window.history.replaceState(state, "", value);
    } else {
      window.history.pushState(state, "", value);
    }
    scrollToHash(window.location.hash.slice(1), scroll);
  }, notify => bindEvent(window, "popstate", () => notify()), {
    go: delta => window.history.go(delta)
  });
}
function hashIntegration() {
  return createIntegration(() => window.location.hash.slice(1), ({
    value,
    replace,
    scroll,
    state
  }) => {
    if (replace) {
      window.history.replaceState(state, "", "#" + value);
    } else {
      window.location.hash = value;
    }
    const hashIndex = value.indexOf("#");
    const hash = hashIndex >= 0 ? value.slice(hashIndex + 1) : "";
    scrollToHash(hash, scroll);
  }, notify => bindEvent(window, "hashchange", () => notify()), {
    go: delta => window.history.go(delta),
    renderPath: path => `#${path}`,
    parsePath: str => {
      const to = str.replace(/^.*?#/, "");
      // Hash-only hrefs like `#foo` from plain anchors will come in as `/#foo` whereas a link to
      // `/foo` will be `/#/foo`. Check if the to starts with a `/` and if not append it as a hash
      // to the current path so we can handle these in-page anchors correctly.
      if (!to.startsWith("/")) {
        const [, path = "/"] = window.location.hash.split("#", 2);
        return `${path}#${to}`;
      }
      return to;
    }
  });
}
function memoryIntegration() {
  const memoryHistory = createMemoryHistory();
  return createIntegration(memoryHistory.get, memoryHistory.set, memoryHistory.listen, {
    go: memoryHistory.go
  });
}

function createBeforeLeave() {
  let listeners = new Set();
  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
  let ignore = false;
  function confirm(to, options) {
    if (ignore) return !(ignore = false);
    const e = {
      to,
      options,
      defaultPrevented: false,
      preventDefault: () => e.defaultPrevented = true
    };
    for (const l of listeners) l.listener({
      ...e,
      from: l.location,
      retry: force => {
        force && (ignore = true);
        l.navigate(to, options);
      }
    });
    return !e.defaultPrevented;
  }
  return {
    subscribe,
    confirm
  };
}

const hasSchemeRegex = /^(?:[a-z0-9]+:)?\/\//i;
const trimPathRegex = /^\/+|(\/)\/+$/g;
function normalizePath(path, omitSlash = false) {
  const s = path.replace(trimPathRegex, "$1");
  return s ? omitSlash || /^[?#]/.test(s) ? s : "/" + s : "";
}
function resolvePath(base, path, from) {
  if (hasSchemeRegex.test(path)) {
    return undefined;
  }
  const basePath = normalizePath(base);
  const fromPath = from && normalizePath(from);
  let result = "";
  if (!fromPath || path.startsWith("/")) {
    result = basePath;
  } else if (fromPath.toLowerCase().indexOf(basePath.toLowerCase()) !== 0) {
    result = basePath + fromPath;
  } else {
    result = fromPath;
  }
  return (result || "/") + normalizePath(path, !result);
}
function invariant(value, message) {
  if (value == null) {
    throw new Error(message);
  }
  return value;
}
function joinPaths(from, to) {
  return normalizePath(from).replace(/\/*(\*.*)?$/g, "") + normalizePath(to);
}
function extractSearchParams(url) {
  const params = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}
function createMatcher(path, partial, matchFilters) {
  const [pattern, splat] = path.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  const len = segments.length;
  return location => {
    const locSegments = location.split("/").filter(Boolean);
    const lenDiff = locSegments.length - len;
    if (lenDiff < 0 || lenDiff > 0 && splat === undefined && !partial) {
      return null;
    }
    const match = {
      path: len ? "" : "/",
      params: {}
    };
    const matchFilter = s => matchFilters === undefined ? undefined : matchFilters[s];
    for (let i = 0; i < len; i++) {
      const segment = segments[i];
      const locSegment = locSegments[i];
      const dynamic = segment[0] === ":";
      const key = dynamic ? segment.slice(1) : segment;
      if (dynamic && matchSegment(locSegment, matchFilter(key))) {
        match.params[key] = locSegment;
      } else if (dynamic || !matchSegment(locSegment, segment)) {
        return null;
      }
      match.path += `/${locSegment}`;
    }
    if (splat) {
      const remainder = lenDiff ? locSegments.slice(-lenDiff).join("/") : "";
      if (matchSegment(remainder, matchFilter(splat))) {
        match.params[splat] = remainder;
      } else {
        return null;
      }
    }
    return match;
  };
}
function matchSegment(input, filter) {
  const isEqual = s => s.localeCompare(input, undefined, {
    sensitivity: "base"
  }) === 0;
  if (filter === undefined) {
    return true;
  } else if (typeof filter === "string") {
    return isEqual(filter);
  } else if (typeof filter === "function") {
    return filter(input);
  } else if (Array.isArray(filter)) {
    return filter.some(isEqual);
  } else if (filter instanceof RegExp) {
    return filter.test(input);
  }
  return false;
}
function scoreRoute(route) {
  const [pattern, splat] = route.pattern.split("/*", 2);
  const segments = pattern.split("/").filter(Boolean);
  return segments.reduce((score, segment) => score + (segment.startsWith(":") ? 2 : 3), segments.length - (splat === undefined ? 0 : 1));
}
function createMemoObject(fn) {
  const map = new Map();
  const owner = getOwner();
  return new Proxy({}, {
    get(_, property) {
      if (!map.has(property)) {
        runWithOwner(owner, () => map.set(property, createMemo(() => fn()[property])));
      }
      return map.get(property)();
    },
    getOwnPropertyDescriptor() {
      return {
        enumerable: true,
        configurable: true
      };
    },
    ownKeys() {
      return Reflect.ownKeys(fn());
    }
  });
}
function mergeSearchString(search, params) {
  const merged = new URLSearchParams(search);
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "") {
      merged.delete(key);
    } else {
      merged.set(key, String(value));
    }
  });
  const s = merged.toString();
  return s ? `?${s}` : "";
}
function expandOptionals(pattern) {
  let match = /(\/?\:[^\/]+)\?/.exec(pattern);
  if (!match) return [pattern];
  let prefix = pattern.slice(0, match.index);
  let suffix = pattern.slice(match.index + match[0].length);
  const prefixes = [prefix, prefix += match[1]];

  // This section handles adjacent optional params. We don't actually want all permuations since
  // that will lead to equivalent routes which have the same number of params. For example
  // `/:a?/:b?/:c`? only has the unique expansion: `/`, `/:a`, `/:a/:b`, `/:a/:b/:c` and we can
  // discard `/:b`, `/:c`, `/:b/:c` by building them up in order and not recursing. This also helps
  // ensure predictability where earlier params have precidence.
  while (match = /^(\/\:[^\/]+)\?/.exec(suffix)) {
    prefixes.push(prefix += match[1]);
    suffix = suffix.slice(match[0].length);
  }
  return expandOptionals(suffix).reduce((results, expansion) => [...results, ...prefixes.map(p => p + expansion)], []);
}
function isFunction(value) {
  return typeof value === "function";
}

/** Call a JSX.EventHandlerUnion with the event. */
function callHandler(event, handler) {
  if (handler) {
    if (isFunction(handler)) {
      handler(event);
    } else {
      handler[0](handler[1], event);
    }
  }
  return event?.defaultPrevented;
}

/**
 * Creates a new event handler.
 * This new handler calls all given handlers in the order given, with the same event.
 */
function composeEventHandlers(handlers) {
  return event => {
    for (const handler of handlers) {
      callHandler(event, handler);
    }
  };
}

const MAX_REDIRECTS = 100;
const RouterContextObj = createContext();
const RouteContextObj = createContext();
const useRouter = () => invariant(useContext(RouterContextObj), "Make sure your app is wrapped in a <Router />");
let TempRoute;
const useRoute = () => TempRoute || useContext(RouteContextObj) || useRouter().base;
const useResolvedPath = path => {
  const route = useRoute();
  return createMemo(() => route.resolvePath(path()));
};
const useHref = to => {
  const router = useRouter();
  return createMemo(() => {
    const to_ = to();
    return to_ !== undefined ? router.renderPath(to_) : to_;
  });
};
const useNavigate = () => useRouter().navigatorFactory();
const useLocation = () => useRouter().location;
const useIsRouting = () => useRouter().isRouting;
const useMatch = (path, matchFilters) => {
  const location = useLocation();
  const matchers = createMemo(() => expandOptionals(path()).map(path => createMatcher(path, undefined, matchFilters)));
  return createMemo(() => {
    for (const matcher of matchers()) {
      const match = matcher(location.pathname);
      if (match) return match;
    }
  });
};
const useParams = () => useRoute().params;
const useRouteData = () => useRoute().data;
const useSearchParams = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setSearchParams = (params, options) => {
    const searchString = untrack(() => mergeSearchString(location.search, params));
    navigate(location.pathname + searchString + location.hash, {
      scroll: false,
      resolve: false,
      ...options
    });
  };
  return [location.query, setSearchParams];
};
const useBeforeLeave = listener => {
  const s = useRouter().beforeLeave.subscribe({
    listener,
    location: useLocation(),
    navigate: useNavigate()
  });
  onCleanup(s);
};
function createRoutes(routeDef, base = "", fallback) {
  const {
    component,
    data,
    children
  } = routeDef;
  const isLeaf = !children || Array.isArray(children) && !children.length;
  const shared = {
    key: routeDef,
    element: component ? () => createComponent(component, {}) : () => {
      const {
        element
      } = routeDef;
      return element === undefined && fallback ? createComponent(fallback, {}) : element;
    },
    preload: routeDef.component ? component.preload : routeDef.preload,
    data
  };
  return asArray(routeDef.path).reduce((acc, path) => {
    for (const originalPath of expandOptionals(path)) {
      const path = joinPaths(base, originalPath);
      const pattern = isLeaf ? path : path.split("/*", 1)[0];
      acc.push({
        ...shared,
        originalPath,
        pattern,
        matcher: createMatcher(pattern, !isLeaf, routeDef.matchFilters)
      });
    }
    return acc;
  }, []);
}
function createBranch(routes, index = 0) {
  return {
    routes,
    score: scoreRoute(routes[routes.length - 1]) * 10000 - index,
    matcher(location) {
      const matches = [];
      for (let i = routes.length - 1; i >= 0; i--) {
        const route = routes[i];
        const match = route.matcher(location);
        if (!match) {
          return null;
        }
        matches.unshift({
          ...match,
          route
        });
      }
      return matches;
    }
  };
}
function asArray(value) {
  return Array.isArray(value) ? value : [value];
}
function createBranches(routeDef, base = "", fallback, stack = [], branches = []) {
  const routeDefs = asArray(routeDef);
  for (let i = 0, len = routeDefs.length; i < len; i++) {
    const def = routeDefs[i];
    if (def && typeof def === "object" && def.hasOwnProperty("path")) {
      const routes = createRoutes(def, base, fallback);
      for (const route of routes) {
        stack.push(route);
        const isEmptyArray = Array.isArray(def.children) && def.children.length === 0;
        if (def.children && !isEmptyArray) {
          createBranches(def.children, route.pattern, fallback, stack, branches);
        } else {
          const branch = createBranch([...stack], branches.length);
          branches.push(branch);
        }
        stack.pop();
      }
    }
  }

  // Stack will be empty on final return
  return stack.length ? branches : branches.sort((a, b) => b.score - a.score);
}
function getRouteMatches(branches, location) {
  for (let i = 0, len = branches.length; i < len; i++) {
    const match = branches[i].matcher(location);
    if (match) {
      return match;
    }
  }
  return [];
}
function createLocation(path, state) {
  const origin = new URL("http://sar");
  const url = createMemo(prev => {
    const path_ = path();
    try {
      return new URL(path_, origin);
    } catch (err) {
      console.error(`Invalid path ${path_}`);
      return prev;
    }
  }, origin, {
    equals: (a, b) => a.href === b.href
  });
  const pathname = createMemo(() => url().pathname);
  const search = createMemo(() => url().search, true);
  const hash = createMemo(() => url().hash);
  const key = createMemo(() => "");
  return {
    get pathname() {
      return pathname();
    },
    get search() {
      return search();
    },
    get hash() {
      return hash();
    },
    get state() {
      return state();
    },
    get key() {
      return key();
    },
    query: createMemoObject(on(search, () => extractSearchParams(url())))
  };
}
function createRouterContext(integration, base = "", data, out, preload, preloadDelay) {
  const {
    signal: [source, setSource],
    utils = {}
  } = normalizeIntegration(integration);
  const parsePath = utils.parsePath || (p => p);
  const renderPath = utils.renderPath || (p => p);
  const beforeLeave = utils.beforeLeave || createBeforeLeave();
  const basePath = resolvePath("", base);
  const output = isServer && out ? Object.assign(out, {
    matches: [],
    url: undefined
  }) : undefined;
  if (basePath === undefined) {
    throw new Error(`${basePath} is not a valid base path`);
  } else if (basePath && !source().value) {
    setSource({
      value: basePath,
      replace: true,
      scroll: false
    });
  }
  const [isRouting, setIsRouting] = createSignal(false);
  const start = async callback => {
    setIsRouting(true);
    try {
      await startTransition(callback);
    } finally {
      setIsRouting(false);
    }
  };
  const [reference, setReference] = createSignal(source().value);
  const [state, setState] = createSignal(source().state);
  const location = createLocation(reference, state);
  const referrers = [];
  const baseRoute = {
    pattern: basePath,
    params: {},
    path: () => basePath,
    outlet: () => null,
    resolvePath(to) {
      return resolvePath(basePath, to);
    }
  };
  if (data) {
    try {
      TempRoute = baseRoute;
      baseRoute.data = data({
        data: undefined,
        params: {},
        location,
        navigate: navigatorFactory(baseRoute)
      });
    } finally {
      TempRoute = undefined;
    }
  }
  function navigateFromRoute(route, to, options) {
    // Untrack in case someone navigates in an effect - don't want to track `reference` or route paths
    untrack(() => {
      if (typeof to === "number") {
        if (!to) ; else if (utils.go) {
          beforeLeave.confirm(to, options) && utils.go(to);
        } else {
          console.warn("Router integration does not support relative routing");
        }
        return;
      }
      const {
        replace,
        resolve,
        scroll,
        state: nextState
      } = {
        replace: false,
        resolve: true,
        scroll: true,
        ...options
      };
      const resolvedTo = resolve ? route.resolvePath(to) : resolvePath("", to);
      if (resolvedTo === undefined) {
        throw new Error(`Path '${to}' is not a routable path`);
      } else if (referrers.length >= MAX_REDIRECTS) {
        throw new Error("Too many redirects");
      }
      const current = reference();
      if (resolvedTo !== current || nextState !== state()) {
        if (isServer) {
          if (output) {
            output.url = resolvedTo;
          }
          setSource({
            value: resolvedTo,
            replace,
            scroll,
            state: nextState
          });
        } else if (beforeLeave.confirm(resolvedTo, options)) {
          const len = referrers.push({
            value: current,
            replace,
            scroll,
            state: state()
          });
          start(() => {
            setReference(resolvedTo);
            setState(nextState);
            resetErrorBoundaries();
          }).then(() => {
            if (referrers.length === len) {
              navigateEnd({
                value: resolvedTo,
                state: nextState
              });
            }
          });
        }
      }
    });
  }
  function navigatorFactory(route) {
    // Workaround for vite issue (https://github.com/vitejs/vite/issues/3803)
    route = route || useContext(RouteContextObj) || baseRoute;
    return (to, options) => navigateFromRoute(route, to, options);
  }
  function navigateEnd(next) {
    const first = referrers[0];
    if (first) {
      if (next.value !== first.value || next.state !== first.state) {
        setSource({
          ...next,
          replace: first.replace,
          scroll: first.scroll
        });
      }
      referrers.length = 0;
    }
  }
  createRenderEffect(() => {
    const {
      value,
      state
    } = source();
    // Untrack this whole block so `start` doesn't cause Solid's Listener to be preserved
    untrack(() => {
      if (value !== reference()) {
        start(() => {
          setReference(value);
          setState(state);
        });
      }
    });
  });
  if (!isServer) {
    function handleAnchorClick(evt) {
      if (evt.defaultPrevented || evt.button !== 0 || evt.metaKey || evt.altKey || evt.ctrlKey || evt.shiftKey) return;
      const a = evt.composedPath().find(el => el instanceof Node && el.nodeName.toUpperCase() === "A");
      if (!a || !a.hasAttribute("link")) return;
      const href = a.href;
      if (a.target || !href && !a.hasAttribute("state")) return;
      const rel = (a.getAttribute("rel") || "").split(/\s+/);
      if (a.hasAttribute("download") || rel && rel.includes("external")) return;
      const url = new URL(href);
      if (url.origin !== window.location.origin || basePath && url.pathname && !url.pathname.toLowerCase().startsWith(basePath.toLowerCase())) return;
      const to = parsePath(url.pathname + url.search + url.hash);
      const state = a.getAttribute("state");
      evt.preventDefault();
      navigateFromRoute(baseRoute, to, {
        resolve: false,
        replace: a.hasAttribute("replace"),
        scroll: !a.hasAttribute("noscroll"),
        state: state && JSON.parse(state)
      });
    }

    // ensure delegated events run first
    delegateEvents(["click"]);
    document.addEventListener("click", handleAnchorClick);
    onCleanup(() => document.removeEventListener("click", handleAnchorClick));
  }
  const preloadFactory = () => {
    const route = useRoute();
    const branches = route.branches?.();
    return path => {
      if (!branches) return;
      const matches = getRouteMatches(branches, path);
      if (!matches?.length) return;
      for (const match of matches) {
        const {
          params,
          route,
          path
        } = match;

        // preload assets
        if (route.preload) route.preload();

        // preload data
        if (route.data) {
          try {
            const routeContext = {
              data: route.data,
              pattern: route.pattern,
              params,
              path: () => path,
              outlet: route.element,
              resolvePath(to) {
                return resolvePath(baseRoute.path(), to, path);
              }
            };
            route.data({
              data: undefined,
              params,
              location,
              navigate: navigatorFactory(routeContext)
            });
          } finally {}
        }
      }
    };
  };
  return {
    base: baseRoute,
    out: output,
    location,
    isRouting,
    renderPath,
    parsePath,
    navigatorFactory,
    beforeLeave,
    preloadFactory,
    preload,
    preloadDelay
  };
}
function createRouteContext(router, parent, child, match, params, branches) {
  const {
    base,
    location,
    navigatorFactory
  } = router;
  const {
    pattern,
    element: outlet,
    preload,
    data
  } = match().route;
  const path = createMemo(() => match().path);
  preload && preload();
  const route = {
    parent,
    pattern,
    get child() {
      return child();
    },
    path,
    params,
    data: parent.data,
    outlet,
    branches,
    resolvePath(to) {
      return resolvePath(base.path(), to, path());
    }
  };
  if (data) {
    try {
      TempRoute = route;
      route.data = data({
        data: parent.data,
        params,
        location,
        navigate: navigatorFactory(route)
      });
    } finally {
      TempRoute = undefined;
    }
  }
  return route;
}

const _tmpl$ = /*#__PURE__*/template(`<a link></a>`, 2);
const Router = props => {
  const {
    source,
    url,
    base,
    data,
    out,
    preload,
    preloadDelay
  } = props;
  const integration = source || (isServer ? staticIntegration({
    value: url || ""
  }) : pathIntegration());
  const routerState = createRouterContext(integration, base, data, out, preload, preloadDelay);
  return createComponent$1(RouterContextObj.Provider, {
    value: routerState,
    get children() {
      return props.children;
    }
  });
};
const Routes = props => {
  const router = useRouter();
  const parentRoute = useRoute();
  const routeDefs = children(() => props.children);
  const branches = createMemo(() => createBranches(routeDefs(), joinPaths(parentRoute.pattern, props.base || ""), Outlet));
  const matches = createMemo(() => getRouteMatches(branches(), router.location.pathname));
  const params = createMemoObject(() => {
    const m = matches();
    const params = {};
    for (let i = 0; i < m.length; i++) {
      Object.assign(params, m[i].params);
    }
    return params;
  });
  if (router.out) {
    router.out.matches.push(matches().map(({
      route,
      path,
      params
    }) => ({
      originalPath: route.originalPath,
      pattern: route.pattern,
      path,
      params
    })));
  }
  const disposers = [];
  let root;
  const routeStates = createMemo(on(matches, (nextMatches, prevMatches, prev) => {
    let equal = prevMatches && nextMatches.length === prevMatches.length;
    const next = [];
    for (let i = 0, len = nextMatches.length; i < len; i++) {
      const prevMatch = prevMatches && prevMatches[i];
      const nextMatch = nextMatches[i];
      if (prev && prevMatch && nextMatch.route.key === prevMatch.route.key) {
        next[i] = prev[i];
      } else {
        equal = false;
        if (disposers[i]) {
          disposers[i]();
        }
        createRoot(dispose => {
          disposers[i] = dispose;
          next[i] = createRouteContext(router, next[i - 1] || parentRoute, () => routeStates()[i + 1], () => matches()[i], params, branches);
        });
      }
    }
    disposers.splice(nextMatches.length).forEach(dispose => dispose());
    if (prev && equal) {
      return prev;
    }
    root = next[0];
    return next;
  }));
  return createComponent$1(Show, {
    get when() {
      return routeStates() && root;
    },
    keyed: true,
    children: route => createComponent$1(RouteContextObj.Provider, {
      value: route,
      get children() {
        return route.outlet();
      }
    })
  });
};
const useRoutes = (routes, base) => {
  return () => createComponent$1(Routes, {
    base: base,
    children: routes
  });
};
const Route = props => {
  const childRoutes = children(() => props.children);
  return mergeProps(props, {
    get children() {
      return childRoutes();
    }
  });
};
const Outlet = () => {
  const route = useRoute();
  return createComponent$1(Show, {
    get when() {
      return route.child;
    },
    keyed: true,
    children: child => createComponent$1(RouteContextObj.Provider, {
      value: child,
      get children() {
        return child.outlet();
      }
    })
  });
};
function A(props) {
  const router = useRouter();
  const preloadFn = router.preloadFactory();
  const defaultPreload = router.preload ?? false;
  const defaultPreloadDelay = router.preloadDelay ?? 0;
  props = mergeProps({
    inactiveClass: "inactive",
    activeClass: "active",
    preload: defaultPreload,
    preloadDelay: defaultPreloadDelay
  }, props);
  const [, rest] = splitProps(props, ["href", "state", "class", "activeClass", "inactiveClass", "end", "preload", "preloadDelay", "onMouseEnter", "onFocus", "onMouseLeave", "onTouchStart"]);
  const to = useResolvedPath(() => props.href);
  const href = useHref(to);
  const location = useLocation();
  const isActive = createMemo(() => {
    const to_ = to();
    if (to_ === undefined) return false;
    const path = normalizePath(to_.split(/[?#]/, 1)[0]).toLowerCase();
    const loc = normalizePath(location.pathname).toLowerCase();
    return props.end ? path === loc : loc.startsWith(path);
  });
  let preloadTimeout = null;
  const tryPreload = () => {
    if (!props.preload || preloadTimeout) return;
    preloadTimeout = setTimeout(() => {
      preloadTimeout = null;
      preloadFn(props.href);
    }, props.preloadDelay);
  };
  const handleFocus = e => {
    tryPreload();
  };
  const handleEnter = () => {
    tryPreload();
  };
  const handleTouchStart = () => {
    if (!props.preload || preloadTimeout) return;
    // Never delay for touch intention
    preloadFn(props.href);
  };
  const handleLeave = e => {
    if (preloadTimeout) {
      clearTimeout(preloadTimeout);
      preloadTimeout = null;
    }
  };
  onCleanup(() => {
    if (preloadTimeout) {
      clearTimeout(preloadTimeout);
    }
  });
  return (() => {
    const _el$ = _tmpl$.cloneNode(true);
    spread(_el$, mergeProps$1(rest, {
      get href() {
        return href() || props.href;
      },
      get state() {
        return JSON.stringify(props.state);
      },
      get classList() {
        return {
          ...(props.class && {
            [props.class]: true
          }),
          [props.inactiveClass]: !isActive(),
          [props.activeClass]: isActive(),
          ...rest.classList
        };
      },
      get ["aria-current"]() {
        return isActive() ? "page" : undefined;
      },
      get onFocus() {
        return composeEventHandlers([props.onFocus, handleFocus]);
      },
      get onMouseEnter() {
        return composeEventHandlers([props.onMouseEnter, handleEnter]);
      },
      get onMouseLeave() {
        return composeEventHandlers([props.onMouseLeave, handleLeave]);
      },
      get onTouchStart() {
        return composeEventHandlers([props.onTouchStart, handleTouchStart]);
      }
    }), false, false);
    return _el$;
  })();
}
function Navigate(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    href,
    state
  } = props;
  const path = typeof href === "function" ? href({
    navigate,
    location
  }) : href;
  navigate(path, {
    replace: true,
    state
  });
  return null;
}

export { A, A as Link, A as NavLink, Navigate, Outlet, Route, Router, Routes, mergeSearchString as _mergeSearchString, createBeforeLeave, createIntegration, createMemoryHistory, hashIntegration, memoryIntegration, normalizeIntegration, pathIntegration, staticIntegration, useBeforeLeave, useHref, useIsRouting, useLocation, useMatch, useNavigate, useParams, useResolvedPath, useRouteData, useRoutes, useSearchParams };
