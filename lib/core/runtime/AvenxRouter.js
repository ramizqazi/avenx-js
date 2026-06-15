/**
 * AvenxRouter handles hash-based routing for the application.
 * It maps URL hashes to specific Page components.
 */
export class AvenxRouter {
    /**
     * @param {AvenxApp} app - The main application instance.
     * @param {Object<string, string>} routes - A map of hash routes to page names.
     */
    constructor(app, routes = {}) {
        /** @type {AvenxApp} */
        this.app = app;
        /** @type {Object<string, string>} */
        this.routes = routes;

        window.addEventListener('hashchange', () => this.#handleRoute());
    }

    /**
     * Starts the router and handles the initial route.
     */
    start() {
        this.#handleRoute();
    }

    /**
     * Navigates to a specific hash route.
     * @param {string} hash - The target hash (e.g., '#/about').
     */
    navigate(hash) {
        window.location.hash = hash;
    }

    /**
     * Handles the current route by mounting the corresponding page.
     * @private
     */
    #handleRoute() {
        const hash = window.location.hash || '#/';
        const pageName = this.routes[hash] || this.routes['*'];
        
        if (pageName) {
            this.app.mountPage(pageName);
        } else {
            console.warn(`[AvenxRouter] No route defined for hash: ${hash}`);
        }
    }
}
