# svelte-wagmi-stores

A simple wrapper around the @wagmi/core library, providing readable stores for use in Svelte/SvelteKit applications.

**This library is currently under active development and is subject to frequent breaking changes. It is recommended to pin dependencies to a specific version.**

## Installation

Add the `svelte-wagmi-stores` package and the peer dependencies.

```bash
npm i svelte-wagmi-stores @wagmi/core @wagmi/connectors @web3modal/wagmi viem
```

## Usage

This library provides the following stores as wrappers around the corresponding `watch` actions from the [@wagmi/core api](https://wagmi.sh/core/actions/watchAccount).

```javascript
import {
    account,
    blockNumber,
    publicClient,
    walletClient
}
```

However, before you can use the stores, you must use `createConfig` from this package instead of directly from wagmi (see below). This is because wagmi provides no hook for when a config has been created.

### Example Setup

```html
<script>
	import { http } from '@wagmi/core';
	import { browser } from '$app/environment';
	import { walletConnect } from '@wagmi/connectors';
	import { createWeb3Modal } from '@web3modal/wagmi';
	import { mainnet, polygon } from '@wagmi/core/chains';
	import {
		blockNumber,
		account,
		createConfig,
		walletClient,
		wagmiConfig,
	} from 'svelte-wagmi-stores';

	const projectId = import.meta.env.VITE_PROJECT_ID;
	const metadata = {
		name: 'project-name',
		description: "some description",
		url: 'https://some-url.com', // must match with walletconnect domain
		icons: ['https://avatars.githubusercontent.com/u/37784886']
	}

  createConfig({
    chains: [mainnet, polygon],
    transports: {
      [mainnet.id]: http("mainnet-rpc-url"),
      [polygon.id]: http("polygon-rpc-url")
    },
    connectors: [
      walletConnect({ projectId, metadata, showQrModal: false }),
      // ... other connectors
    ],
  });

  let web3modal: ReturnType<typeof createWeb3Modal>;

  $: if (browser && $wagmiConfig) {
    web3modal = createWeb3Modal({
      wagmiConfig: $wagmiConfig,
      projectId,
      enableAnalytics: true, // Optional - defaults to your Cloud configuration
      enableOnramp: true, // Optional - false as default
      // ... other options
    });
  }
</script>

{#if web3modal}
  <button on:click={() => web3modal.open()}>
    {#if $account?.isConnected}
      Disconnect
    {:else}
      Connect
    {/if}
  </button>
{/if}

<p>blockumber</p>
<p>
  {$blockNumber}
</p>
<hr />
<p>walletClient</p>
<p>
  {$walletClient}
</p>
<hr />

<p>account</p>
<pre>
  {JSON.stringify($account, null, 2)}
</pre>
<hr />
```
