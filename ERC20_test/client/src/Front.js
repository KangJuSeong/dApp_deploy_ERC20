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
            balance: null,
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
                this.setState({balance: balance.c[0] * 0.01});
            })
            console.log(instance.address);
        } catch (error) {
            alert("Failed to load web3, accounts, or contract. Check console for details.");
            console.log(error);
        }
    }

    render() {
        return(
            <div>
                <div>
                    내 지갑 <br/>
                    주소 : {this.state.address} <br/>
                    잔액 : {this.state.balance} <br/>
                </div>
                <br/>
                <div>
                    송금하기 <br/>
                    <button>
                        송금하기
                    </button>
                </div>
            </div>
        )
    }
}

export default Front;