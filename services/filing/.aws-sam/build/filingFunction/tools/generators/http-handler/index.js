"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nrwl/devkit");
const ts_morph_1 = require("ts-morph");
const project = new ts_morph_1.Project({
    compilerOptions: {
        target: ts_morph_1.ScriptTarget.ES2020,
    },
});
async function default_1(tree, schema) {
    if (!(0, devkit_1.getProjects)(tree).has(schema.project)) {
        devkit_1.logger.error(`Project ${schema.project} does not exist.`);
        return;
    }
    const root = `services/${schema.project}`;
    const serviceSource = (0, devkit_1.joinPathFragments)(root, 'src');
    const n = (0, devkit_1.names)(schema.name);
    const serverlessPath = (0, devkit_1.joinPathFragments)(`services/${schema.project}`, 'serverless.ts');
    const serverless = tree.read(serverlessPath)?.toString();
    (0, devkit_1.generateFiles)(tree, (0, devkit_1.joinPathFragments)(__dirname, './files'), serviceSource, {
        ...schema,
        tmpl: '',
        fileName: n.fileName,
    });
    const sourceFile = project.createSourceFile('serverless.ts', serverless);
    const dec = sourceFile.getVariableDeclaration('serverlessConfig');
    const objectLiteralExpression = dec.getInitializerIfKindOrThrow(ts_morph_1.SyntaxKind.ObjectLiteralExpression);
    const funcProp = objectLiteralExpression.getProperty('functions');
    const funcValue = funcProp.getInitializer();
    funcValue.addPropertyAssignment({
        initializer: (writer) => {
            return ts_morph_1.Writers.object({
                handler: `'src/${n.fileName}/${n.fileName}-handler.main'`,
                events: (writer) => {
                    writer.write('[');
                    ts_morph_1.Writers.object({
                        http: ts_morph_1.Writers.object({
                            method: `'${schema.method.toLowerCase()}'`,
                            path: `'${schema.path}'`,
                        }),
                    })(writer);
                    writer.write(']');
                },
            })(writer);
        },
        name: `'${n.fileName}'`,
    });
    sourceFile.formatText({ indentSize: 2 });
    tree.write(serverlessPath, sourceFile.getText());
}
exports.default = default_1;
//# sourceMappingURL=index.js.map