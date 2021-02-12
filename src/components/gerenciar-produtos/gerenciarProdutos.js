import React, {Component} from 'react';

import './gerenciarProdutos.css';

import FirebaseControllerFunctions from '../../controller/firebaseControllers/firebaseController';

class GerenciarProdutos extends Component{
    constructor(props){
        super(props);
        this.state = {
            products: []
        }

        this.updateProducts = this.updateProducts.bind(this);
    }

    componentDidMount(){
        this.updateProducts();
    }

    async updateProducts(){
        let state = this.state;
        state.products = await FirebaseControllerFunctions.getProducts();
        this.setState(state);
    }

    render(){
        return(
            <div className="product-management-container">
                <h1>Gerenciar produtos</h1>
                <div className="products-cards-grid">
                    {this.state.products.map(element=>(
                        <div className="product-card">
                            <h4>{element.nome}</h4>
                            <button onClick={async ()=>{
                                await FirebaseControllerFunctions.deleteProductByID(element.id);
                                alert('Produto removido com sucesso!');
                                this.updateProducts();
                            }} className="product-card-delete-button">Excluir</button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default GerenciarProdutos;