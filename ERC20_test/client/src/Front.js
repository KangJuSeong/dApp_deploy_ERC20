import React, {Component} from "react";
import getWeb3 from './getWeb3';
import truffleContract from "truffle-contract";
import TesToken from './contracts/TESToken.json';


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
        }
    }

    componentDidMount = async () => {
        try{
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const Contract = truffleContract(TesToken);
            Contract.setProvider(web3.currentProvider);
            const instance = await Contract.deployed();
            this.setState({web3, accounts, contract: instance, address: String(accounts[0])});
            await instance.balanceOf(String(accounts[0])).then((balance) => {
                this.setState({TesBalance: balance.c[0] * 0.01});
            })
            await web3.eth.getBalance(String(accounts[0])).then((balance) => {
                this.setState({EthBalance: balance * 0.000000000000000001});
            });
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
        await contract.transfer(this.state.sendAddress, amount).then((result) => {
            alert(String(result));
        });
        this.setState({sendAmount: "", sendAddress: ""});
    };

    dispalyTransactionList = async () => {
        const {contract} = this.state;
        await contract.allowance(this.state.address, this.state.sendAddress).then((result) => {
            alert(String(result));
        });
    };

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
                    거래 내역
                </div>
            </div>
        )
    }
}

export default Front;