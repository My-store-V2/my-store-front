import ProductFancyBox from "./";

export default {
    title: "products/ProductFancyBox",
    component: ProductFancyBox,
    parameters: {
        layout: "centered",
    },
    Tags: ["autodocs"],
    argTypes: {
        img: {
            control: "text",
        },
        close: {
            control: "text",
        },
        prevSlide: {
            control: "text",
        },
        nextSlide: {
            control: "text",
        }
    },
}


export const Default = {
    args: {
        img: "https://source.unsplash.com/random",
        close: "Close",
        prevSlide: "Prev",
        nextSlide: "Next"
    }
}

export const Custom = {
    args: {
        img: "https://source.unsplash.com/random",
        close: "Close",
        prevSlide: "Prev",
        nextSlide: "Next"
    }
}