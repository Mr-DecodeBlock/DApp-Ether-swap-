import React, { Component } from 'react'
import Web3 from 'web3'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'
import EthSwap from '../abis/EthSwap.json'
import Token from '../abis/Token.json'



class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    console.log('Window. web3',window.web3)
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    console.log(accounts[0])
    this.setState({ account: accounts[0] })
    //console.log(this.state.account)
    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance })
    console.log('ethbalance',this.state.ethBalance)

    //load Token 
    const networkId = await web3.eth.net.getId()
    const tokenData =  Token.networks[networkId]
    if (tokenData) {
      
      //const address = Token.networks['5777'].address
      const token = new web3.eth.Contract(Token.abi,  tokenData.address)
      console.log(token)
      this.setState({ token })
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      console.log('Token balance:', tokenBalance.toString())  //toString()

      this.setState({ tokenBalance: tokenBalance.toString() })
    }else {
      window.alert('Token contract not deployed to detected network')
    }

     //load EthSwap 
   
     const ethSwapData =  EthSwap.networks[networkId]
     if (ethSwapData) {
       
       //const address = Token.networks['5777'].address
       const ethSwap = new web3.eth.Contract(EthSwap.abi,  ethSwapData.address)
       console.log('ethSwap', ethSwap)
        this.setState({ ethSwap })
      
       //console.log('Token balance:', tokenBalance)  //toString()
 
    
     }else {
       window.alert('EthSwap contract not deployed to detected network')
     }
    
     console.log('ethSwap', this.state.ethSwap)

     this.setState({ loading: false })

  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. you should consider trying MetaMask')
    }
  }

  buyTokens = (etherAmount) => {
    this.setState({ loading: true })
    this.state.ethSwap.methods.buyTokens().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.ethSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = { 
      account: '',
      token: {},
      ethSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true
     }
   
  }

  render() {
    let content
    let loading = true
    if(this.state.loading) {
      content = <a id='loader' className='text-center text-muted'>Loading...</a>
    } else {
      content = <Main 
        ethBalance={this.state.ethBalance} 
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens} />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '600px'}}>
              <div className="content mr-auto ml-auto">
                <a
                  href="https://www.truefeedback.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  
                </a>
             
                {content}
               
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
