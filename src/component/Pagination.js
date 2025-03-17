import React, { useEffect } from "react";
import usePagination from "./usePagination.js";

const Pagination = (props) => {

    const { pageNumber, pageCount, changePage, pageData, nextPage, previousPage } =
        usePagination(props.items, props.pageLimit);


    useEffect(() => {
        props.setPageItems(pageData);
    }, [pageNumber, changePage]);

    return (
        <div>
            <button style={{cursor: 'pointer'}} disabled={(pageNumber === 1)?true: false} onClick={previousPage }>Prev</button>
            <input
                value={pageNumber}
                onChange={(e) => {
                    changePage(e.target.valueAsNumber);
                }}
                type="number"
            />
            <button style={{cursor: 'pointer'}}  disabled={(pageNumber === pageCount)?true: false} onClick={nextPage}>Next</button>
        </div>
    );
};

export default Pagination;