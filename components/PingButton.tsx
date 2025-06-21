import { FC, useState } from 'react'
import styles from '../styles/PingButton.module.css'
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {PublicKey, Transaction, TransactionInstruction} from "@solana/web3.js";


const PING_PROGRAM_ADDRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
const PING_PROGRAM_DATA_ADDRESS =
	"Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";


export const PingButton: FC = () => {

	const {connection} = useConnection()
	let {publicKey, sendTransaction} = useWallet();

	const onClick = async () => {
		if (!connection  || !publicKey) {
			console.error("Wallet not connected or connection unavailable");
		}

		try {
			const programId = new PublicKey(PING_PROGRAM_ADDRESS)
			const programDataId = new PublicKey(PING_PROGRAM_DATA_ADDRESS)

			let transaction = new Transaction()
			const instr = new TransactionInstruction({
				keys: [
					{
						pubkey: programDataId,
						isSigner: false,
						isWritable: true,
					},
				],
				programId
			})

			transaction.add(instr);

			const signature = await sendTransaction(transaction, connection);
			console.log("Transaction Signature:", signature);
		}
		catch (e) {
			console.log(e)
		}
	};

	return (
		<div className={styles.buttonContainer} onClick={onClick}>
			<button className={styles.button}>Ping!</button>
		</div>
	);
};

