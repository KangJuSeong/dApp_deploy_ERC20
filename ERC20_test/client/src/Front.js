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
        }
    }

    componentDidMount = async () => {
        try{
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const Contract = truffleContract(TesToken);
            Contract.setProvider(web3.currentProvider);
            const instance = await Contract.deployed();
            this.setState({web3, accounts, contract: instance});
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
                    내 지갑
                </div>
                <div>
                    송금하기
                </div>
            </div>
        )
    }
}

export default Front;