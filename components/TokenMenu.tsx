import {FC, useState} from "react";
import styles from "../styles/TokenMenu.module.css"
import { TokenMintButton } from "./TokenMintButton";
import { CreateTokenAccountButton } from "./CreateTokenAccountButton";
import { TokenTransferButton } from "./TokenTransfer";

export const TokenMenu : FC = () => {
    const [tokenMintForCreate, setTokenMint] = useState("");
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [tokenMintForTransfer, setTokenMintForTransfer] = useState("");

    return (
        <div className={styles.inputContainer}>
            <h2>Выпустить токен</h2>
            
            <TokenMintButton/>
           
           
            <br/>
            <h2>Выпустить аккаунт для получения токенов</h2>
            <label>Token Mint Address:</label>
            <input className={styles.input} placeholder="Адрес минта токена" value={tokenMintForCreate} onChange={(e) => setTokenMint(e.target.value)}/>
            <CreateTokenAccountButton tokenMint={tokenMintForCreate}/>
            
            
            <br/>
            <h2>Transfer</h2>
            <label>Получатель:</label>
            <input className={styles.input} placeholder="Публичный ключ аккаунта созданного для получения токенов" value={recipient} onChange={(e) => setRecipient(e.target.value)}/>
            <label>Token Mint:</label>
            <input className={styles.input} placeholder="Название минта" value={tokenMintForTransfer} onChange={(e) => setTokenMintForTransfer(e.target.value)}/>
            <label>Сколько денежек отправить</label>
            <input className={styles.input} placeholder="Количество токенов" value={amount} onChange={(e) => setAmount(e.target.value)}/>
            <TokenTransferButton tokenMint={tokenMintForTransfer} recipient={recipient} amount={amount}/>
        </div>
    )
}