import { Address, toNano } from 'ton-core';
import { JettonWallet } from '../wrappers/JettonWallet';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const jettonWallet = provider.open(
        JettonWallet.createFromConfig({
            owner: Address.parse('EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL'),
            balance: toNano('1'),
            master: Address.parse('EQB8GJpiN7YxxKak6O2wH-aAEVaVrzJKuq9qYK6WHGUSHEjv'),
        })
    );

    await jettonWallet.sendDeploy(provider.sender(), toNano('0.0001'));

    await provider.waitForDeploy(jettonWallet.address);
}
