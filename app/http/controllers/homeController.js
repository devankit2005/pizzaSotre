const Menu = require("../../models/menu");

const pizzaMenus = [
  {
    _id: {
      $oid: "5eee651f739f8c674fd736ee",
    },
    name: "Margherita",
    image: "pizza.png",
    price: "250",
    size: "small",
  },
  {
    _id: {
      $oid: "5eee6671a27a66807cf2bea3",
    },
    name: "Marinara",
    image: "pizza.png",
    price: "300",
    size: "medium",
  },
  {
    _id: {
      $oid: "5eee6692a27a66807cf2bea4",
    },
    name: "Carbonara",
    image: "pizza.png",
    price: "200",
    size: "small",
  },
  {
    _id: {
      $oid: "5eee66a5a27a66807cf2bea5",
    },
    name: "Americana",
    image: "pizza.png",
    price: "500",
    size: "large",
  },
  {
    _id: {
      $oid: "5eee66c4a27a66807cf2bea6",
    },
    name: "Chicken Mushroom",
    image: "pizza.png",
    price: "350",
    size: "medium",
  },
  {
    _id: {
      $oid: "5eee66cfa27a66807cf2bea7",
    },
    name: "Paneer pizza",
    image: "pizza.png",
    price: "200",
    size: "small",
  },
  {
    _id: {
      $oid: "5eee66eea27a66807cf2bea8",
    },
    name: "Vegies pizza",
    image: "pizza.png",
    price: "600",
    size: "large",
  },
  {
    _id: {
      $oid: "5eee6717a27a66807cf2bea9",
    },
    name: "Pepperoni",
    image: "pizza.png",
    price: "500",
    size: "medium",
  },
];

const storePizzaItems = async (res, pizzaMenusArray) => {
  pizzaMenusArray &&
    pizzaMenusArray.forEach(async (pizza) => {
      const menu = await new Menu(pizza);
      try {
        await menu.save();
      } catch (error) {
        req.flash("error", "Something want wrong ");
        return res.redirect("/cart");
      }
    });

  const pizzas = await Menu.find();
  res.render("home", { pizzas });
};

const homeController = () => {
  return {
    async index(req, res) {
      const pizzas = await Menu.find();
      if (!pizzas) {
        storePizzaItems(res, pizzaMenus);
      } else {
        res.render("home", { pizzas });
      }
      // return res.json(pizzas);
    },
  };
};

module.exports = homeController;
