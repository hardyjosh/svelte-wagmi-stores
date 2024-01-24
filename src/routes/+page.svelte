<script lang="ts">
	// import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
	// import { Web3Modal } from '@web3modal/html';
	import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi1';

	import { configureChains } from '@wagmi/core';
	import { mainnet, polygon } from '@wagmi/core/chains';
	import { browser } from '$app/environment';
	import {
		blockNumber,
		account,
		createConfig,
		wagmiConfigSetup,
		network,
		walletClient
	} from '$lib/index.js';

	const chains = [mainnet, polygon];
	const projectId = 'ec4373bcaa770976ed0cf783a7f51aab';

	const metadata = {
		name: 'Web3Modal',
		description: 'Web3Modal Example',
		url: 'https://web3modal.com',
		icons: ['https://avatars.githubusercontent.com/u/37784886']
	};
	const wagmiConfig = defaultWagmiConfig({ chains, projectId, appName: metadata.name });

	let web3modal;

	$: if (browser) {
		web3modal = createWeb3Modal({ wagmiConfig, projectId, chains });
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

<p>wagmiConfig set up</p>
<p>
	{$wagmiConfigSetup}
</p>
<hr />
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
  <!-- {JSON.stringify($account, null, 2)} -->
</pre>
<hr />

<p>network</p>
<pre>
  {JSON.stringify($network, null, 2)}
</pre>
