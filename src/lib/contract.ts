import { wagmiConfig, walletClient } from "./stores.js";
import { writeContract, type ReadContractParameters, type ReadContractReturnType, type WriteContractParameters, type WriteContractReturnType, readContract, waitForTransaction } from "@wagmi/core";
import { derived, get, writable, type Writable } from "svelte/store";
import type { Abi, Hex, TransactionReceipt, WalletClient } from "viem";

/**
 * 
 * @param abi - ABI of the contract. Use a const assertion to get type checking for your abi.
 * @param address - Address of the contract. If not provided, the contract store will be created in an idle, unconnected state.
 * @returns A WagmiContract store.
 */
export const makeContractStore = <TAbi extends Abi>(abi: TAbi, address?: `0x${string}`) => {
    return derived([walletClient], ([$walletClient]) => {
        if ($walletClient && address) {
            return new WagmiContract(abi, address, $walletClient)
        } else {
            return new WagmiContract(abi);
        }
    })
}

type ContractWriteHooks = {
    onError?: (error: Error) => void
    onSettled?: (result: WriteContractReturnType) => void
    onSuccess?: (args: { hash: Hex, receipt: TransactionReceipt }) => void
}

type ContractWriteReturn = {
    data: Writable<{ hash: Hex } | undefined>
    error: Writable<Error | undefined>
    isError: Writable<boolean>
    isIdle: Writable<boolean>
    isLoading: Writable<boolean>
    isSuccess: Writable<boolean>
    write: (() => void) | undefined
    writeAsync: (() => Promise<{ hash: Hex }>) | undefined
    // reset: () => void
    status: Writable<'idle' | 'error' | 'loading' | 'success'>
}

export class WagmiContract<TAbi extends Abi> {
    constructor(abi: TAbi, address?: `0x${string}`, walletClient?: WalletClient) {
        this.address = address
        this.walletClient = walletClient
        this.abi = abi
    }

    private address: `0x${string}` | undefined
    private walletClient: WalletClient | undefined
    private abi: TAbi

    async read({
        account,
        args,
        functionName,
        blockNumber,
        blockTag,
      }: ReadContractParameters
    ): Promise<ReadContractReturnType | undefined> {
        if (!this.address) {
            return undefined
        }
        return readContract(
          get(wagmiConfig), 
          {
            abi: this.abi,
            address: this.address,
            account,
            functionName,
            args,
            blockNumber,
            blockTag,
          }
        )
    };

    write(config: ContractWriteHooks & WriteContractParameters): ContractWriteReturn {

        const result: ContractWriteReturn = {
            status: writable('idle'),
            data: writable(undefined),
            error: writable(undefined),
            isError: writable(false),
            isIdle: writable(true),
            isLoading: writable(false),
            isSuccess: writable(false),
            write: undefined,
            writeAsync: undefined,
        }
        // if we don't have an address or wallet client
        if (!this.address || !this.walletClient) {
            return result
        }

        let _config: WriteContractParameters;

        if (config.__mode !== 'prepared') {
            _config = { ...config, address: this.address, abi: this.abi } as WriteContractParameters
        } else {
            _config = config;
        }

        result.write = () => {
            result.isError.set(false)
            result.status.set('loading')
            result.isIdle.set(false)
            result.isLoading.set(true)
            writeContract(get(wagmiConfig), _config).then(( hash ) => {
                result.data.set({ hash })
                waitForTransaction(get(wagmiConfig), { hash }).then(receipt => {
                    result.status.set('success')
                    result.isSuccess.set(true)
                    result.isLoading.set(false)
                    if (config?.onSuccess) {
                        config.onSuccess({ hash, receipt })
                    }
                })
            }).catch(error => {
                result.status.set('error')
                result.error.set(error)
                result.isError.set(true)
                result.isLoading.set(false)
            })
        }

        result.writeAsync = async () => {
            result.isError.set(false)
            result.isIdle.set(false)
            result.isLoading.set(true)
            const hash  = await writeContract(get(wagmiConfig), _config)
            result.data.set({ hash })
            result.isSuccess.set(true)
            result.isLoading.set(false)
            return { hash }
        }
        return result
    }
}