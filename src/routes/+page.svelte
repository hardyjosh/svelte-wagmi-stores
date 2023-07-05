<script lang="ts">
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains } from '@wagmi/core'
import { mainnet, polygon } from '@wagmi/core/chains'
import { browser } from '$app/environment';
import { blockNumber, account, createConfig, wagmiConfigSetup, network } from '$lib';

const chains = [mainnet, polygon]
const projectId = import.meta.env.VITE_PROJECT_ID

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

let web3modal: Web3Modal

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

{$wagmiConfigSetup}
{$blockNumber}
{$account?.address}
{$account?.isConnected}
{$network?.chain?.unsupported}
