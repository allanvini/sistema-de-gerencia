import React, {Component} from 'react';
import './modalView.css';

import FirebaseControllerFunctions from '../../../controller/firebaseControllers/firebaseController';

class ModalView extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: {
                ...this.props.selectedSell
            },
            newItem:{
                tipo: '',
                quantidade: 0,
                valorUnitario: 0,
                valorTotal: 0,
                custoTotal: 0
            },
            productList: []
        }

        this.deleteItem = this.deleteItem.bind(this);
        this.setValorTotal = this.setValorTotal.bind(this);
        this.changeData =this.changeData.bind(this);
        this.changeNewItem = this.changeNewItem.bind(this);
        this.setObservacao = this.setObservacao.bind(this);
    }

    componentDidMount(){
        this.setProductOptions();
        console.log(this.state.data);
    }

    setObservacao(event){
        let state = this.state;
        state.data.observacao = event.target.value;
        this.setState(state);
    }

    async setProductOptions(){
        let state = this.state;
        state.productList = await FirebaseControllerFunctions.getProducts();
        this.setState(state);
    }

    deleteItem(index){
        let state = this.state;
        state.data.itens.splice(index,1);
    }

    setValorTotal(){
        let state = this.state;
        let valorTotal = 0;
        state.data.itens.forEach(element=>{
            valorTotal += element.valorTotal;
        })
        state.data.valorTotal = valorTotal;
        this.setState(state);
    }

    changeData(event){
        let state = this.state;
        state.data[event.target.name] = event.target.value;
        this.setState(state);
    }

    changeNewItem(event){
        let state = this.state;
        state.newItem[event.target.name] = event.target.value;
        state.newItem.valorTotal = state.newItem.quantidade * state.newItem.valorUnitario;
        this.setState(state);
    }

    addNewItem(){
        let state = this.state;
        let productIndex = this.findProductIndex();
        let custo = state.newItem.quantidade * state.productList[productIndex].custoBase;
        console.log(state);
        state.newItem.custoTotal = custo;
        state.data.custoTotal+=custo;
        state.data.itens.push(this.state.newItem);
        state.newItem = {
            tipo: '',
            quantidade: 0,
            valorUnitario: 0,
            valorTotal: 0,
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


    render(){
        return(
            <div className="sells-modal">
                <div className="content">
                    <div className="modal-header">
                        <span><strong>Pedido: {this.state.data.id}</strong></span>
                        <span>Data: {this.state.data.mes}/{this.state.data.ano}</span>
                    </div>
                    <div>

                    </div>
                    <div className="modal-form">
                        <p className="modal-field-name">Cliente: </p>
                        <input name="cliente" className="modal-input" value={this.state.data.cliente} onChange={this.changeData}></input>
                    </div>

                    <p className="modal-field-name">Adicionar novo item:</p>
                    <div className="modal-form">
                        <select name="tipo" onChange={this.changeNewItem} value={this.state.newItem.tipo} className="new-item-select">
                            <option>Selecionar</option>
                            {this.state.productList.map(element=>
                                <option>{element.id}</option>    
                            )}
                        </select>
                        <span>Quantidade </span>
                        <input name="quantidade" className="modal-input" onChange={this.changeNewItem} value={this.state.newItem.quantidade}></input>
                        <span>Valor Unitário </span>
                        <input name="valorUnitario" className="modal-input" onChange={this.changeNewItem} value={this.state.newItem.valorUnitario}></input>
                        <button className="add-item-button" onClick={()=>{this.addNewItem(); this.setValorTotal()}}>Adicionar</button>
                    </div>


                    <ul className="sell-items-list-container">
                        <h3>Lista de itens:</h3>
                        {this.state.data.itens.map(element=>(
                            <div className="sell-item-list" key={this.state.data.itens.indexOf(element)}>
                                <li>
                                    <span>Item: <b>{element.tipo}</b> // Quantidade: <b>{element.quantidade}</b> // Valor Unitário: <b>R$ {element.valorUnitario}</b> // Total: <b>R$ {element.valorTotal}</b></span>
                                </li>
                                <button onClick={()=>{this.deleteItem(this.state.data.itens.indexOf(element)); this.setValorTotal()}} className="delete-item-button">Excluir Item</button>
                            </div>
                        ))}
                    </ul>

                    <div className="modal-form">
                        <h3>Valor Total do pedido: R$ {this.state.data.valorTotal}</h3>
                    </div>

                    <div className="modal-form">
                        <span>Observações: </span>
                        <textarea className="modal-sell-obs" value={this.state.data.observacao} onChange={this.setObservacao}></textarea>
                    </div>
                    
                    

                    <div className="modal-buttons-container">
                        <button className="modal-option-button" onClick={async()=>{
                            await FirebaseControllerFunctions.updateSellByID(this.state.data.id,this.state.data);
                            this.props.close();
                        }}>Salvar alterações</button>
                        <button className="modal-option-button" onClick={async()=>{
                            let state = this.state;
                            state.data.status = true;
                            this.setState(state);
                            await FirebaseControllerFunctions.updateSellByID(this.state.data.id,this.state.data);
                            this.props.close();
                        }}>Salvar e marcar como finalizado</button>
                        <button className="modal-option-button" onClick={()=>this.props.close()}>Fechar</button>
                        <button className="modal-close-option-button" onClick={async ()=>{
                            await FirebaseControllerFunctions.deleteSellByID(this.state.data.id);
                            this.props.close();
                        }}>Excluir</button>
                    </div>
                    
                </div>
                
            </div>
        )
    }
}

export default ModalView;