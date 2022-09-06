"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addJest = void 0;
const jest_1 = require("@nrwl/jest");
const addJest = async (host, projectName) => {
    await (0, jest_1.jestProjectGenerator)(host, {
        project: projectName,
        setupFile: 'none',
        testEnvironment: 'node',
        skipSerializers: false,
        skipSetupFile: false,
        supportTsx: false,
        babelJest: false,
        skipFormat: true,
    });
};
exports.addJest = addJest;
//# sourceMappingURL=jest-config.js.map