import type { Component, JSX } from "solid-js";
import type { LinkPreloadOpts, Location, LocationChangeSignal, MatchFilters, Navigator, RouteDataFunc, RouteDefinition, RouterIntegration } from "./types";
declare module "solid-js" {
    namespace JSX {
        interface AnchorHTMLAttributes<T> {
            state?: string;
            noScroll?: boolean;
            replace?: boolean;
            link?: boolean;
        }
    }
}
export type RouterProps = {
    base?: string;
    data?: RouteDataFunc;
    children: JSX.Element;
    out?: object;
    preload?: LinkPreloadOpts["preload"];
    preloadDelay?: LinkPreloadOpts["preloadDelay"];
} & ({
    url?: never;
    source?: RouterIntegration | LocationChangeSignal;
} | {
    source?: never;
    url: string;
});
export declare const Router: (props: RouterProps) => JSX.Element;
export interface RoutesProps {
    base?: string;
    children: JSX.Element;
}
export declare const Routes: (props: RoutesProps) => JSX.Element;
export declare const useRoutes: (routes: RouteDefinition | RouteDefinition[] | Readonly<RouteDefinition[]>, base?: string) => () => JSX.Element;
export type RouteProps<S extends string> = {
    path: S | S[];
    children?: JSX.Element;
    data?: RouteDataFunc;
    matchFilters?: MatchFilters<S>;
} & ({
    element?: never;
    component: Component;
} | {
    component?: never;
    element?: JSX.Element;
    preload?: () => void;
});
export declare const Route: <S extends string>(props: RouteProps<S>) => JSX.Element;
export declare const Outlet: () => JSX.Element;
export interface AnchorProps extends Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, "state">, LinkPreloadOpts {
    href: string;
    replace?: boolean | undefined;
    noScroll?: boolean | undefined;
    state?: unknown | undefined;
    inactiveClass?: string | undefined;
    activeClass?: string | undefined;
    end?: boolean | undefined;
}
export declare function A(props: AnchorProps): JSX.Element;
export { A as Link, A as NavLink, AnchorProps as LinkProps, AnchorProps as NavLinkProps };
export interface NavigateProps {
    href: ((args: {
        navigate: Navigator;
        location: Location;
    }) => string) | string;
    state?: unknown;
}
export declare function Navigate(props: NavigateProps): null;
