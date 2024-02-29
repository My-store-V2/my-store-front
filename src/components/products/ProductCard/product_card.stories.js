import ProductCard from './';


export default {
    title: 'products/ProductCard',
    component: ProductCard,
    parameters: {
        layout: 'centered',
    },
    Tags: ['autodocs'],
    argTypes: {
        product: {
            control: 'object'
        }
    },
};

export const Default = {
    args: {
        product: {
            name: 'Product Name',
            price: 100,
            thumbnail: 'https://via.placeholder.com/150',
            packshot: 'https://via.placeholder.com/300',
            id: 1
        }
    }
};

export const Custom = {
    args: {
        product: {
            name: 'Product Name',
            price: 100,
            thumbnail: 'https://via.placeholder.com/150',
            packshot: 'https://via.placeholder.com/300',
            id: 1
        }
    }
};

