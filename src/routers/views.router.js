import { Router } from "express";
import CartModel from "../dao/models/carts.models.js";
import ProductModel from "../dao/models/products.models.js";


export const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
  const {page} = req.query
  const products = await ProductModel.paginate({},{limit: 3, page});
  res.json(products);
 
});

viewsRouter.get("/pagination",async (req, res) => {
  const { page } = req.query;
  const products = await ProductModel.paginate({}, { limit: 3, page, lean: true });
  console.log(products);
  res.render("pagination", {...products});

});

viewsRouter.get("/carts", async (req, res) => {
  const {page} = req.query
  const cart = await CartModel.paginate({},{limit: 3, page});
  res.json(cart);
 
});