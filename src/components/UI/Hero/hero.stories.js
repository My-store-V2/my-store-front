import Hero from './';

export default {
    title: 'UI/Hero',
    component: Hero,
    parameters: {
        layout: 'centered',
    },
    Tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text'
        },
        description: {
            control: 'text'
        },
        img: {
            control: 'text'
        },
        link: {
            control: 'text'
        },
        link_text: {
            control: 'text'
        }
    },
};


export const Default = {
    args: {
        title: 'Welcome to our store',
        description: 'We have the best products in the world',
        img: 'https://source.unsplash.com/random',
        link: '/shop',
        link_text: 'Shop Now'
    }
};

export const Custom = {
    args: {
        title: 'Welcome to our store',
        description: 'We have the best products in the world',
        img: 'https://source.unsplash.com/random',
        link: '/shop',
        link_text: 'Shop Now'
    }
};

