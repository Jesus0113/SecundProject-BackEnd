import express  from 'express';
import ProductManager from "./manager/product.manager.js"

const app = express();
app.use(express.json());

app.use(express.urlencoded({extended:true}));

const productManager = new ProductManager('./products.json');

app.get('/products', async (req, res) =>{
    try {
        const products = await productManager.getProducts();
        res.status(200).json(products);
        
    } catch (error) {
        res.status(404).json({message: error.message});
        
    }
});

app.get('/products/:id', async (req, res) =>{
    try {
        const {id} = req.params;
        const product = await productManager.getProductById(Number(id));

        if(product){
            res.status(200).json({ message: 'Product found', product});
        }else{
            res.status(400).send({message: 'Product not found'});
        }
    } catch (error) {
        res.status(404).json({message: error.message});
        console.log(error);   
    }
});

app.post('/products', async (req, res)=>{
    try {
        const product = req.body;
        const newProduct = await productManager.addProduct(product);
        res.json(newProduct);
    } catch (error) {
        res.status(404).json({message: error.message});
    }

});

app.put('/products/:id', async (req, res) =>{
    try {
        const product = req.body;
        const {id} = req.params;
        const productFile = await productManager.getProductById(Number(id));
        if(productFile){
            await productManager.updateProduct(product, Number(id));
            res.send('Product updated successfully');
        }else{
            res.status(404).send('product not found');
        }
        
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

app.delete('/products/:id', async (req, res) =>{
    try {
        const {id} = req.params;
        const products = await productManager.getProducts();
        if ( products.length > 0 ) {
            await productManager.deleteProduct(Number(id));
            res.send(`Product id ${id} deleted successfully`);
        }else{
            res.send(`Product id ${id} not found`);
        }
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

app.delete('/products/:id', async (req, res) =>{
    try {
        await productManager.deleteAllProducts();
        res.send('Product deleted successfully');      
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
})


