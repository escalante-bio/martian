"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    test: {
        environment: 'node',
        include: ['test/**/*.spec.ts'],
        globals: true,
        testTimeout: 10000
    }
});
//# sourceMappingURL=vitest.config.js.map