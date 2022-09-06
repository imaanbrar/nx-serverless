"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nrwl/devkit");
const jest_config_1 = require("./jest-config");
const workspace_config_1 = require("./workspace-config");
exports.default = async (host, schema) => {
    const serviceRoot = `services/${schema.name}`;
    const { fileName } = (0, devkit_1.names)(schema.name);
    (0, devkit_1.generateFiles)(host, (0, devkit_1.joinPathFragments)(__dirname, './files'), serviceRoot, {
        ...schema,
        tmpl: '',
        fileName,
    });
    (0, workspace_config_1.addWorkspaceConfig)(host, schema.name, serviceRoot);
    await (0, jest_config_1.addJest)(host, schema.name);
    await (0, devkit_1.formatFiles)(host);
    return () => {
        (0, devkit_1.installPackagesTask)(host);
    };
};
//# sourceMappingURL=index.js.map