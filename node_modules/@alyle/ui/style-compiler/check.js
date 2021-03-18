"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const pkgFile = fs_1.readFileSync('package.json');
if (!pkgFile) {
    throw new Error(`This folder does not contain a package.json file.`);
}
const pkg = JSON.parse(pkgFile.toString('utf8'));
if (!(pkg.dependencies.typescript || pkg.devDependencies.typescript)) {
    throw new Error(`This project requires having typescript installed`);
}
//# sourceMappingURL=check.js.map