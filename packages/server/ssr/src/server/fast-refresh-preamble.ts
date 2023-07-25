/**
 * We are streaming the entire app frame (root html elem included) via react/solid, so we need to manually inject
 * the fast refresh preamble (since we cannot use `viteServer.transformIndexHtml`).
 *
 * https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#middleware-mode
 */
export const addFastRefreshPreamble = () => {
  return `
  var script = document.createElement("script");
  script.type = "module";
  script.text = ${JSON.stringify(fastRefreshPreamble)};
  document.body.appendChild(script);
`.trim();
};

export const fastRefreshPreamble = `
import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
`.trim();
