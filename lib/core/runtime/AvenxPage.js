import { AvenxComponent } from './AvenxComponent.js';

/**
 * AvenxPage is a specialized component that can host child components.
 * It automatically mounts child components defined in its template via [data-avenx-comp].
 */
export class AvenxPage extends AvenxComponent {
    /** @type {Map<string, typeof AvenxComponent>} @private */
    #componentRegistry;
    /** @type {AvenxComponent[]} @private */
    #childComponents = [];

    /**
     * @param {Object} initialState - Initial state.
     * @param {Object} computed - Computed properties.
     * @param {Object} bridges - Shared bridges.
     * @param {string} template - HTML template.
     * @param {Object} methods - Component methods.
     * @param {Map<string, typeof AvenxComponent>} componentRegistry - Registry of available components.
     */
    constructor(initialState = {}, computed = {}, bridges = {}, template = '', methods = {}, componentRegistry = new Map()) {
        super(initialState, computed, bridges, template, methods);
        this.#componentRegistry = componentRegistry;
    }

    /**
     * Updates the page and then mounts/updates child components.
     */
    update() {
        super.update();
        this.#mountChildComponents();
    }

    /**
     * Finds all mount points for child components and initializes them.
     * @private
     */
    #mountChildComponents() {
        const root = this._getElement();
        if (!root) return;

        const mountPoints = root.querySelectorAll('[data-avenx-comp]');
        mountPoints.forEach(el => {
            const compName = el.getAttribute('data-avenx-comp');
            const CompClass = this.#componentRegistry.get(compName);
            
            if (CompClass) {
                const compInstance = new CompClass(this._getBridges());
                compInstance.mount(el);
                this.#childComponents.push(compInstance);
            } else {
                console.warn(`[AvenxPage] Component '${compName}' not found in registry.`);
            }
        });
    }
}
