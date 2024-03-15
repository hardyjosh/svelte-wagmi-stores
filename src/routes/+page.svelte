<script lang="ts">
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
	} from '$lib/index.js';

	const projectId = import.meta.env.VITE_PROJECT_ID;
	const metadata = {
		name: 'project-name',
		description: 'some description',
		url: 'https://some-url.com', // must match with walletconnect domain
		icons: ['https://avatars.githubusercontent.com/u/37784886']
	}

	createConfig({
		chains: [mainnet, polygon],
		transports: {
			[mainnet.id]: http(mainnet.rpcUrls.default.http[0]), // or desired rpc url of the network
			[polygon.id]: http(polygon.rpcUrls.default.http[0])  // or desired rpc url of the network
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
