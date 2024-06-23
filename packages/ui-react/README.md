<p align="center">
<br />
<img src="https://github.com/QuyxHQ/ts/blob/main/assets/logo.svg?raw=true" width="200" alt="Quyx"/>
<br />
</p>

<h1 align="center">Quyx TypeScript: ui-react</h1>

## Installation

Install the latest version with `npm`:

```sh
npm install @quyx/ui-react
```

or with `yarn`:

```sh
yarn add @quyx/ui-react
```

<br />

## Getting Started

```sh
npm install @tonconnect/ui-react@^2.0.5 @quyx/ui-react
```

### Using QuyxProvider

```ts title="main.tsx"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { QuyxProvider } from '@quyx/ui-react'
import App from './App.tsx'

const url = 'link-to-your-site-manifest-here'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TonConnectUIProvider manifestUrl={url}>
            <QuyxProvider pk={import.meta.env.QUYX_PK}>
                <App />
            </QuyxProvider>
        </TonConnectUIProvider>
    </React.StrictMode>
)
```

For more examples and usage, checkout the docs [here](https://docs.quyx.xyz/libraries/ui-react)
