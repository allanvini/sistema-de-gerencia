import React, {Component} from 'react';

import './verPedidos.css';
import ModalView from './modal/modalView';

import FirebaseControllerFunctions from '../../controller/firebaseControllers/firebaseController';

class VerPedidos extends Component{
    constructor(props){
        super(props);
        this.state = {
            cards: [],
            modalVisible: false,
            selectedSell: null,
            selectedView: 0,
            amountOfData: 5
        }

        this.closeModal = this.closeModal.bind(this);
        this.enableModal = this.enableModal.bind(this);
        this.refreshCards = this.refreshCards.bind(this);
    }

    componentDidMount(){
        this.refreshCards();
    }

    async refreshCards(){
        let state = this.state;
        state.cards = await FirebaseControllerFunctions.getSells(state.amountOfData);
        state.amountOfData *= 2;
        this.setState(state);
    }

    closeModal(){
        let state = this.state;
        state.modalVisible = false;
        state.selectedSell = null;
        this.setState(state);
        this.refreshCards();
    }

    enableModal(index){
        let state = this.state;
        state.selectedSell = state.cards[index];
        state.modalVisible = true;
        this.setState(state);
    }

    render(){
        return(
            <div className="sells-cards-container">
                <h1>Meus pedidos de venda</h1>
                <div className="grid-selection">
                    <button onClick={()=>{
                        let state = this.state;
                        state.selectedView = 1;
                        this.setState(state);
                    }} className="grid-selection-button">Ver pedidos finalizados</button>
                    <button onClick={()=>{
                        let state = this.state;
                        state.selectedView = 2;
                        this.setState(state);
                    }} className="grid-selection-button">Ver pedidos pendentes</button>
                </div>

                {this.state.selectedView == 2 &&
                    <div>
                        <p>Pedidos pendentes</p>
                        <div className="sells-cards">
                        {this.state.cards.map(element=>{
                            if(!element.status){
                                return(
                                    <div className="sells-card-container">
                                        <h2>{element.cliente}</h2>
                                        <span>id: {element.id}</span>
                                        <div className="sells-card-footer">
                                            <button className="card-footer-button" onClick={()=>{
                                                this.enableModal(this.state.cards.indexOf(element));
                                            }}>Abrir/Editar</button>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                        </div>
                    </div>
                }

                {this.state.selectedView == 1 &&
                    <div>
                        <p>Pedidos finalizados</p>
                        <div className="sells-cards">
                        {this.state.cards.map(element=>{
                                if(element.status){
                                    return(
                                        <div className="sells-card-container">
                                            <h2>{element.cliente}</h2>
                                            <span>id: {element.id}</span>
                                            <div className="sells-card-footer">
                                                <button className="card-footer-button" onClick={()=>{
                                                    this.enableModal(this.state.cards.indexOf(element));
                                                }}>Abrir</button>
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                }
                {this.state.modalVisible ? <ModalView selectedSell={this.state.selectedSell} close={this.closeModal}></ModalView> : null}
            </div>
        )
    }
}

export default VerPedidos;
