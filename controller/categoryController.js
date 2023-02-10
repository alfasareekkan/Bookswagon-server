import Category from "../model/Category.js";


//add categories
export const addCategory = async (req, res) => {
    const { category } = req.body;
    console.log(req.body);
    if (!category) res.status(404).json({error: "No category"})
    try {
        //create a new category
        const result = await Category.create({ category })
        res.status(200).json({message:"Category created successfully"})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//get all categories

export const getAllCategory = async (req, res) => { 
    try {
        const result = await Category.find({ recordStatus: 0 },{__v:0,recordStatus:0,createdAt:0,updatedAt:0})
        res.status(200).json(result)
        
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
    
}

//update a category
export const updateCategory = async (req, res) => { 
    const { category, categoryId } = req.body
    try {
        const data = await Category.findOne(categoryId)
        if (!data) throw new Error("Category not found")
        data.category = category
        const result = await data.save();
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })

    }
}

export const deleteCategory = async (req, res) => { 
    const categoryId = req.params.id
    try {
        const data = await Category.findOne({_id: categoryId })
        if (!data) throw new Error("Category not found")
        data.recordStatus = 2
        const result = await data.save();
        if(!result) throw new Error("Category not deleted")
        res.status(200).json({ message: `category of ${data.category} deleted` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}