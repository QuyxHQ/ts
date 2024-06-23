<p align="center">
<br />
<img src="https://github.com/QuyxHQ/ts/blob/main/assets/logo.svg?raw=true" width="200" alt="Quyx"/>
<br />
</p>

<h1 align="center">Quyx TypeScript: ts</h1>

## Installation

Install the latest version with `npm`:

```sh
npm install @quyx/ts
```

or with `yarn`:

```sh
yarn add @quyx/ts
```

<br />

## Getting Started

### 1. Instantiate the class

```ts title="index.ts"
import { QuyxSdk } from '@quyx/ts'

const quyx = new QuyxSdk({ sk: 'sk_xxxxxxxxxxxxx' })
```

### 3. Code Examples

```typescript title="index.ts"
// verify a JWT credential
async function verifyCredential(jwt: string) {
    const response = await quyx.identity.verify({ jwt })
    console.log(response)
}

// get information about space
async function getSpaceInformation() {
    const space = await quyx.space.info()
    console.log(space)
}

// get space users
async function getSpaceUsers() {
    const users = await quyx.space.users.all({ page: 1, limit: 20 })
    console.log(users)
}

// get space user from address (any format)
async function getSpaceUser(address: string) {
    const user = await quyx.space.users.single(address)
    console.log(user)
}

;(async function () {
    await Promise.all([
        verifyCredential('......'),
        getSpaceInformation(),
        getSpaceUsers(),
        getSpaceUser('0QC6VjLAQ-RT64wqUHn_tTxl3hynuFjYUCoL87gf1bZ-O6lQ'),
    ])
})()
```

To run code run this in terminal:

```sh
ts-node index.ts
```

Ensure you have `ts-node` installed globally inorder for this to work, to install `ts-node` globally run

```sh
npm i -g ts-node
```
