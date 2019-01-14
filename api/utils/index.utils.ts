import * as fs from "fs";
import * as path from "path";

export const eagerLoadFiles = (config: {basename: string, dirname: string}) => {
  const { basename, dirname } = config;
  const files: any[] = [];
  fs
    .readdirSync(dirname)
    .filter((file) => (file.indexOf(".") !== 0)
    && (file !== basename)
    && (file.slice(-3) === ".js"))
    .forEach((file) => {
      /* eslint-disable global-require, import/no-dynamic-require */
      const requireFile = require(path.join(dirname, file)).default;
      files.push(requireFile);
    });
  return files;
};
