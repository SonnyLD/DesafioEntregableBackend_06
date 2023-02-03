import ProductModel from "../dao/models/products.models.js";

class ProductService {

  async createProduct(data) {
    try {
        const newProduct = await ProductModel.create(data);
        return newProduct;
    } catch (error) {
        throw new Error(error.message)
    }
}

async getProducts(query) {
    try {
        const limit = query? Number(query) : 0;
        const products = await ProductModel.find({deleted: { $exists: false }}).limit(limit).lean();
        return products;
    } catch (error) {
        throw new Error(error.message)
    }
}

async getProduct(idProduct) {
    try {
        const product = await ProductModel.findById(idProduct).lean();
        return product;
    } catch (error) {
        throw new Error(error.message)
    }
}

async updateProduct(idProduct, data) {
    try {
        console.log(data);
        const updatedProduct = await ProductModel.findByIdAndUpdate(idProduct, data, {new: true}).lean();
        return updatedProduct;
    } catch (error) {
        throw new Error(error.message)
    }
}

async deleteProduct(idProduct) {
    try {
        await ProductModel.deleteById(idProduct);
    } catch (error) {
        throw new Error(error.message)
    }
}
}

const productService = new ProductService();
export default productService;