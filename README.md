# @miikee-dev/strapi-provider-upload-uploadthing

[![stability-beta](https://img.shields.io/badge/stability-beta-33bbff.svg)]
[![npm](https://img.shields.io/npm/v/strapi-provider-upload-uploadthing.svg?style=flat-shiny&logo=npm&color=white)](https://www.npmjs.com/package/strapi-provider-upload-uploadthing)
![Made with Typescript](https://img.shields.io/badge/Made%20with-TypeScript-blue)

Code is in the process of settling, but has not yet had sufficient real-world testing to be considered mature. Backwards-compatibility will be maintained if reasonable.

## Roadmap

- Add Support for private ACL and signed URL expiration.

## Resources

- [LICENSE](LICENSE)

## Links

- [UploadThing documentation](https://docs.uploadthing.com)
- [Strapi website](https://strapi.io/)
- [Strapi documentation](https://docs.strapi.io)

## Installation

```bash
# using yarn
yarn add @miikee-dev/strapi-provider-upload-uploadthing

# using npm
npm install @miikee-dev/strapi-provider-upload-uploadthing --save
```

## Configuration

- `provider` defines the name of the provider
- `providerOptions` is passed down during the construction of the provider. (ex: `new UTApi(config)`).
  - `apiKey` is the key which allow you to authenticate API requests. You can access your API Keys through the dashboard.
  - `logLevel` default is info. Available log levels are error, warn, info, debug, and trace. 

See the [documentation about using a provider](https://docs.strapi.io/developer-docs/latest/plugins/upload.html#using-a-provider) for information on installing and using a provider. To understand how environment variables are used in Strapi, please refer to the [documentation about environment variables](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/environment.html#environment-variables).

### Provider Configuration

`./config/plugins.js` or `./config/plugins.ts` for TypeScript projects:

```js
exports.default = (env) => ({
    upload: {
        config: {
            provider: 'strapi-provider-upload-uploadthing',
            providerOptions: {
                uTOptions: {
                    apiKey: 'sk_live_h1bnj4bj........',
                    logLevel: 'debug',
                },
            },
        },
    }
});
```

### Security Middleware Configuration

Due to the default settings in the Strapi Security Middleware you will need to modify the `contentSecurityPolicy` settings to properly see thumbnail previews in the Media Library. You should replace `strapi::security` string with the object bellow instead as explained in the [middleware configuration](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/middlewares.html#loading-order) documentation.

`./config/middlewares.js` or `./config/middleware.ts` for TypeScript projects:

```js
module.exports = [
  // ...
  {
        name: 'strapi::security',
        config: {
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'connect-src': ["'self'", "https:"],
                    'img-src': ["'self'", "data:", "blob:", 'utfs.io'],
                    'media-src': ["'self'", "data:", "blob:", 'utfs.io'],
                    upgradeInsecureRequests: null,
                },
            },
        },
    },
  // ...
];
```