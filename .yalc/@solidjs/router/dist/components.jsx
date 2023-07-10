/*@refresh skip*/
import { children, createMemo, createRoot, mergeProps, on, onCleanup, Show, splitProps } from "solid-js";
import { isServer } from "solid-js/web";
import { pathIntegration, staticIntegration } from "./integration";
import { createBranches, createRouteContext, createRouterContext, getRouteMatches, RouteContextObj, RouterContextObj, useHref, useLocation, useNavigate, useResolvedPath, useRoute, useRouter } from "./routing";
import { joinPaths, normalizePath, createMemoObject, composeEventHandlers } from "./utils";
export const Router = (props) => {
    const { source, url, base, data, out, preload, preloadDelay } = props;
    const integration = source || (isServer ? staticIntegration({ value: url || "" }) : pathIntegration());
    const routerState = createRouterContext(integration, base, data, out, preload, preloadDelay);
    return (<RouterContextObj.Provider value={routerState}>{props.children}</RouterContextObj.Provider>);
};
export const Routes = (props) => {
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
        router.out.matches.push(matches().map(({ route, path, params }) => ({
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
            }
            else {
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
    return (<Show when={routeStates() && root} keyed>
      {route => <RouteContextObj.Provider value={route}>{route.outlet()}</RouteContextObj.Provider>}
    </Show>);
};
export const useRoutes = (routes, base) => {
    return () => <Routes base={base}>{routes}</Routes>;
};
export const Route = (props) => {
    const childRoutes = children(() => props.children);
    return mergeProps(props, {
        get children() {
            return childRoutes();
        }
    });
};
export const Outlet = () => {
    const route = useRoute();
    return (<Show when={route.child} keyed>
      {child => <RouteContextObj.Provider value={child}>{child.outlet()}</RouteContextObj.Provider>}
    </Show>);
};
export function A(props) {
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
    const [, rest] = splitProps(props, [
        "href",
        "state",
        "class",
        "activeClass",
        "inactiveClass",
        "end",
        "preload",
        "preloadDelay",
        "onMouseEnter",
        "onFocus",
        "onMouseLeave",
        "onTouchStart"
    ]);
    const to = useResolvedPath(() => props.href);
    const href = useHref(to);
    const location = useLocation();
    const isActive = createMemo(() => {
        const to_ = to();
        if (to_ === undefined)
            return false;
        const path = normalizePath(to_.split(/[?#]/, 1)[0]).toLowerCase();
        const loc = normalizePath(location.pathname).toLowerCase();
        return props.end ? path === loc : loc.startsWith(path);
    });
    let preloadTimeout = null;
    const tryPreload = () => {
        if (!props.preload || preloadTimeout)
            return;
        preloadTimeout = setTimeout(() => {
            preloadTimeout = null;
            preloadFn(props.href);
        }, props.preloadDelay);
    };
    const handleFocus = (e) => {
        tryPreload();
    };
    const handleEnter = () => {
        tryPreload();
    };
    const handleTouchStart = () => {
        if (!props.preload || preloadTimeout)
            return;
        // Never delay for touch intention
        preloadFn(props.href);
    };
    const handleLeave = (e) => {
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
    return (<a link {...rest} href={href() || props.href} state={JSON.stringify(props.state)} classList={{
            ...(props.class && { [props.class]: true }),
            [props.inactiveClass]: !isActive(),
            [props.activeClass]: isActive(),
            ...rest.classList
        }} aria-current={isActive() ? "page" : undefined} onFocus={composeEventHandlers([props.onFocus, handleFocus])} onMouseEnter={composeEventHandlers([props.onMouseEnter, handleEnter])} onMouseLeave={composeEventHandlers([props.onMouseLeave, handleLeave])} onTouchStart={composeEventHandlers([props.onTouchStart, handleTouchStart])}/>);
}
// deprecated alias exports
export { A as Link, A as NavLink };
export function Navigate(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const { href, state } = props;
    const path = typeof href === "function" ? href({ navigate, location }) : href;
    navigate(path, { replace: true, state });
    return null;
}
