"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const createLogger = () => {
    const timestamp = () => new Date().toISOString();
    return {
        info: (message, ...args) => {
            console.log(`[${timestamp()}] INFO: ${message}`, ...args);
        },
        error: (message, ...args) => {
            console.error(`[${timestamp()}] ERROR: ${message}`, ...args);
        },
        warn: (message, ...args) => {
            console.warn(`[${timestamp()}] WARN: ${message}`, ...args);
        },
        debug: (message, ...args) => {
            if (process.env.NODE_ENV === "development") {
                console.debug(`[${timestamp()}] DEBUG: ${message}`, ...args);
            }
        },
    };
};
exports.logger = createLogger();
//# sourceMappingURL=logger.js.map