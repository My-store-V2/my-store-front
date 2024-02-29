import Alert from './';


export default {
    title: 'UI/Alert',
    component: Alert,
    parameters: {
        layout: 'centered',
    },
    Tags: ['autodocs'],
    argTypes: {
        type: {
            control: {
                type: 'select',
                options: ['error', 'success']
            },
        },
        message: {
            control: 'text'
        }
    },
};

export const ErrorMessage = {
    args: {
        type: 'error',
        message: 'This is an error message'
    }
};

export const SuccessMessage = {
    args: {
        type: 'success',
        message: 'This is a success message'
    }
};

export const InfoMessage = {
    args: {
        type: 'info',
        message: 'This is an info message'
    }
};
