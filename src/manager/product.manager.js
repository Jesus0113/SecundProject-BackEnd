import fs from 'fs';

export default class ProductManager{
    constructor(path){
        this.path = path;
        this.id = 0;
    }

async addProduct(obj){
    try {
        const product = {

            id: this.#NewId(),
            ...obj
        }

        const productsFile = await this.getProducts();
        productsFile.push(product);
        await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
    } catch (error) {
        console.log(error);
    }
};
async getProducts(){
    try {
        if (fs.existsSync(this.path)) {

            const products = await fs.promises.readFile(this.path, 'utf-8');
            const productsJS = JSON.parse(products);
            return productsJS;
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
    }
};

#NewId(){
    this.id++;
    return this.id;
};

async getProductById(lookId){
    try {
        if (fs.existsSync(this.path)) {
            const productsJS = await this.getProducts();
            const productById = productsJS.find((product) => product.id == lookId);
            if (productById) {
                return productById;
            } else {
                console.log('Product not found');
            }
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
    }
};
async updateProduct(obj, idProduct){
    try {
        const productsJS = await this.getProducts();
        const index = productsJS.findIndex((product) => product.id == idProduct);

        if(index === -1){
            throw new Error(`Id ${idProduct} not found`);
        }else{
            productsJS[index] = { ...obj, idProduct };
        }

        await fs.promises.writeFile(this.path, JSON.stringify(productsJS));
        
    } catch (error) {
        console.log(error);
    }
};
async deleteProduct(id){
    try {
        if (fs.existsSync(this.path)) {
            const productsJS = await this.getProducts();
            const productById = productsJS.some(product => product.id === id);
            if (productById) {
                const productsAct = productsJS.filter(product => product.id !== id);
                await fs.promises.writeFile(this.path, JSON.stringify(productsAct));
            }
        } else {
            console.log('inf not found');
        }
    } catch (error) {
        console.log(error);
    }
};

async deleteAllProducts(){
    try {
        if(fs.existsSync(this.path)){
            await fs.promises.unlink(this.path);
        }
        
    } catch (error) {
        console.log(error)
    }
};

}

