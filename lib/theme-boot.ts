/**
 * Shared theme constants + the no-flash boot script.
 *
 * Dark mode is an app-only preference: the marketing site always stays light. The app
 * surfaces (AppShell / DashboardFrame and the grading workspace) live under the routes
 * matched by APP_THEME_ROUTE. On those routes the boot script below runs in <head>,
 * before the first paint, and puts `.dark` on <html> when the saved (or OS) preference
 * is dark, so there is no white flash while React loads. `useDocumentTheme` then keeps
 * <html> in sync while an app surface is mounted, and removes `.dark` when you leave.
 *
 * Plain module (no "use client"): the root layout is a server component and needs the
 * real string value.
 */

export const THEME_KEY = "openrubric-theme";
export const THEME_EVENT = "openrubric-theme-change";

/** Routes that render a dark-capable app surface. Keep in step with AppShell users. */
export const APP_THEME_ROUTE = "^/(dashboard/(judge|organizer)|organize|organizer/import|judge/project)(/|$)";

export const THEME_BOOT_SCRIPT = `(function(){try{
if(!new RegExp(${JSON.stringify(APP_THEME_ROUTE)}).test(location.pathname))return;
var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});
if(t!=="dark"&&t!=="light"){t=window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}
if(t==="dark")document.documentElement.classList.add("dark");
}catch(e){}})();`;
