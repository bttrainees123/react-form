import React, { useState } from "react";

function usePagination(items, pageLimit) {
    const [pageNumber, setPageNumber] = useState(1);
    const pageCount = Math.ceil(items.length / pageLimit);

    const changePage = (pN) => {
        setPageNumber(pN);
    };

    const pageData = () => {
        const s = (pageNumber-1) * pageLimit;
        const e = s + pageLimit;
        return items.slice(s, e);
    };

    const nextPage = () => {
        setPageNumber((currPage) => Math.min(currPage + 1, pageCount));
    };

    const previousPage = () => {
        setPageNumber((currPage) => Math.max(currPage - 1, 1));
    };

    const jumpPage = (page) => {
        const pageNumber = Math.max(1, page);
        setPageNumber((currPage) => Math.min(pageNumber, pageCount))
    }

    return {
        pageNumber,
        pageCount,
        changePage,
        pageData,
        nextPage,
        previousPage,
        jumpPage
    };
}

export default usePagination;
