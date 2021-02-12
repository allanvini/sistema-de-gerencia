import React , {Component} from 'react';
import './dashboardView.css';

import PedidoDeVendas from '../pedido-de-vendas/pedidoDeVendas';
import CadastraNovoProduto from '../cadastra-novo-produto/cadastraNovoProduto';
import VerPedidos from '../ver-pedidos/verPedidos'
import GerenciarProdutos from '../gerenciar-produtos/gerenciarProdutos';
import VisaoGeral from '../visao-geral/visaoGeral';
import VerBalancoMensal from '../ver-balanco-mensal/verBalancoMensal';

class dashboardView extends Component{

    constructor(props){
        super(props);
        this.state = {
            selectedScreen: this.props.selectedScreen
        };
    }

    renderSwitch(param){
        switch(param){
            case 1 :
                return <VisaoGeral></VisaoGeral>;

            case 2 :
                return <VerPedidos></VerPedidos>;
                
            case 3:
                return <PedidoDeVendas></PedidoDeVendas>;

            case 4:
                return <GerenciarProdutos></GerenciarProdutos>;
            
            case 5:
                return <CadastraNovoProduto></CadastraNovoProduto>;

            case 6:
                return <VerBalancoMensal></VerBalancoMensal>;
        }
    }

    render(){
        return(
            <div className="main-container">
                {this.renderSwitch(this.props.selectedScreen)}
            </div>
        )
    }
}

export default dashboardView;
