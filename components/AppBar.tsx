import { FC } from 'react'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import dynamic from "next/dynamic";


const WalletConnectButton = dynamic(
    () => import("@solana/wallet-adapter-react-ui").then(mod => mod.WalletMultiButton),
    { ssr: false }
);

export const AppBar: FC = () => {
    return (
        <div className={styles.AppHeader}>
            <Image src="/solanaLogo.png" height={30} width={200} />
            <span>Wallet-Adapter Example</span>
            <WalletConnectButton ></WalletConnectButton>
        </div>
    )
}