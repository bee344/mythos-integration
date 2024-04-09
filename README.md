# Mythos Parachain

## Overview

The Mythos Parachain is meant to be the blockchain platform for Mythos Games.

### Running a Mythos Parachain node

Using the Mythos Parachain will require running a parachain node to sync the chain. This is very similar to running a Polkadot node, with the addition of some extra flags. You can clone the [`Mythos Parachain` repo](https://github.com/paritytech/project-mythical/tree/main) and build from source with the following commands:

```bash
git clone https://github.com/paritytech/project-mythical
cd project-mythical
cargo build --release
```

Another alternative is using Docker, this is more advanced, so it's best left up to those already familiar with docker or who have completed the other set-up instructions:

```bash
docker build -t mythos-node --file ./docker/Dockerfile .
```

And then run the node with:

```bash
./target/release/mythos-node
```

#### Hardware requirements

Currently there are no hardware requirements specific for running a node, since they do not perform time-critical tasks. The only requirement is to have enough storage for the type of node intended, which can be retrieved from [here](https://stakeworld.io/docs/dbsize). Other than that, any relatively performant equipement or any cloud provider will suffice. You can also look into the [reference hardware](https://wiki.polkadot.network/docs/maintain-guides-how-to-validate-polkadot#reference-hardware) for validators, but be aware that these will probably be overkill for a non-validator node.

## MYTH Token transfers

Mythos Parachain's native token is **MYTH**, handled by the [`pallet_balances`](https://docs.rs/pallet-balances/latest/pallet_balances/), and is transferred as any other substrate based chain's native token. MYTH Token has 18 decimals and it's existential deposit (the amount of tokens an account must holde before being _reaped_) is 0.001 MYTH.

As the Mythos Parachain uses an instance of the `pallet_balances`, its token is handled by the same calls as, for example, DOT, those being:

- `transfer_keep_alive`, which has in place checks to only transfer an amount that leaves at least the Existential Deposit in the sender's account.
- `transfer_allow_death` which does not have the Existential Deposit's checks as the previous call.
- `transfer_all` which transfers the total balance of an account, causing the account to be reaped.

### Transfer Monitoring

#### Monitoring of MYTH deposits

Currently, MYTH tokens can be sent and received using the calls mentioned previously, and to keep track of the completion of MYTH transfers the service providers need to monitor local transfers and corresponding `balances (Transfer)` event. This event has the fields `from`, `to` and `amount` to indicated the origin account, destination account and amount transferred. This event is followed by either `system (ExtrinsicSuccess)` or by `system (ExtrinsicFailed)`, which in turn has a field `dispatch_error` with the information regarding why the transfer failed.

#### Relevant tooling

The Mythos Parachain will come with the same tooling suite [provided for the Relay Chain](https://wiki.polkadot.network/docs/build-integration#recommendation), namely [API Sidecar](https://github.com/paritytech/substrate-api-sidecar), [Polkadot-JS](https://wiki.polkadot.network/docs/learn-polkadotjs-index), [subxt](https://github.com/paritytech/subxt), and the [Asset Transfer API](https://github.com/paritytech/asset-transfer-api). If you have a technical question or issue about how to use one of the integration tools, please file a GitHub issue so a developer can help.

##### For node interaction: Substrate API Sidecar

Parity maintains an RPC client, written in TypeScript, that exposes a limited set of endpoints. It handles the metadata and codec logic so that the user is always dealing with decoded information. It also aggregates information that an infrastructure business may need for accounting and auditing, e.g. transaction fees.

For the case of token transfers, Sidecar can fetch information associated with an specific account's balance:

```json
{
  "at": {
    "hash": "string",
    "height": "string"
  },
  "nonce": "string",
  "tokenSymbol": "string",
  "free": "string",
  "reserved": "string",
  "miscFrozen": "string",
  "feeFrozen": "string",
  "frozen": "string",
  "locks": [
    {
      "id": "string",
      "amount": "string",
      "reasons": "Fee = 0"
    }
  ]
}
```

Using the generic endpoints for the `pallet_balances`, sidecar can also retrieve values specific to the configuration of the pallet, such as `constants`, `dispatchables`, `errors`, `events` and `storage`.

Sidecar can also submit transactions to the node it's connected to. For this we would have to first build the transaction, sign it, and submit it as a hex string. Then, if the submission was successful, we would receive a JSON with the hash of the transaction, `txHash`:

```json
{
  "hash": "txHash"
}
```

You can find more information about Sidecar in its [documentation](https://paritytech.github.io/substrate-api-sidecar/dist/).

##### For transaction construction

Several tools are available to construct transactions for Polkadot Asset Hub. For example, subxt provides libraries in Rust with great flexibility for transaction construction, whereas Asset Transfer API is focused on offering a simplified interface to build of asset transfers.

- **Examples**

Examples on how to build transactions to manage foreign assets can be located in their following directories:

- [Polkadot-JS](/polkadot-js-example/)
- [Subxt](/subxt-example/)
- [Asset Transfer API](/asset-transfer-api-example/)

The instructions on how to run each example are located in it's respective `README` files.
