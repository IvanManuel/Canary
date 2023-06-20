
export const format = ( value: number ) => {

    // Crear formateador
    const formatter = new Intl.NumberFormat('en-UK', {
        style:'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

    return formatter.format( value );
}