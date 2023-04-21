import * as path from "path";

export async function loadModule(moduleName: string) {
  const myModule = await import(
    path.isAbsolute(moduleName) ? moduleName : `./${moduleName}`
  );
  const defaultModuleFn = myModule.default as (prismaClient: any) => void;
  return defaultModuleFn;
}
