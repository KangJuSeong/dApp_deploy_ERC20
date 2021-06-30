import React, {Component} from "react";
import getWeb3 from './getWeb3';
import truffleContract from "truffle-contract";
import TesCoin from './contracts/TESCoin.json';


class Front extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: null,
            accounts: null,
            contract: null,
            address: "",
            TesBalance: null,
            EthBalance: null,
            sendAmount: "",
            sendAddress: "",
            txList: [],
        }
    }

    componentDidMount = async () => {
        try{
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const Contract = truffleContract(TesCoin);
            Contract.setProvider(web3.currentProvider);
            const instance = await Contract.deployed();
            this.setState({web3, accounts, contract: instance, address: String(accounts[0])});
            await instance.balanceOf(accounts[0]).then((balance) => {
                this.setState({TesBalance: balance.c[0] * 0.01});
            })
            await web3.eth.getBalance(accounts[0]).then((balance) => {
                this.setState({EthBalance: balance * 0.000000000000000001});
            });
            // await instance.Transfer().watch((error, result) => this.watchTransfer(error, result));
            // await instance.Approval().watch((error, result) => this.watchApproval(error, result));
            // let {address, privateKey} = await web3.eth.accounts.create();
            // console.log(address, privateKey);
            console.log(instance.address);
        } catch (error) {
            alert("Failed to load web3, accounts, or contract. Check console for details.");
            console.log(error);
        }
    }

    handleAmountChange = (e) => {
        this.setState({sendAmount: e.target.value});
    };
    
    handleAddressChange = (e) => {
        this.setState({sendAddress: e.target.value});
    };

    handleTransferTES = async () => {
        const {contract} = this.state;
        const amount = Number(this.state.sendAmount) * 100;
        try {
            var test = await contract.transfer(this.state.sendAddress);
            alert(test);
        } catch(e) {
            console.log(e);
        }
        this.setState({sendAmount: "", sendAddress: ""});
    };

    dispalyTxList = async () => {
        const {contract} = this.state;
        
    };

    // watchTransfer = async (error, result) => {
    //     if(!error) {
    //         console.log("Transfer envet 발생");
    //         const {web3, contract, accounts} = this.state;
    //         const tx = {from: result.args.from, to: result.args.to, amount: result.args.tokens};
    //         this.setState({txList: this.state.txList.concat(tx)});
    //         await contract.balanceOf(accounts[0]).then((balance) => {
    //             this.setState({TesBalance: balance.c[0] * 0.01});
    //         })
    //         await web3.eth.getBalance(accounts[0]).then((balance) => {
    //             this.setState({EthBalance: balance * 0.000000000000000001});
    //         });
    //     } else {
    //         console.log(error);
    //     }
    // };

    // watchApproval = (error, result) => {
    //     if(!error) {
    //         console.log("Approval event 발생");
    //     } else {
    //         console.log(error)
    //     }
    // }

    render() {
        return(
            <div>
                <div>
                    내 지갑 <br/>
                    주소 : {this.state.address} <br />
                    TES 잔액 : {this.state.TesBalance} TES<br />
                    ETH 잔액 : {this.state.EthBalance} ETH<br />
                </div>
                <br />
                <div>
                    송금하기 <br />
                    금액 : <input placeholder="송금할 금액을 입력해주세요." value={this.state.sendAmount} onChange={e => this.handleAmountChange(e)}/>  TES <br />
                    주소 : <input placeholder="받는 주소를 입력해주세요." value={this.state.sendAddress} onChange={e => this.handleAddressChange(e)}/> <br />
                    <button onClick={this.handleTransferTES}>
                        송금하기
                    </button>
                </div>
                <br />
                <div>
                    거래 내역 <br />
                    <ul>
                    {this.state.txList.map((key, idx) => {
                        return(
                            <li> {idx+1} <br />
                                    보낸 주소: {key.from} <br />
                                    받은 주소 : {key.to} <br />
                                    보낸 금액 : {key.amount.c[0] * 0.01} TES</li>
                        )
                    })}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Front;