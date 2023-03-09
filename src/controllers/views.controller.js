import productService from "../services/products.services.js";
import userServices from "../services/user.service.js";

export async function login(req, res) { 
  try {

      if (!req.session.logged) {
          return res.status(200).render('login');
      }
      
      return res.status(200).redirect('/products');

  } catch (error) {
      res.status(500).json({ Error: error.message });
  }
}
export async function getChat(req, res) {
  try {

      const user = req.session.user;

      res.status(200).render('chat', {user})
  } catch (error) {
      res.status(500).json({ Error: error.message });
  }
}
export async function getCart(req, res) {
  try {

      const userMail = req.session.user.email;
      const user = await userServices.getUser(userMail);
      delete user.password

      if (user) {
          res.status(200).render('cart', { user })
      }
      else {
          res.status(404).json({ Error: "Cart not found" })
      };
  } catch (error) {
      res.status(500).json({ Error: error.message });
  }
}
export async function registerUser(req, res) {
  try {
      res.status(200).render('register');
  } catch (error) {
      res.status(500).json({ Error: error.message });
  }
}
export async function getProducts(req, res) {
  try {
      const {limit, sort, page, category} = req.query;
      const options = {
          limit: limit? Number(limit) : 10,
          page: page? Number(page) : 1,
          ...(sort && { sort: {price: sort} }),
          ...(category && { category }),
          lean: true
      }

      let query = {};
      if (category) query = {category: category};

      const paginatedData = await productService.getProducts(query, options);

      const user = req.session.user;

      if (paginatedData) {
          res.status(200).render('products', {...paginatedData, user})
      }
      else {
          res.status(404).json({ Error: "Products not found" })
      };
  } catch (error) {
      res.status(500).json({ Error: error.message });
  }
}
export async function getUserCenter(req, res) {
  try {
      const user = req.session.user;

      res.status(200).render('userCenter', { user })
  } catch (error) {
      res.status(500).json({ Error: error.message });
  }
}

export async function getAdminCenter(req, res) {
  try {
      const user = req.session.user;

      if (user.role !== "admin") {
          return res.status(401).json({ Error: "Unauthorized" })
      }
      res.status(200).render('admin', { user })
  } catch (error) {
      res.status(500).json({ Error: error.message });
  }
}

export async function getUpdateProduct(req, res) {
  try {
      const idProduct = req.query.idProductPut;

      const product = await productService.getProduct(idProduct);

      const user = req.session.user;

      if (user.role !== "admin") {
          return res.status(401).json({ Error: "Unauthorized" })
      }

      if (product) {
          return res.status(200).render('updateProduct', {...product, idProduct, user})
      }
      
      res.status(404).json({ Error: "Product not found" });

  } catch (error) {
      res.status(500).json({ Error: error.message });
  }
}