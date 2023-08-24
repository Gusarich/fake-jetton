import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';
import { walletCode } from './JettonWallet';

const masterCode = Cell.fromBase64('te6cckEBAQEAFAAAJIIBni268otwcIsQgO1E0NTUMH8rSE0=');

export type JettonMasterConfig = {
    content: Cell;
};

export function jettonMasterConfigToCell(config: JettonMasterConfig): Cell {
    return beginCell()
        .storeRef(config.content)
        .storeRef(walletCode)
        .endCell();
}

export class JettonMaster implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new JettonMaster(address);
    }

    static createFromConfig(config: JettonMasterConfig, workchain = 0) {
        const data = jettonMasterConfigToCell(config);
        const init = { code: masterCode, data };
        return new JettonMaster(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            bounce: false,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getContent(provider: ContractProvider): Promise<Cell> {
        const result = (await provider.get('get_jetton_data', [])).stack;
        result.skip(3);
        return result.readCell();
    }

    async getWalletCode(provider: ContractProvider): Promise<Cell> {
        const result = (await provider.get('get_jetton_data', [])).stack;
        result.skip(4);
        return result.readCell();
    }
}
