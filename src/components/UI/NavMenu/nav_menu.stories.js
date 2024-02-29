import NavMenu from './'

export default {
    title: 'UI/NavMenu',
    component: NavMenu,
    parameters: {
        layout: 'centered',
    },
    Tags: ['autodocs'],
    argTypes: {
        color: {
            control: {
                type: 'select',
                options: ['scale', 'black', 'grey', 'white']
            },
        },
        menu: {
            control: 'object'
        }
    },
};

export const Default = {
    args: {
        color: 'scale',
        menu: [
            {
                name: 'Home',
                path: '/'
            },
            {
                name: 'About',
                path: '/about'
            },
            {
                name: 'Contact',
                path: '/contact'
            }
        ]
    }
};

export const Black = {
    args: {
        color: 'black',
        menu: [
            {
                name: 'Home',
                path: '/'
            },
            {
                name: 'About',
                path: '/about'
            },
            {
                name: 'Contact',
                path: '/contact'
            }
        ]
    }
};

export const Grey = {
    args: {
        color: 'grey',
        menu: [
            {
                name: 'Home',
                path: '/'
            },
            {
                name: 'About',
                path: '/about'
            },
            {
                name: 'Contact',
                path: '/contact'
            }
        ]
    }
};

export const White = {
    args: {
        color: 'white',
        menu: [
            {
                name: 'Home',
                path: '/'
            },
            {
                name: 'About',
                path: '/about'
            },
            {
                name: 'Contact',
                path: '/contact'
            }
        ]
    }
};
