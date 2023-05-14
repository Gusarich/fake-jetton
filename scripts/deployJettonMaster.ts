import { beginCell, toNano } from 'ton-core';
import { JettonMaster } from '../wrappers/JettonMaster';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const jettonMaster = provider.open(
        JettonMaster.createFromConfig({
            content: beginCell().endCell(),
        })
    );

    await jettonMaster.sendDeploy(provider.sender(), toNano('0.0001'));

    await provider.waitForDeploy(jettonMaster.address);
}
