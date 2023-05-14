import { beginCell, toNano } from 'ton-core';
import { JettonMaster } from '../wrappers/JettonMaster';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const jettonMaster = provider.open(
        JettonMaster.createFromConfig({
            content: beginCell()
                .storeUint(1, 8)
                .storeStringTail('https://raw.githubusercontent.com/Gusarich/fake-jetton/main/scripts/metadata.json')
                .endCell(),
        })
    );

    await jettonMaster.sendDeploy(provider.sender(), toNano('0.0001'));

    await provider.waitForDeploy(jettonMaster.address);
}
