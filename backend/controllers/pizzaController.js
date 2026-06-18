import Pizza from "../models/pizzaModel.js";

// Get All Pizzas
export const getAllPizzas = async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = { isAvailable: true };

    if (category) {
      query.category = category;
    }

    const pizzas = await Pizza.find(query);

    res.status(200).json({
      success: true,
      count: pizzas.length,
      pizzas,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Pizza
export const getPizzaById = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    res.status(200).json({
      success: true,
      pizza,
    });
  } catch (error) {
    next(error);
  }
};

// Create Pizza (Admin)
export const createPizza = async (req, res, next) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;

    // Validation
    if (!name || !description || !price || !category || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const pizza = new Pizza({
      name,
      description,
      price,
      category,
      imageUrl,
    });

    await pizza.save();

    res.status(201).json({
      success: true,
      message: "Pizza created successfully",
      pizza,
    });
  } catch (error) {
    next(error);
  }
};

// Update Pizza (Admin)
export const updatePizza = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, imageUrl, isAvailable } = req.body;

    const pizza = await Pizza.findByIdAndUpdate(
      id,
      { name, description, price, category, imageUrl, isAvailable },
      { new: true, runValidators: true }
    );

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pizza updated successfully",
      pizza,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Pizza (Admin)
export const deletePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pizza deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Toggle Pizza Availability (Admin)
export const toggleAvailability = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    pizza.isAvailable = !pizza.isAvailable;
    await pizza.save();

    res.status(200).json({
      success: true,
      message: `Pizza ${pizza.isAvailable ? "enabled" : "disabled"} successfully`,
      pizza,
    });
  } catch (error) {
    next(error);
  }
};
