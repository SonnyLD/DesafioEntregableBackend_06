import productService from "../services/products.services.js";
import { STATUS } from "../constant/constant.js";

export async function getProduct(req, res) {
  try {
    const { idProduct } = req.params;
    const response = await productService.getProduct(idProduct);
    res.json({
      product: response,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

export async function getProducts(req, res) {
  try {
    const response = await productService.getProducts();
    res.json({
      product: response,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

export async function createProduct(req, res) {
  try {
    const { body } = req;
    const response = await productService.createProduct(body);
    res.status(201).json({
      product: response,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
export async function updateProduct(req, res) {
  try {
    const { idProduct } = req.params;
    const { body } = req;
    const response = await productService.updateProduct(idProduct, body);
    res.status(201).json({
      product: response,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
export async function deleteProduct(req, res) {
  try {
    const { idProduct } = req.params;
    await productService.deleteProduct(idProduct);
    res.status(201).json({
      message: `Product (ID = ${idProduct})Producto borrado correctamente`,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}