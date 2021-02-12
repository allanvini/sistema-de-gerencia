import React, {Component} from 'react';

import './cadastraNovoProduto.css'

import FirebaseControllerFunctions from '../../controller/firebaseControllers/firebaseController';

class CadastraNovoProduto extends Component{

    constructor(props){
        super(props);
        this.state = {
            nome: '',
            custoBase: ''
        }

        this.updateValues = this.updateValues.bind(this);
        this.clearState = this.clearState.bind(this);
    }

    updateValues(event){
        let state = this.state;
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    clearState(){
        this.setState({
            nome: '',
            custoBase: ''
        })
    }

    render(){
        return(
            <div className="new-product-container">
                <div className="box">
                    <h1>Cadastro de novo produto</h1>

                    <span className="new-product-item">Nome do produto</span>
                    <input name="nome" className="new-product-item new-product-input" placeholder="Ex: Caneca" value={this.state.nome} onChange={this.updateValues}></input>

                    <span className="new-product-item">Custo base para calculo</span>
                    <input name="custoBase" className="new-product-item new-product-input" placeholder="R$ 10.00" value={this.state.custoBase} onChange={this.updateValues}></input>
                    
                    <button className="new-product-item new-product-button" onClick={
                        async ()=>{
                            await FirebaseControllerFunctions.writeNewProduct(this.state);
                            alert('Produto cadastrado com sucesso!');
                            this.clearState();
                        }
                    }>Cadastrar</button>

                </div>
            </div>
        )
    }
}

export default CadastraNovoProduto;