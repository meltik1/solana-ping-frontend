import {FC} from "react";
import styles from "../styles/Button.module.css";
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {PublicKey, Transaction} from "@solana/web3.js";
import {createMintToInstruction, getAssociatedTokenAddress, mintTo} from "@solana/spl-token";

export const TokenTransferButton : FC<{tokenMint: string, recipient:string, amount:string}> = ({tokenMint, recipient, amount}) => {
    
    const {connection} = useConnection();
    const {publicKey, sendTransaction} = useWallet();

    const onClick = async () => {
        console.log(`Transfer. ${tokenMint} ${amount} to ${recipient} `);

        try {
            const transaction = await transferTokenTransaction(publicKey, new PublicKey(tokenMint), new PublicKey(recipient), Number(amount));
            const signature = await sendTransaction(transaction, connection);
            console.log(`Transaction Signature: ${signature}`);

            const latestBlockhash = await connection.getLatestBlockhash();
            const confirmation = await connection.confirmTransaction({
                signature,
                blockhash: latestBlockhash.blockhash,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            });

            if (confirmation.value.err) {
                console.error('Transaction failed:', confirmation.value.err);
            } else {
                console.log('Transaction confirmed successfully!');
            }
        } catch (error) {
            console.error('Error transferring token:', error.toString());
        }
    }
    

    return (
        <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={onClick}>
                Transfer
            </button>
        </div>

    )
}

async function transferTokenTransaction(authority: PublicKey, tokenMint: PublicKey, recipient: PublicKey, amount: number) {
    const senderTokenAccount = await getAssociatedTokenAddress(tokenMint, authority);

    return new Transaction().add(
        createMintToInstruction(tokenMint, senderTokenAccount, authority, amount),
    );

}