import {
  Tree,
  formatFiles,
  installPackagesTask,
  names,
  generateFiles,
  joinPathFragments,
} from '@nrwl/devkit';

interface Schema {
  name: string;
  service: string;
}

export default async function (tree: Tree, schema: Schema) {
  const serviceRoot = `services/${schema.service}/workflows`;

  generateFiles(tree, joinPathFragments(__dirname, './files'), serviceRoot + '/' + schema.name, {
    ...schema,
    tmpl: '',
    ...names(schema.name),
  });
}
