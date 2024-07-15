const {
    client,
    createTables,
    createProduct,
    createUser,
    fetchUsers,
    fetchProducts,
    createFavorite,
    fetchFavorites,
    destroyFavorites,
  } = require("./db.js");
  const express = require("express");
  const app = express();
  app.use(express.json());
  
  api.get("/api/users", async (req, res, next) => {
    try {
      res.send(await fetchUsers());
    } catch (error) {
      next(error);
    }
  });
  api.get("/api/products", async (req, res, next) => {
    try {
      res.send(await fetchProducts());
    } catch (error) {
      next(error);
    }
  });
  api.get("/api/users/:id/favorites", async (req, res, next) => {
    try {
      res.send(await fetchFavorites(req.params.id));
    } catch (error) {
      next(error);
    }
  });
  api.post("/api/users/:id/favorites", async (req, res, next) => {
    try {
      res.status(201).send(
        await createFavorite({
          user_id: req.params.id,
          product_id: req.body.product_id,
        })
      );
    } catch (error) {
      next(error);
    }
  });
  api.delete("/api/users/:userId/favorites/:id", async (req, res, next) => {
    try {
      await destroyFavorites({ user_id: req.params.userId, id: req.params.id });
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  });
  
  const init = async () => {
    await client.connect();
    console.log("connected to database");
    await createTables();
    console.log("created tables");
    const [alex, taylor, book, game] = await Promise.all([
      createUser({ username: "alex", password: "password" }),
      createUser({ username: "taylor", password: "password1" }),
      createProduct({ name: "book" }),
      createProduct({ name: "game" }),
    ]);
    console.log("users and products seeded");
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  };
  init();