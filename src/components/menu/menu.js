import React , {Component} from 'react';
import './menu.css'

import FirebaseControllerFunctions from '../../controller/firebaseControllers/firebaseController'

class Menu extends Component{
    constructor(props){
        super(props);
        this.state = { }
    }

    render(){
        return(
            <div className="menu-container">
                <h1 className="menu-header">Dashboard</h1>
                <button onClick={()=>{this.props.setScreen(1)}} className="menu-button">Visão geral</button>
                <button onClick={()=>{this.props.setScreen(2)}} className="menu-button">Ver meus pedidos de venda</button>
                <button onClick={()=>{this.props.setScreen(3)}} className="menu-button">Fazer novo pedido de venda</button>
                <button onClick={()=>{this.props.setScreen(4)}} className="menu-button">Gerenciar produtos</button>
                <button onClick={()=>{this.props.setScreen(5)}} className="menu-button">cadastrar produto</button>
                <button onClick={()=>{this.props.setScreen(6)}} className="menu-button">Ver balanço mensal</button>
                <button onClick={()=>{this.props.logout()}} className="menu-button">Sair</button>
            </div>
        )
    }
}

export default Menu;