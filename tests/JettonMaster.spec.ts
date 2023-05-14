import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Address, beginCell, toNano } from 'ton-core';
import { JettonMaster } from '../wrappers/JettonMaster';
import '@ton-community/test-utils';
import { randomAddress } from '@ton-community/test-utils';
import { walletCode } from '../wrappers/JettonWallet';

describe('JettonMaster', () => {
    let blockchain: Blockchain;
    let jettonMaster: SandboxContract<JettonMaster>;
    let ownerAddress: Address;
    let masterAddress: Address;

    beforeEach(async () => {
        ownerAddress = randomAddress();
        masterAddress = randomAddress();
        blockchain = await Blockchain.create();
        jettonMaster = blockchain.openContract(
            JettonMaster.createFromConfig({
                content: beginCell().storeStringTail('test!').endCell(),
            })
        );
        const deployer = await blockchain.treasury('deployer');
        const deployResult = await jettonMaster.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMaster.address,
            deploy: true,
        });
    });

    it('should deploy', async () => {});

    it('should return correct data', async () => {
        expect((await jettonMaster.getContent()).equals(beginCell().storeStringTail('test!').endCell())).toBeTruthy();
        expect((await jettonMaster.getWalletCode()).equals(walletCode)).toBeTruthy();
    });
});
