import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2'

import './verBalancoMensal.css';

import FirebaseControllerFunctions from '../../controller/firebaseControllers/firebaseController';

class VerBalancoMensal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsList: [],
            sellsList: [],
            year: '',
            month: '',
            totalVendido: 0,
            custoTotal: 0,
            lucro: 0,
            vendasPorItem: []
        }

        this.getSells = this.getSells.bind(this);
        this.changeParams = this.changeParams.bind(this);
        this.setTotalCost = this.setTotalCost.bind(this);
        this.setTotalSell = this.setTotalSell.bind(this);
        this.setItemsModels = this.setItemsModels.bind(this);
        this.setProfit = this.setProfit.bind(this);
        this.updateState = this.updateState.bind(this);
        this.clearState = this.clearState.bind(this);
    }

    componentDidMount(){
        const now = new Date();
        let state = this.state;
        state.year = now.getFullYear();
        state.month = now.getMonth()+1;
        this.setState(state);
    }

    async getSells() {
        let state = this.state;
        state.sellsList = await FirebaseControllerFunctions.getSellsByYearAndMonth(this.state.year, this.state.month);
        this.setState(state);
    }

    setItemsModels() {
        let state = this.state;
        state.itemsList.forEach(element => {
            state.vendasPorItem.push({
                item: element.nome,
                vendidos: 0
            })
        })
    }

    countSellsByItems() {
        let state = this.state;
        state.vendasPorItem.forEach(item => {
            state.sellsList.forEach(sell => {
                sell.itens.forEach(sellItem => {
                    if (sellItem.tipo == item.item) {
                        state.vendasPorItem[state.vendasPorItem.indexOf(item)].vendidos = eval(`${sellItem.quantidade} + ${state.vendasPorItem[state.vendasPorItem.indexOf(item)].vendidos}`);
                    }
                })
            })
        })
    }

    changeParams(event) {
        let state = this.state;
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    setTotalSell() {
        let state = this.state;
        state.sellsList.forEach(element => {
            state.totalVendido += element.valorTotal;
        });
        this.setState(state);
    }

    setTotalCost() {
        let state = this.state;
        state.sellsList.forEach(sell => {
            state.custoTotal = state.custoTotal + sell.custoTotal;
        })
        this.setState(state);
    }

    setProfit() {
        let state = this.state;
        state.lucro = state.totalVendido - state.custoTotal;
        this.setState(state);
    }

    clearState() {
        let state = this.state;

        state.itemsList = [];
        state.sellsList = [];
        state.totalVendido = 0;
        state.custoTotal = 0;
        state.lucro = 0;
        state.vendasPorItem = [];
        this.setState(state);
    }

    async updateState() {
        this.clearState();
        let state = this.state;
        state.itemsList = await FirebaseControllerFunctions.getProducts();
        this.setState(state);
        await this.getSells();
        this.setItemsModels();
        this.setTotalSell();
        this.setTotalCost();
        this.countSellsByItems();
        this.setProfit();
    }

    getLabels() {
        let state = this.state;
        let labels = []
        state.vendasPorItem.forEach(element => {
            labels.push(element.item)
        })
        return labels;
    }

    getData() {
        let state = this.state;
        let data = []
        state.vendasPorItem.forEach(element => {
            data.push(element.vendidos)
        })
        return data;
    }

    generateRandomColor() {
        let state = this.state;
        let colorsArray = [];

        for (let color = 0; color < state.vendasPorItem.length; color++) {
            colorsArray.push(this.getRandomColor());
        }

        return colorsArray;

    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    render() {
        return (
            <div className="balance-container">
                <div className="params-container">
                    <span>Ano</span>
                    <input name="year" value={this.state.year} onChange={this.changeParams}></input>
                    <span>Mês</span>
                    <input name="month" value={this.state.month} onChange={this.changeParams}></input>
                </div>

                <button onClick={async () => {
                    await this.updateState();
                }} className="balance-button">Buscar dados</button>

                <h2>Dados mensais</h2>
                <div className="data-media-container">
                    <div className="sell-cost-profit-container">
                        <h3>Total vendido no mês: R$ {this.state.totalVendido}</h3>
                        <h4>Custo total do mês: R$ {this.state.custoTotal}</h4>
                        <h4>Lucro do mês: R$ {this.state.lucro}</h4>
                        <h4>Margem de lucro: {eval(`${this.state.lucro}/(${this.state.totalVendido}/100)`).toFixed(2)}%</h4>
                    </div>
                    <div className="sell-by-items-container">
                        <h3>Venda por itens neste mês</h3>

                        <Doughnut
                            data={{
                                labels: this.getLabels(),
                                datasets: [{
                                    data: this.getData(),
                                    backgroundColor: this.generateRandomColor(),
                                    borderColor: this.generateRandomColor(),
                                }]
                            }}
                            height={200}
                            width={500}
                            options={{
                                maintainAspectRatio: true
                            }}
                        />

                    </div>
                </div>

            </div>
        )
    }
}

export default VerBalancoMensal;