import firebase from 'firebase';
import firebaseConfig from '../../auth/config';

require('firebase/firestore');

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();

let FirebaseControllerFunctions = {

    firebaseLogin: async (email, password) => {
        return await firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                return true;
            })
            .catch((error) => {
                return false;
            });
    },

    writeSellRequest: async (data) => {

        const now = new Date();

        let polishedSellObject = {
            cliente: data.cliente,
            itens: data.itens,
            valorTotal: data.valorTotal,
            custoTotal: data.custoTotal,
            observacao: data.observacao,
            mes: now.getMonth()+1,
            ano: now.getFullYear(),
            status: data.status
        }

        await db.collection('vendas').add(polishedSellObject)
        .then(function(docRef) {
            return true;
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
            return false;
        });
    },

    getSellsByYearAndMonth: async (year,month) =>{

        const sellsRef = db.collection('vendas');
        const snapshot = await sellsRef.get();

        let sells = [];

        snapshot.docs.forEach(doc=>{
            if(doc.data().ano == year && doc.data().mes == month){
                sells.push({
                    id: doc.id,
                    ...doc.data()
                })
            }
        })

        return sells;
        
    },

    getSells: async (limit)=>{
        const sellsRef = db.collection('vendas');
        const snapshot = await sellsRef.limit(limit).get();

        let sells = [];

        snapshot.docs.forEach(doc=>{
            sells.push({
                id: doc.id,
                ...doc.data()
            })
        })

        return sells;
    },

    deleteSellByID: async(id)=>{
        await db.collection("vendas").doc(id).delete();
    },

    deleteProductByID: async(id)=>{
        await db.collection("produtos").doc(id).delete();
    },

    updateSellByID: async(id,data)=>{

        let polishedSellObject = {
            cliente: data.cliente,
            itens: data.itens,
            valorTotal: data.valorTotal,
            custoTotal: data.custoTotal,
            observacao: data.observacao,
            mes: data.mes,
            ano: data.ano,
            status: data.status
        }

        await db.collection('vendas').doc(id).set(polishedSellObject)
        .then(function(docRef) {
            return true;
        })
        .catch(function(error) {
            console.error("Error editing document: ", error);
            return false;
        });
    },

    writeNewProduct: async (product)=>{
        await db.collection('produtos').doc(product.nome).set(product)
        .then(function(docRef){
            return true;
        })
        .catch(function(error){
            console.log("Error adding document: ", error);
            return false;
        })
    },

    getProducts: async()=>{
        let products = [];

        const productsRef = db.collection('produtos');
        const snapshot = await productsRef.get();

        snapshot.docs.forEach(doc=>{
            products.push({
                id: doc.id,
                ...doc.data()
            })
        })

        return products;
    },

}

export default FirebaseControllerFunctions;
