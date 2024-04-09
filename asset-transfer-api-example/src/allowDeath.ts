/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise, TxResult } from '@substrate/asset-transfer-api';
import { GREEN, PURPLE, RESET } from './colors';

/**
 * In this example we are creating a call to send MYTH tokens
 * to another account in Mythos Parachain, setting `keepAlive` to false to make this a `balances.transfer` payload
 */
const main = async () => {
	const { api, specName, safeXcmVersion } = await constructApiPromise('wss://polkadot-mythos-rpc.polkadot.io');
	const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

	let callInfo: TxResult<'payload'>;
	try {
		callInfo = await assetApi.createTransferTransaction(
			'3369', // NOTE: The destination id is `1000` and matches the origin chain making this a local transfer
			'0x033bc19e36ff1673910575b6727a974a9abd80c9a875d41ab3e2648dbfb9e4b518',
			[],
			['1000000000000'],
			{
				format: 'payload',
				sendersAddr: '0x02509540919faacf9ab52146c9aa40db68172d83777250b28e4679176e49ccdd9f',
        keepAlive: false
			},
		);

		console.log(callInfo);
	} catch (e) {
		console.error(e);
		throw Error(e as string);
	}

	const decoded = assetApi.decodeExtrinsic(callInfo.tx.toHex(), 'payload');
	console.log(`\n${PURPLE}The following decoded tx:\n${GREEN} ${JSON.stringify(JSON.parse(decoded), null, 4)}${RESET}`);
};

main()
	.catch((err) => console.error(err))
	.finally(() => process.exit());
