

export const currencyFormat = (value: number) => {

    // return new Intl.NumberFormat('es-PY', {
    //     style: 'currency',
    //     currency: 'PYG',

    // }).format(value);

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);

}