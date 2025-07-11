// ESLint configuration for Court Coach
module.exports = [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "script",
            globals: {
                // Browser globals
                "window": "readonly",
                "document": "readonly",
                "console": "readonly",
                "localStorage": "readonly",
                "navigator": "readonly",
                "fetch": "readonly",
                "setTimeout": "readonly",
                "setInterval": "readonly",
                "clearTimeout": "readonly",
                "clearInterval": "readonly",
                "requestAnimationFrame": "readonly",
                "ResizeObserver": "readonly",
                
                // Konva.js
                "Konva": "readonly",
                
                // Service Worker specific
                "self": "readonly",
                "clients": "readonly",
                "caches": "readonly",
                
                // Module exports (for compatibility check)
                "module": "readonly",
                "exports": "readonly"
            }
        },
        rules: {
            // Prefer strict equality
            "eqeqeq": ["error", "always"],
            
            // Prefer const/let over var
            "no-var": "error",
            "prefer-const": "error",
            
            // Semicolons
            "semi": ["error", "always"],
            
            // Console statements (warn in production)
            "no-console": "warn",
            
            // Unused variables
            "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
            
            // Consistent quotes
            "quotes": ["error", "single", { "allowTemplateLiterals": true }],
            
            // Trailing commas
            "comma-dangle": ["error", "never"],
            
            // No debugger
            "no-debugger": "error",
            
            // No alert
            "no-alert": "error",
            
            // Consistent indentation
            "indent": ["error", 4],
            
            // Consistent spacing
            "space-before-blocks": "error",
            "keyword-spacing": "error",
            
            // No multiple empty lines
            "no-multiple-empty-lines": ["error", { "max": 2 }],
            
            // Consistent line endings
            "eol-last": "error"
        }
    }
];