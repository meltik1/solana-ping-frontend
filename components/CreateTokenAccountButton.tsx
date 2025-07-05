import {FC} from "react";
import styles from "../styles/Button.module.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { createAssociatedTokenAccount, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from "@solana/spl-token";

export const CreateTokenAccountButton : FC<{tokenMint: string}> = ({tokenMint}) => {
    
    const {publicKey, sendTransaction} = useWallet();
    const {connection} = useConnection();

    const onClick = async () => {
        try {
            console.log(`Create Token Account. ${tokenMint}`);
            const transaction = await createTokenAccountTransaction(publicKey, new PublicKey(tokenMint));
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
            console.error('Error creating token account:', error.toString());
        }
    }

    return (
        <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={onClick}>
                Create Token Account
            </button>
        </div>

    )
}

async function createTokenAccountTransaction(tokenAccountOwner: PublicKey, tokenMint: PublicKey, 
    
): Promise<Transaction> {
    const tokenAccountAddress = await getAssociatedTokenAddress(tokenMint, tokenAccountOwner);

    const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
            tokenAccountOwner,
            tokenAccountAddress,
            tokenAccountOwner,
            tokenMint,
        )
    );

    return  transaction ;

}