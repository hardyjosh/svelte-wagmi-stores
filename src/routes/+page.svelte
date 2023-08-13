<script lang="ts">
	import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
	import { Web3Modal } from '@web3modal/html';
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
	} from '$lib';

	const chains = [mainnet, polygon];
	const projectId = import.meta.env.VITE_PROJECT_ID;

	const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
	const wagmiConfig = createConfig({
		autoConnect: false,
		connectors: w3mConnectors({ projectId, chains }),
		publicClient
	});
	const ethereumClient = new EthereumClient(wagmiConfig, chains);

	let web3modal: Web3Modal;

	$: if (browser) {
		web3modal = new Web3Modal({ projectId }, ethereumClient);
		web3modal.setDefaultChain(polygon);
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
