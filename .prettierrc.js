module.exports = {
    printWidth: 100,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    arrowParens: "avoid",
    trailingComma: "all",
    bracketSpacing: true,
    overrides: [
        {
            files: ["*.yaml", "*.yml"],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
