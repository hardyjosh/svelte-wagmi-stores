import type { Chain, Transport } from 'viem';
import { type Writable, derived, writable, type Readable } from 'svelte/store';
import { 
    getAccount, 
    type Config,
    watchAccount, 
    getWalletClient, 
    getPublicClient, 
    watchBlockNumber, 
    watchPublicClient, 
    type GetAccountReturnType,  
    type CreateConfigParameters, 
    type GetWalletClientReturnType, 
    type GetPublicClientReturnType, 
    createConfig as wagmiCreateConfig, 
} from '@wagmi/core'

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

export const account = derived<Writable<Config>, GetAccountReturnType>(
    wagmiConfig, 
    ($wagmiConfig, set) => {
        set(getAccount($wagmiConfig))
        return watchAccount($wagmiConfig, {
            onChange(account) {
                set(account)
            }
        })
    }
)

export const blockNumber = derived<Writable<Config>, bigint>(
    wagmiConfig, 
    ($wagmiConfig, set) => {
        return watchBlockNumber($wagmiConfig, {
            onBlockNumber(blockNumber) {
                set(blockNumber)
            }    
        })
    }
)

export const publicClient = derived<Writable<Config>, GetPublicClientReturnType>(
    wagmiConfig, 
    ($wagmiConfig, set) => {
        set(getPublicClient($wagmiConfig))
        return watchPublicClient($wagmiConfig, {
            onChange(publicClient) {
                set(publicClient)
            }
        })
    }
)

export const walletClient: Readable<GetWalletClientReturnType> = derived<Writable<Config>, GetWalletClientReturnType>(
    wagmiConfig, 
    ($wagmiConfig, set) => {
        getWalletClient($wagmiConfig).then(r => set(r))
    }
)