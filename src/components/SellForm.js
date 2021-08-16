import React, { Component } from 'react'


class SellForm extends Component {

    constructor(props) {
        super(props)
        this.state = { 
          output: '0'
         }

       
      }

  render() {
    return (
        <form className='mb-3' onSubmit={(event) => {
            event.preventDefault()
            let etherAmount
            etherAmount = this.input.value.toString()
            etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
            this.props.sellTokens(etherAmount)
            console.log('selling tokens...')
        }}>
            <div>
            <span className='float-left text-muted'>Input</span>
                <span className='float-right text-muted'>
                    Balance: {window.web3.utils.fromWei(this.props.tokenBalance, 'Ether')}
                    {/* Balance: 0 */}
                </span>
            </div>
            <div className='input-group mb-4'>
                <input 
                    type='text'
                    onChange={(event) =>{
                        const tokenAmount = this.input.value.toString()
                        this.setState({ 
                            output: tokenAmount / 15470
                         })
                         //console.log(this.state.output)
                    }}
                    ref={(input) =>{ this.input = input }}
                    className='form-control form-control-lg'
                    placeholder='0'
                    required />
                <div className='input-group-append'>
                    <div className='input-group-text'>
                        <img src={require("./logo.png")} height='32' alt='' />
                        &nbsp; TFB
                    </div>
                </div>
            </div>
            <div>
            <span className='float-left text-muted'>Output</span>
                <span className='float-right text-muted'>
                    Balance: {window.web3.utils.fromWei(this.props.ethBalance, 'Ether')}
                    
                   
                </span>
            </div>
            <div className='input-group mb-2'>
                <input type='text'
                    className='form-control form-control-lg'
                    placeholder='0'
                    value= {this.state.output}
                    disabled />
                <div className='input-group-append'>
                    <div className='input-group-text'>
                        <img src='https://cdn.iconscout.com/icon/free/png-256/ethereum-1-283135.png' height='32' alt='' />
                        &nbsp; ETH
                    </div>
                </div>
            </div>
            <div className='mb-5'>
                <span className='float-left text-muted'>Exchange Rate</span>
                <span className='float-right text-muted'>1 TFB = 0.000064641 ETH</span>
            </div>
            <button type='submit' className='btn btn-dark btn-block btn-lg'>SWAP!</button>
        </form>
        );
  }
}

export default SellForm;
