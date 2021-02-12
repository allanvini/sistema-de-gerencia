import React , {Component} from 'react';
import './pedidoDeVendas.css';

import FirebaseControllerFunctions from '../../controller/firebaseControllers/firebaseController';

class PedidoDeVendas extends Component{

    constructor(props){
        super(props);
        this.state = {
            cliente: '',
            itens: [],
            valorTotal: 0,
            custoTotal: 0,
            observacao: '',
            newItem:{
                tipo: '',
                quantidade: '',
                valorUnitario: '',
                valorTotal: '',
                custoTotal: 0
            },
            status: false,
            productList: []
        }

        this.setCliente = this.setCliente.bind(this);
        this.setItems = this.setItems.bind(this);
        this.setValorTotal = this.setValorTotal.bind(this);
        this.setObservacao = this.setObservacao.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.changeNewItem = this.changeNewItem.bind(this);
        this.setProductOptions = this.setProductOptions.bind(this);
        this.setCustoTotal = this.setCustoTotal.bind(this);
        this.findProductIndex = this.findProductIndex.bind(this);

    }

    componentDidMount(){
        this.setProductOptions();
    }

    async setProductOptions(){
        let state = this.state;
        state.productList = await FirebaseControllerFunctions.getProducts();
        this.setState(state);
    }

    setCliente(event){
        let state = this.state;
        state.cliente = event.target.value;
        this.setState(state);
    }

    setItems(item){
        let state = this.state;
        state.itens.push(item);
        this.setState(state);
    }

    setValorTotal(){
        let state = this.state;
        let valorTotal = 0;
        state.itens.forEach(element=>{
            valorTotal += element.valorTotal;
        })
        state.valorTotal = valorTotal;
        this.setState(state);
    }

    setCustoTotal(){
        let state = this.state;
        let custoTotal = 0;
        state.itens.forEach(element=>{
            custoTotal+=element.custoTotal;
        })
        state.custoTotal = custoTotal;
        this.setState(state);
    }

    setObservacao(event){
        let state = this.state;
        state.observacao = event.target.value;
        this.setState(state);
    }

    deleteItem(index){
        let state = this.state;
        state.itens.splice(index,1);
        this.setState(state);
    }

    changeNewItem(event){
        let state = this.state;
        state.newItem[event.target.name] = event.target.value;
        state.newItem.valorTotal = state.newItem.quantidade * state.newItem.valorUnitario;

        this.setState(state);
    }

    addItem(){
        let state = this.state;
        let productIndex = this.findProductIndex();
        let custo = state.newItem.quantidade * state.productList[productIndex].custoBase;
        state.newItem.custoTotal = custo;
        state.itens.push(state.newItem);
        state.newItem = {
            tipo: '',
            quantidade: '',
            valorUnitario: '',
            valorTotal: '',
            custoTotal: 0
        }
        this.setState(state);
    }

    findProductIndex(){
        let state = this.state;
        let productIndex;
        state.productList.forEach(element=>{
            if(element.id == state.newItem.tipo){
                productIndex = state.productList.indexOf(element);
            }
        })

        return productIndex;
    }

    cliearFields(){
        let state = {
            cliente: '',
            itens: [],
            valorTotal: 0,
            custoTotal: 0,
            observacao: '',
            newItem:{
                tipo: '',
                quantidade: '',
                valorUnitario: '',
                valorTotal: '',
                custoTotal: 0
            },
            status: false,
            productList: []
        }

        this.setState(state);
    }


    render(){
        return(
            <div className="new-sell">
                <h1>Novo pedido de venda</h1>
                <div className="new-sell-form">
                    <p>Cliente</p>
                    <input name="cliente" className="new-sell-input" onChange={this.setCliente} value={this.state.cliente}></input>
                    <p>Itens do pedido</p>
                    <div className="new-item-add-container">
                        <span>Item </span>
                        <select name="tipo" onChange={this.changeNewItem} value={this.state.newItem.tipo}>
                        <option>Selecionar</option>
                            {this.state.productList.map(element=>
                                <option>{element.id}</option>
                            )}
                        </select>
                        <span>Quantidade </span>
                        <input name="quantidade" className="new-sell-input" onChange={this.changeNewItem} value={this.state.newItem.quantidade}></input>
                        <span>Valor Unitário </span>
                        <input name="valorUnitario" className="new-sell-input" onChange={this.changeNewItem} value={this.state.newItem.valorUnitario}></input>
                        <button className="add-item-button" onClick={()=>{
                                this.addItem();
                                this.setValorTotal();
                                this.setCustoTotal();
                            }
                        }>Adicionar</button>
                    </div>
                    <ul className="new-sell-items-list-container">
                        <h3>Lista de itens:</h3>
                        
                        {this.state.itens.map(element=>(
                            <div className="sell-item" key={this.state.itens.indexOf(element)}>
                                <li>
                                    <span>Item: <b>{element.tipo}</b> // Quantidade: <b>{element.quantidade}</b> // Valor Unitário: <b>R$ {element.valorUnitario}</b> // Total: <b>R$ {element.valorTotal}</b></span>
                                </li>
                                <button onClick={()=>{this.deleteItem(this.state.itens.indexOf(element)); this.setValorTotal(); this.setCustoTotal()}} className="delete-item-button">Excluir Item</button>
                            </div>
                        ))}
                        

                    </ul>
                    <h5>Custo geral do pedido: R$ {this.state.custoTotal}</h5>
                    <h5>Lucro do pedido: R$ {(this.state.valorTotal)-(this.state.custoTotal)}</h5>
                    <h3>Valor total do pedido: R$ {this.state.valorTotal}</h3>
                </div>
                <span>Observações</span>
                <textarea className="sell-obs" name="observacao" value={this.state.observacao} onChange={this.setObservacao}></textarea>
                <button className="new-sell-finish-button" onClick={async ()=>{
                    if(!this.state.cliente || !this.state.itens){
                        alert('Por favor, preencha todos os campos para prosseguir');
                    } else {
                        await FirebaseControllerFunctions.writeSellRequest(this.state);
                        alert('Venda realizada com sucesso!');
                        this.cliearFields();
                    }
                    
                }}>Finalizar pedido!</button>
            </div>
        )
    }
}

export default PedidoDeVendas;
