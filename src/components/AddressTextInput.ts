const ADDRESS_DELAY = 1000;
const MIN_CHARS = 3;

const addressSchema = {
    type: 'select',
    native: false,
    caret: true,
    search: true,
    items: () => {},
    delay: ADDRESS_DELAY,
    label: 'Адрес проживания',
    rules: [
        'required',
    ],
}


export default addressSchema;
