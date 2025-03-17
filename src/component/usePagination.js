import { useMemo } from "react"

export const usePagination = ({
    totalPage,
    pageSize,
    childCnt = 1,
    currPage
}) => {
    const paginationRange = useMemo(() => {
        const totalPageCnt = Math.ceil(totalPage/pageSize)
        const totalPageNum = childCnt + 5;
        if(totalPageNum >= totalPageCnt){
            return range(1, totalPageCnt)
        }
        const leftChildInd = Math.max(currPage - childCnt, 1)
        const rightChildInd = Math.min(currPage + childCnt, totalPageCnt)

        const showLeft = leftChildInd > 2;
        const showRight = rightChildInd < totalPageCnt - 2;

        const firstPageInd = 1;
        const lastPageInd = totalPageCnt

        if (!showLeft && showRight) {
            let leftCnt = 3 + 2 * childCnt;
            let leftRange = range(1, leftCnt);
            return [...leftRange, totalPageCnt];
        }
        if(showLeft && !showRight){
            let rightCnt = 3 + 2 * childCnt;
            let rightRange = range(totalPageCnt - rightCnt + 1, totalPageCnt)
            return [firstPageInd, ...rightRange]
        }
        if(showLeft && showRight){
            let middleRange = range(leftChildInd, rightChildInd)
            return [firstPageInd, ...middleRange, lastPageInd]
        }
    }, [totalPage, pageSize, childCnt, currPage])
    return paginationRange
}

const range = (start, end) => {
    let len = end - start + 1;
    return Array.from({ len }, (_, ind) => ind + start);
  };