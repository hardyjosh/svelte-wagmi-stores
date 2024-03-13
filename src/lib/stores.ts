import { type GetAccountReturnType, type Config, type GetPublicClientReturnType, watchAccount, watchBlockNumber, watchPublicClient, createConfig as wagmiCreateConfig, type CreateConfigParameters, type GetWalletClientReturnType, getWalletClient, getPublicClient, getAccount } from '@wagmi/core'
import { type Writable, derived, writable, type Readable } from 'svelte/store';
import type { Chain, Transport } from 'viem';

export const wagmiConfig = writable<Config>();

export const createConfig = <
    const chains extends readonly [Chain, ...Chain[]],
    transports extends Record<chains[number]['id'], Transport>,
>(
    config: CreateConfigParameters<chains, transports>
) => {
    const _wagmiConfig = wagmiCreateConfig(config)
    wagmiConfig.set(_wagmiConfig)
    return _wagmiConfig
}

export const account = derived<Writable<Config>, undefined | GetAccountReturnType>(wagmiConfig, ($wagmiConfig, set) => {
    if ($wagmiConfig) {
        set(getAccount($wagmiConfig))
        return watchAccount($wagmiConfig, {
            onChange(account) {
                set(account)
            }
        })
    }
})

export const blockNumber = derived<Writable<Config>, undefined | bigint>(wagmiConfig, ($wagmiConfig, set) => {
    if ($wagmiConfig) {
        return watchBlockNumber($wagmiConfig, {
            onBlockNumber(blockNumber) {
                set(blockNumber)
            }    
        })
    }
})

// export const network = derived<Writable<Config>, undefined | GetNetworkResult>(wagmiConfig, ($wagmiConfig, set) => {
//     if ($wagmiConfig) {
//         set(getNetwork())
//         return watchNetwork($wagmiConfig, (network) => {
//             set(network)
//         })
//     }
// })

export const publicClient = derived<Writable<Config>, undefined | GetPublicClientReturnType>(wagmiConfig, ($wagmiConfig, set) => {
    if ($wagmiConfig) {
        set(getPublicClient($wagmiConfig))
        return watchPublicClient($wagmiConfig, {
            onChange(publicClient) {
                set(publicClient)
            }
        })
    }
})

export const walletClient: Readable<undefined | GetWalletClientReturnType> = derived<Writable<Config>, undefined | GetWalletClientReturnType>(wagmiConfig, ($wagmiConfig, set) => {
    if ($wagmiConfig) {
        getWalletClient($wagmiConfig).then(r => set(r))
    }
})