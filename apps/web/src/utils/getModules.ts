// utils/getModules.ts
export const getModules = async () => {
    const modules = import.meta.glob("../components/views/modules/*.tsx", {
        eager: true,
    });

    return Object.values(modules).map((mod: any) => mod.moduleInfo);
};