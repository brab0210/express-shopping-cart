const {Product} = require('../database/models');
module.exports = {
    home: async (req, res) => {
        try {
            const products = await Product.findAll();
            res.render('index', {
                title: 'Home',
                products
            });    
        } catch (error) {
            res.send(error);
        }
    },
    addCart: async (req, res) => {
        try {
            const {id,quantity} = req.body;
            const product = await Product.findByPk(id);
            if(!req.session.cart){
                req.session.cart = [];
            }
            const cart = req.session.cart;
            const productExist = cart.find(item => item.id == id);

            if(productExist){
               req.session.cart = cart.map(item => {
                     if(item.id == id){
                            item.quantity += parseInt(quantity);
                            item.subtotal= product.price * item.quantity;
                        }
                        return item;
                });
            }else{
                req.session.cart.push({
                    id:product.id,
                    name:product.name,
                    price:product.price,
                    quantity:parseInt(quantity),
                    subtotal: product.price * parseInt(quantity)
                });
            }
            res.redirect('/');
        } catch (error) {
            res.send(error);
        }
    },
    deleteCart: async (req, res) => {
        try {
            const {id} = req.body;
            const cart = req.session.cart;
            const productExist = cart.find(item => item.id == id);
            if(productExist && productExist.quantity > 1){
                req.session.cart = cart.map(item => {
                    if(item.id == id){
                        item.quantity -= 1;
                        item.subtotal= productExist.price * item.quantity;
                    }
                    return item;
                });
            }else{
                req.session.cart = cart.filter(item => item.id != id);
            }
            res.redirect('/');
        } catch (error) {
            res.send(error);
        }
    }

};