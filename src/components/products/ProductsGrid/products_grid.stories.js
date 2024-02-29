import ProductsGrid from './';

export default {
    title: 'products/ProductsGrid',
    component: ProductsGrid,
    parameters: {
        layout: 'centered',
    },
    Tags: ['autodocs'],
    argTypes: {
        products: {
            control: 'object'
        }
    },
};

export const Default = {
    args: {
        products: [
            {
                name: 'Product Name',
                price: 100,
                thumbnail: 'https://via.placeholder.com/150',
                packshot: 'https://via.placeholder.com/300',
                id: 1
            },
            {
                name: 'Product Name',
                price: 100,
                thumbnail: 'https://via.placeholder.com/150',
                packshot: 'https://via.placeholder.com/300',
                id: 2
            },
            {
                name: 'Product Name',
                price: 100,
                thumbnail: 'https://via.placeholder.com/150',
                packshot: 'https://via.placeholder.com/300',
                id: 3
            },
            {
                name: 'Product Name',
                price: 100,
                thumbnail: 'https://via.placeholder.com/150',
                packshot: 'https://via.placeholder.com/300',
                id: 4
            },
            {
                name: 'Product Name',
                price: 100,
                thumbnail: 'https://via.placeholder.com/150',
                packshot: 'https://via.placeholder.com/300',
                id: 5
            }
        ]
    }
};