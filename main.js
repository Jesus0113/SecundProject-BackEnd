
const fs = require('fs');

class ProductManager {

    constructor() {
        this.path = './Courses.json';
        this.id = 0;
    }

    async addProduct(title, description, price, thumbnail, stock) {

        try {
            if (!title || !description || !price || !thumbnail || !stock) {

                console.log('All fields are required');
            }

            const product = {
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                id: this.#NewId(),
                stock: stock
            }

            const productsFile = await this.getProducts();
            productsFile.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
        } catch (error) {
            console.log(error);
        }
    }

    async getProducts() {
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
    }

    #NewId() {
        this.id++;
        return this.id;
    }

    async getProductById(lookId) {
        try {
            if (fs.existsSync(this.path)) {
                const productsJS = await this.getProducts();
                const productById = productsJS.find((product) => product.id == lookId);
                if (productById) {
                    console.log(productById);
                } else {
                    console.log('Product not found');
                }
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }
    async updateProduct(idProduct, key, changeValue) {

        //No logro que funcione como yo tenia pensado, aveces me da error en el find y aveces no, creo que deberia funcionar pero no veo la falla 
        // TypeError: productsJS.find is not a function **lo que imprime la consola dos intentos atras funcionaba bien 
        try {

            const productsJS = await this.getProducts();
            const findProduct = productsJS.find((product) => product.id == idProduct);
            const filterProducts = productsJS.filter((product) => product.id !== idProduct)
            // const iObject = productsJS.indexOf(findProduct);

            

            if (findProduct) {

                console.log(findProduct);
                console.log(key);
                console.log(changeValue);

                
                switch (key) {

                    case 'title':
                        findProduct.title = changeValue;
                        break;

                    case 'descripcion':
                        findProduct.description = changeValue;
                        break;

                    case 'price':
                        findProduct.price = parseInt(changeValue);
                        break;


                    case 'thumbnail':
                        findProduct.thumbnail = changeValue;
                        break;

                    case 'stock':
                        findProduct.stock = parseInt(changeValue);
                        break;
                
                    default:
                        console.log('Wrong key')
                        break;
                }

                const productsJSAct = [{
                    ...findProduct,
                    ...filterProducts
                }];

                await fs.promises.writeFile(this.path, JSON.stringify(productsJSAct));

            } else {
                console.log('product not found from updateMethod');
            }

        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
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
    }
}


const newProducts = new ProductManager();

const test = async () => {

    // *****************para crear el archivo con tres cursos*****************

    // const get = await newProducts.getProducts();
    // console.log('primera consulta', get);


    // await newProducts.addProduct('python', 'programming course', 15000, "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Python.svg/800px-Python.svg.png", 10);
    // const get2 = await newProducts.getProducts();
    // console.log('consulta del primer curso agregado', get2);

    // await newProducts.addProduct('javaScript', 'programming course', 16000, "https://www.dongee.com/tutoriales/content/images/2022/10/image-83.png", 5);
    // const get3 = await newProducts.getProducts();
    // console.log('consulta del segundo curso agregado', get3);

    // await newProducts.addProduct('nodeJs', 'programming course', 18000, "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png", 12);
    // const get4 = await newProducts.getProducts();
    // console.log('consulta de tercer curso agregado', get4);



    //*****************Para editar un curso*****************

    await newProducts.updateProduct(1, 'stock', 200);

    //*****************Para borrar un curso*****************

    // await newProducts.deleteProduct(1);
}
test();
