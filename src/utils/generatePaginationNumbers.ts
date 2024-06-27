

export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {
    
    // SI EL NUMERO TOTAL DE PAGINAS ES 7 O MENOS
    // VAMOS A MOSTRAR PUNTOS SUSPENSIVOS
    if ( totalPages <= 7 ) {
        return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    // si la pagina actual esta entre las primeras 3 paginas
    if ( currentPage <= 3 ) {
        return [1, 2, 3, '...', totalPages -1 , totalPages];
    }

    // si la pagina actual esta entre las ultimas 3 paginas
    if ( currentPage >= totalPages - 2 ) {
        return [1,2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    // si la pagina actual esta en otro lugar medio
    return [
        1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages
    ];
}