import BreadCrumb from './';

export default {
    title: 'UI/Breadcrumb',
    component: BreadCrumb,
    parameters: {
        layout: 'centered',
    },
    Tags: ['autodocs'],
    argTypes: {
        current_page: {
            control: 'object'
        }
    },
};

export const Default = {
    args: {
        current_page: 'Shop'
    }
};

export const About = {
    args: {
        current_page: 'About'
    }
};


