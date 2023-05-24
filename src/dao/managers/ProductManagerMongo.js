import productModel from "../models/products.model.js";

// const products = [
//     {
//         "title": "Arena para gatos",
//         "description": "Arena aglomerante para control de olores",
//         "price": 15,
//         "thumbnail": "imagen_arena_gatos.png",
//         "code": "AG001",
//         "stock": 20,
//         "status": true,
//         "category": "Higiene",
//     },
//     {
//         "title": "Comida para gatos adultos",
//         "description": "Alimento seco completo y balanceado para gatos adultos",
//         "price": 25,
//         "thumbnail": "imagen_comida_gatos_adultos.png",
//         "code": "CGA002",
//         "stock": 30,
//         "status": true,
//         "category": "Alimento",
//     },
//     {
//         "title": "Comida húmeda para gatos",
//         "description": "Alimento húmedo para gatos con sabor a pollo y verduras",
//         "price": 2,
//         "thumbnail": "imagen_comida_humeda_gatos.png",
//         "code": "CGH003",
//         "stock": 50,
//         "status": true,
//         "category": "Alimento",
//     },
//     {
//         "title": "Rascador para gatos",
//         "description": "Rascador de sisal con plataforma para gatos",
//         "price": 40,
//         "thumbnail": "imagen_rascador_gatos.png",
//         "code": "RG004",
//         "stock": 10,
//         "status": true,
//         "category": "Juguetes",
//     },
//     {
//         "title": "Collar para gatos",
//         "description": "Collar de cuero con cascabel para gatos",
//         "price": 12,
//         "thumbnail": "imagen_collar_gatos.png",
//         "code": "CG005",
//         "stock": 15,
//         "status": true,
//         "category": "Accesorios",
//     },
//     {
//         "title": "Arena para gatos Arm & Hammer",
//         "description": "Arena para gatos con control de olores",
//         "price": 14.99,
//         "thumbnail": "arena_gatos_arm_hammer.jpg",
//         "code": "AGAH",
//         "stock": 50,
//         "status": true,
//         "category": "Arena para gatos",
//     },
//     {
//         "title": "Comedero automático para gatos",
//         "description": "Dispensador automático de alimentos para gatos",
//         "price": 39.99,
//         "thumbnail": "comedero_automatico_gatos.jpg",
//         "code": "CAG",
//         "stock": 20,
//         "status": true,
//         "category": "Comederos y bebederos",
//     },
//     {
//         "title": "Rascador para gatos",
//         "description": "Rascador de sisal para gatos",
//         "price": 29.99,
//         "thumbnail": "rascador_gatos.jpg",
//         "code": "RG",
//         "stock": 30,
//         "status": true,
//         "category": "Juguetes para gatos",
//     },
//     {
//         "title": "Bandeja sanitaria para gatos",
//         "description": "Bandeja sanitaria con filtro de carbón para gatos",
//         "price": 24.99,
//         "thumbnail": "bandeja_sanitaria_gatos.jpg",
//         "code": "BSG",
//         "stock": 40,
//         "status": true,
//         "category": "Arena para gatos"
//     },
//     {
//         "title": "Juguete interactivo para gatos",
//         "description": "Juguete con plumas y luz LED para gatos",
//         "price": 9.99,
//         "thumbnail": "juguete_gatos.jpg",
//         "code": "JIG",
//         "stock": 50,
//         "status": true,
//         "category": "Juguetes para gatos"
//     }
// ]

export default class ProductManager {

    insertManyProducts = async () => {
        const result = await productModel.insertMany(products);
        return ({
            code: 200,
            status: 'Success',
            message: result
        })
    }
    getProducts = async (limit, page, sortValue) => {
        const products = await productModel.paginate({}, { limit, page, sort: { price: sortValue }, lean: true })
        const nextLink = products.hasNextPage ? `/api/products/?limit=${limit}&page=${products.nextPage}&sort=${sortValue}` : null
        const prevLink = products.hasPrevPage ? `/api/products/?limit=${limit}&page=${products.prevPage}&sort=${sortValue}` : null
        return ({
            code: 200,
            message: {
                status: 'success',
                payload: products.docs,
                totalpages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                nextLink,
                prevLink
            }
        })
    }

    getProductById = async (pid) => {
        const product = await productModel.findOne({ _id: pid })
        if (product) {
            return ({
                code: 200,
                status: 'Success',
                message: product
            })
        } else {
            return ({
                code: 400,
                status: 'Error',
                message: 'El id no existe'
            })
        }
    }

    addProduct = async (title, description, price, thumbnail, code, stock, category) => {
        const defaultThumbnail = "default.jpg"; // Valor por defecto para thumbnail
        thumbnail = thumbnail ? thumbnail : defaultThumbnail

        const producto = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            status: true,
            code: code,
            stock: stock,
            category: category
        }
        //console.log("desde addProduct en manager mongo", producto)


        if (!title || !description || !price || !code || !stock || !category) {
            return ({
                code: 400,
                status: 'Error',
                message: 'Datos faltantes'
            })
        }

        const result = productModel.create(producto)

        return ({
            code: 200,
            status: 'Success',
            message: result
        })
    }

    updateProduct = async (pid, actualizacion) => {
        const producto = await productModel.updateOne({ _id: pid }, { $set: actualizacion });
        if (producto) {
            return ({
                code: 200,
                status: 'Success',
                message: producto
            })
        } else {
            return ({
                code: 400,
                status: 'Success',
                message: 'No existe un producto con ese ID'
            })
        }
    }

    deleteProduct = async (pid) => {
        const producto = await productModel.deleteOne({ _id: pid })
        if (producto) {
            return ({
                code: 200,
                status: 'Success',
                message: producto
            })
        } else {
            return ({
                code: 400,
                status: 'Error',
                message: 'Producto no encontrado'
            })
        }
    }
}