import * as Yup from 'yup';

const requiredMessage = 'Required field';
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneRegex = /^05\d([-]{0,1})\d{7}$/;
const linkRegex = /(https?:\/\/[^\s]+)/g;

const restaurantSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required(requiredMessage),
    description: Yup.string()
        .trim()
        .required(requiredMessage),
    link: Yup.string()
        .trim()
        .matches(linkRegex, "URL isn't valid"),
    phone: Yup.string().
        matches(phoneRegex, "Phone number isn't valid").
        required(requiredMessage),
    priceRange: Yup.object().shape({
        lowest: Yup.number()
            .min(1, 'Must be greater than zero')
            .typeError('Type error. Should be number')
            .required(requiredMessage)
            .test(
                'no-leading-zero',
                'Leading zero is not allowed',
                (value, context) => {
                    return context.originalValue && !context.originalValue.startsWith('0');
                }
            ),
        highest: Yup.number()
            .min(1, 'Must be greater than zero')
            .typeError('Type error. Should be number')
            .required(requiredMessage)
            .test(
                'no-leading-zero',
                'Leading zero is not allowed',
                (value, context) => {
                    return context.originalValue && !context.originalValue.startsWith('0');
                }
            )
    }).nullable()
});

export { restaurantSchema };