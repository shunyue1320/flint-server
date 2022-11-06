# flint-server

for learning

### Installation

```shell
yarn install --frozen-lockfile
```

### Setup Environment

1. Create files `development.local.yaml`.
1. Add environment variables following the `config/defaults.yaml` format.

### Run the Project

1. Execute at project root:

```shell
   yarn run start
```

3. Open another terminal and execute at project root:

```shell
   node ./dist/index.js
```

You should see `ready on http://0.0.0.0:80` if everything is OK.
