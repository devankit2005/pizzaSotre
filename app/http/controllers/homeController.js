const Menu = require("../../models/menu")


const homeController = () => {

    return {
        async index(req, res){
            const pizzas = await Menu.find()            
            res.render('home',{pizzas})
        }
    }
}

module.exports = homeController