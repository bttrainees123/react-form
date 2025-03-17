import React from 'react'
import { usePagination } from './usePagination'

const Pagination = (props) => {
    const {
        onPageChange,
        totalPage,
        childCnt = 1,
        currPage,
        pageSize,
    } = props

    const paginationRange = usePagination({
        currPage,
        totalPage,
        childCnt,
        pageSize
    })

    if(currPage === 0 || paginationRange.length < 2){
        return null;
    }

    const onNext = () => {
        onPageChange(currPage + 1)
    }

    const onPrev = () => {
        onPageChange(currPage - 1)
    }

    let lastPage = paginationRange[paginationRange.length-1]

  return (
    <ul>
      <li
        onClick={onPrev}
      >
        <div className="arrow left" />
      </li>
      {paginationRange.map(pageNumber => {

        // if (pageNumber === DOTS) {
        //   return <li>&#8230;</li>;
        // }

        return (
          <li
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        onClick={onNext}
      >
        <div className="arrow right" />
      </li>
    </ul>
  )
}

export default Pagination