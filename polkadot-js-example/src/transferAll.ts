import { Keyring } from "@polkadot/keyring";
import { ApiPromise, WsProvider } from '@polkadot/api';
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { KeyringPair } from "@polkadot/keyring/types";

/**
 * In this example we are creating a transaction with a balances.transferKeepAlive call to send MYTH
 * to another acount inside Mythos Parachain,
 */

async function main() {
    const RPC_ENDPOINT = 'wss://polkadot-mythos-rpc.polkadot.io';

    const wsProvider = new WsProvider(RPC_ENDPOINT);

    const api = await ApiPromise.create({
        provider: wsProvider,
    },
    );

    await api.isReady;
    await cryptoWaitReady();

    const keyring = new Keyring({ type: "ethereum" });
    const alice: KeyringPair = keyring.addFromUri("0x5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133");
    const bob: KeyringPair = keyring.addFromUri("0x8075991ce870b93a8870eca0c0f91913d12f47948ca0fd25b49c6fa7cdbeee8b");

// create transaction, sign it and send it
    const mockTx = await api.tx.balances.transferAll(bob.address, 100000000).signAsync(alice);

    console.log(mockTx.toHex());

}

main()
    .catch(console.error)
    .finally(() => process.exit());
