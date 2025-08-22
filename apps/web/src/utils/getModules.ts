// utils/getModules.ts

/**
 * Dynamically imports all module information from files located in
 * `../components/views/modules/`. Each module file is expected to export
 * a `moduleInfo` object.
 *
 * This function uses Vite's `import.meta.glob` feature for eager loading
 * of modules at build time.
 *
 * @returns A promise that resolves to an array of `moduleInfo` objects.
 */
export const getModules = async () => {
  // Use import.meta.glob to eagerly load all .tsx files in the specified directory.
  // The 'eager: true' option means the modules are imported synchronously at build time.
  const modules = import.meta.glob("../components/views/modules/*.tsx", { eager: true });
  // Extract the 'moduleInfo' export from each imported module and return them as an array.
  return Object.values(modules).map((mod: any) => mod.moduleInfo);
};