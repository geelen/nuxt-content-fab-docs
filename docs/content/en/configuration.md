---
title: 'Configuration'
category: Knowledge Base
position: 999
---

# Configuration

FAB builds use a `fab.config.json5` file:

```json5
// fab.config.json5
{
  plugins: {
    '@fab/input-static': {
      dir: 'dist', // Read files from this directory
    },
    '@fab/plugin-render-html': {
      // Enrich HTML files with:
      injections: {
        env: {
          name: 'FAB_SETTINGS', // which global variable to use?
        },
        csp: {
          nonce: true,
        },
      },
    },
    '@fab/plugin-rewire-assets': {},
  },
  settings: {
    production: {
      API_URL: 'https://api.lol.com',
    },
    staging: {
      API_URL: 'https://staging.lol.com',
    },
  },
  deploy: {
    'deploy-provider-name': {
      setting: 'value',
      secret: '@ENV_VAR'
    }
  }
}
```

## Value types

This file is [JSON5](https://json5.org/), a superset of JSON that's closer to normal JS syntax (i.e. it has comments and unquoted keys). A normal JSON file is valid JSON5, though, if you prefer that, and support for other formats like YAML is [planned](https://github.com/fab-spec/fab/issues/39).

We deviate in one important respect, however, which is that string values of the form `"/regexp/i" are parsed using [regex-parser](https://www.npmjs.com/package/regex-parser). For reference, the exact regexp we use is [here](https://github.com/fab-spec/fab/blob/next/packages/core/src/constants.ts#L8).

The other special-case value is one like `@ALL_CAPS`, which is used with `dotenv` to look for an appropriate environment variable.
