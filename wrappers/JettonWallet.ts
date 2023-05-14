import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

const code = Cell.fromBase64('te6cckEBAQEAFAAAJIIBewK68ovtRND6APpA+kDUMLRwCU0=');

export type JettonWalletConfig = {
    owner: Address;
    balance: bigint;
    master: Address;
};

export function jettonWalletConfigToCell(config: JettonWalletConfig): Cell {
    return beginCell()
        .storeCoins(config.balance)
        .storeAddress(config.owner)
        .storeAddress(config.master)
        .storeRef(code)
        .endCell();
}

export class JettonWallet implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new JettonWallet(address);
    }

    static createFromConfig(config: JettonWalletConfig, workchain = 0) {
        const data = jettonWalletConfigToCell(config);
        const init = { code, data };
        return new JettonWallet(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            bounce: false,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getOwner(provider: ContractProvider): Promise<Address> {
        const result = (await provider.get('get_wallet_data', [])).stack;
        result.skip(1);
        return result.readAddress();
    }

    async getBalance(provider: ContractProvider): Promise<bigint> {
        const result = (await provider.get('get_wallet_data', [])).stack;
        return result.readBigNumber();
    }

    async getMaster(provider: ContractProvider): Promise<Address> {
        const result = (await provider.get('get_wallet_data', [])).stack;
        result.skip(2);
        return result.readAddress();
    }
}
