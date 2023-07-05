import { type GetAccountResult, type PublicClient, watchAccount, watchBlockNumber, watchPublicClient, watchWalletClient, createConfig as wagmiCreateConfig, type CreateConfigParameters, type WebSocketPublicClient, watchNetwork, type WalletClient, type GetNetworkResult, type GetWalletClientResult } from '@wagmi/core'
import { type Writable, derived, writable } from 'svelte/store';

export const wagmiConfigSetup = writable<boolean>(false);

export const createConfig = (config: CreateConfigParameters<PublicClient, WebSocketPublicClient>) => {
    const wagmiConfig = wagmiCreateConfig(config)
    wagmiConfigSetup.set(true)
    return wagmiConfig
}

export const account = derived<Writable<boolean>, undefined | GetAccountResult<PublicClient>>(wagmiConfigSetup, ($wagmiConfigSetup, set) => {
    if ($wagmiConfigSetup) {
        return watchAccount((account) => {
            set(account)
        })
    }
})

export const blockNumber = derived<Writable<boolean>, undefined | bigint>(wagmiConfigSetup, ($wagmiConfigSetup, set) => {
    if ($wagmiConfigSetup) {
        return watchBlockNumber({listen: true}, (blockNumber) => {
            set(blockNumber)
        })
    }
})

export const network = derived<Writable<boolean>, undefined | GetNetworkResult>(wagmiConfigSetup, ($wagmiConfigSetup, set) => {
    if ($wagmiConfigSetup) {
        return watchNetwork((network) => {
            set(network)
        })
    }
})

export const publicClient = derived<Writable<boolean>, undefined | PublicClient>(wagmiConfigSetup, ($wagmiConfigSetup, set) => {
    if ($wagmiConfigSetup) {
        return watchPublicClient({}, (publicClient) => {
            set(publicClient)
        })
    }
})

export const walletClient = derived<Writable<boolean>, undefined | GetWalletClientResult>(wagmiConfigSetup, ($wagmiConfigSetup, set) => {
    if ($wagmiConfigSetup) {
        return watchWalletClient({}, (walletClient) => {
            set(walletClient)
        })
    }
})