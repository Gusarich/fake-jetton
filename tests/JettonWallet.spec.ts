import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Address, toNano } from 'ton-core';
import { JettonWallet } from '../wrappers/JettonWallet';
import '@ton-community/test-utils';
import { randomAddress } from '@ton-community/test-utils';

describe('JettonWallet', () => {
    let blockchain: Blockchain;
    let jettonWallet: SandboxContract<JettonWallet>;
    let ownerAddress: Address;
    let masterAddress: Address;

    beforeEach(async () => {
        ownerAddress = randomAddress();
        masterAddress = randomAddress();
        blockchain = await Blockchain.create();
        jettonWallet = blockchain.openContract(
            JettonWallet.createFromConfig({
                owner: ownerAddress,
                balance: toNano('1.23'),
                master: masterAddress,
            })
        );
        const deployer = await blockchain.treasury('deployer');
        const deployResult = await jettonWallet.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonWallet.address,
            deploy: true,
        });
    });

    it('should deploy', async () => {});

    it('should return correct data', async () => {
        expect(await jettonWallet.getOwner()).toEqualAddress(ownerAddress);
        expect(await jettonWallet.getBalance()).toEqual(toNano('1.23'));
        expect(await jettonWallet.getMaster()).toEqualAddress(masterAddress);
    });
});
