import React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import Button from './Button'

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = ''
}) => {
  const range = (start, end) => {
    const length = end - start + 1
    return Array.from({ length }, (_, idx) => idx + start)
  }

  const paginationRange = () => {
    const totalPageNumbers = siblingCount + 5

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)
      return [...leftRange, '...', totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(totalPages - rightItemCount + 1, totalPages)
      return [1, '...', ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [1, '...', ...middleRange, '...', totalPages]
    }
  }

  const pages = paginationRange()

  if (!pages || pages.length < 2) {
    return null
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {pages.map((pageNumber, index) => {
        if (pageNumber === '...') {
          return (
            <span
              key={`dots-${index}`}
              className="px-3 py-2 text-muted-foreground"
            >
              <MoreHorizontal className="w-4 h-4" />
            </span>
          )
        }

        return (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onPageChange(pageNumber)}
            className="min-w-[2.5rem]"
          >
            {pageNumber}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

export default Pagination