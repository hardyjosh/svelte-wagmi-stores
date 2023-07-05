# svelte-wagmi-stores

A simple wrapper around the @wagmi/core library, providing readable stores for use in Svelte/SvelteKit applications.

## Installation

Add the `svelte-wagmi-stores` package and the peer dependencies.

```bash
npm i svelte-wagmi-stores @wagmi/core viem
```

## Usage

This library provides the following stores as wrappers around the corresponding `watch` actions from the [@wagmi/core api](https://wagmi.sh/core/actions/watchAccount).

```javascript
import {
    account,
    blockNumber,
    network,
    publicClient,
    walletClient
}
```

However, before you can use the stores, you must use `createConfig` from this package instead of directly from wagmi (see below). This is because wagmi provides no hook for when a config has been created.

### Example Setup
```html
<script>
import { browser } from '$app/environment';
import { configureChains } from '@wagmi/core'
import { mainnet, polygon } from '@wagmi/core/chains'
import { createConfig, account } from 'svelte-wagmi-stores';
// this example also uses Web3Modal - you'll need to install this yourself
import { Web3Modal } from '@web3modal/html'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'


// all this boilerplate is from the web3modal docs
const chains = [mainnet, polygon]
const projectId = import.meta.env.VITE_PROJECT_ID

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

// except here we're using createConfig form this package instead of wagmi
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})

const ethereumClient = new EthereumClient(wagmiConfig, chains)

let web3modal: Web3Modal

// necessary if you're using SSR, because there's no window for the modal to attach to
$: if (browser) {
  web3modal = new Web3Modal({ projectId }, ethereumClient)
  web3modal.setDefaultChain(polygon)
}
</script>

{#if web3modal}
    <button on:click={() => web3modal.openModal()}>
    {#if $account?.isConnected}
        Disconnect
    {:else}
        Connect
    {/if}
    </button>
{/if}
```


