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
    //         console.log("Transfer envet ??????");
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
    //         console.log("Approval event ??????");
    //     } else {
    //         console.log(error)
    //     }
    // }

    render() {
        return(
            <div>
                <div>
                    ??? ?????? <br/>
                    ?????? : {this.state.address} <br />
                    TES ?????? : {this.state.TesBalance} TES<br />
                    ETH ?????? : {this.state.EthBalance} ETH<br />
                </div>
                <br />
                <div>
                    ???????????? <br />
                    ?????? : <input placeholder="????????? ????????? ??????????????????." value={this.state.sendAmount} onChange={e => this.handleAmountChange(e)}/>  TES <br />
                    ?????? : <input placeholder="?????? ????????? ??????????????????." value={this.state.sendAddress} onChange={e => this.handleAddressChange(e)}/> <br />
                    <button onClick={this.handleTransferTES}>
                        ????????????
                    </button>
                </div>
                <br />
                <div>
                    ?????? ?????? <br />
                    <ul>
                    {this.state.txList.map((key, idx) => {
                        return(
                            <li> {idx+1} <br />
                                    ?????? ??????: {key.from} <br />
                                    ?????? ?????? : {key.to} <br />
                                    ?????? ?????? : {key.amount.c[0] * 0.01} TES</li>
                        )
                    })}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Front;