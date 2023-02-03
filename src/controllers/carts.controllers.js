import { STATUS } from "../constant/constant.js";
import cartServices from "../services/carts.services.js";


export async function getCart(req, res) {
  try {
    const { idCart } = req.params;
    const response = await cartServices.getCart(idCart);
    res.json({
      cart: response,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

export async function createCart(req, res) {
  try {
    const cartData = req.body;
        const newCart = await cartServices.createCart(cartData);
        res.status(201).json({
            succees: true,
            message: `${
                newCart.Products.length > 0 ? `New cart created with ${newCart.Products.length} products.` : `New empty cart successfully created.`
            } New cart's ID is ${newCart._id}.`,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

export async function addProductToCart(req, res) {
  try {
    const { idCart, idProduct, quantity } = req.params;
    if (quantity <= 0) {
        res.status(400).json({
            success: false,
            message: `Invalid quantity. Must be a positive integer.`
        });
    }
    const cart = await cartServices.addProductToCart(idCart, idProduct, Number(quantity));
    if (cart) {
        res.status(200).json({
            success: true,
            message: `Product ${idProduct} added to cart ${cart._id}`,
            data: cart
        });
    } else {
        res.status(404).json({
            success: false,
            message: `Product ${idProduct} not found.`
        });
    }
} catch (error) {
    res.status(500).json({ Error: error.message });
}
}
export async function deleteCart(req, res) {
  try {
    const { idCart } = req.params;
    await cartServices.deleteCart(idCart);
    res.status(201).json({
      message: "Cart borrado correctamente",
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
export async function deleteProductFromCart(req, res) {
  try {
      const { idCart, idProduct } = req.params;
      const cart = await cartServices.deleteProductFromCart(idCart, idProduct);
      if (cart) {
          res.status(200).json({
              success: true,
              message: `Product ${idProduct} deleted from cart ${idCart}`,
              data: cart
          });
      } else {
          res.status(404).json({
              success: false,
              message: `Product ${idProduct} not found in cart ${idCart}. Or cart ${idCart} not found.`
          });
      }
  } catch (error) {
      res.status(500).json({ Error: error.message });
  }
}
