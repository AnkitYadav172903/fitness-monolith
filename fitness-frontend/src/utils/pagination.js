export const paginate = (
    data,
    currentPage,
    itemsPerPage
) => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
};

export const pageCount = (
    data,
    itemsPerPage
) => Math.ceil(data.length / itemsPerPage);