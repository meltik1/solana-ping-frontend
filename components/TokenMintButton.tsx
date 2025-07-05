import {FC} from "react";
import styles from "../styles/Button.module.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createInitializeMint2Instruction, createMint, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, PublicKey, SystemProgram, Transaction, Connection } from "@solana/web3.js";
import { getExplorerLink } from "@solana-developers/helpers";

export const TokenMintButton : FC = () => {

    const {connection} = useConnection();
    const {publicKey, sendTransaction} = useWallet();

   
    const onClick = async () => {
        try {
            const { transaction: mintTransaction, mintPublicKey, mintKeypair } = await createMintTransaction(publicKey, publicKey, publicKey, 3, TOKEN_PROGRAM_ID, connection);
            
            // Get recent blockhash and set it on the transaction
            const { blockhash } = await connection.getLatestBlockhash();
            mintTransaction.recentBlockhash = blockhash;
            mintTransaction.feePayer = publicKey;
            
            // Add the mint keypair as a signer
            mintTransaction.partialSign(mintKeypair);
            
            const signature = await sendTransaction(mintTransaction, connection);
            console.log(`Transaction Link: Your transaction can be found at: \n https://explorer.solana.com/tx/${signature}?cluster=devnet`);
            console.log(`Mint Address: ${mintPublicKey.toString()}`);
            
            // Wait for confirmation
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
            console.error('Error creating mint:', error);
        }
    }


    return (
        <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={onClick}>
                Mint
            </button>
        </div>

    )
}

async function createMintTransaction(owner: PublicKey, mintAuthority: PublicKey, freezeAuthority: PublicKey, decimals: number, programId: PublicKey, connection: Connection): Promise<{ transaction: Transaction, mintPublicKey: PublicKey, mintKeypair: Keypair }> {
    const lamports = await getMinimumBalanceForRentExemptMint(connection);

    const keypair = Keypair.generate();

    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: owner,
            newAccountPubkey: keypair.publicKey,
            space: MINT_SIZE,
            lamports,
            programId,
        }),
        createInitializeMint2Instruction(keypair.publicKey, decimals, mintAuthority, freezeAuthority, programId),
    );

    console.log(`token.publicKey: ${keypair.publicKey}`);

    return { transaction, mintPublicKey: keypair.publicKey, mintKeypair: keypair };
}
