import ProductsCounter from './';

export default {
    title: 'products/ProductsCounter',
    component: ProductsCounter,
    parameters: {
        layout: 'centered',
    },
    Tags: ['autodocs'],
    argTypes: {
        productsLength: {
            control: 'number'
        }
    },
};

export const Default = {
    args: {
        productsLength: 5
    }
};

export const Custom = {
    args: {
        productsLength: 10
    }
};