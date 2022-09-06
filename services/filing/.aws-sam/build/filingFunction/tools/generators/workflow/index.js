"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nrwl/devkit");
async function default_1(tree, schema) {
    const serviceRoot = `services/${schema.service}/workflows`;
    (0, devkit_1.generateFiles)(tree, (0, devkit_1.joinPathFragments)(__dirname, './files'), serviceRoot + '/' + schema.name, {
        ...schema,
        tmpl: '',
        ...(0, devkit_1.names)(schema.name),
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map