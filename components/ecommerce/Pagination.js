// import React from "react";
// // import "./styles.css";

// function Pagination({
//   prev,
//   currentPage,
//   getPaginationGroup,
//   next,
//   pages,
//   handleActive,
// }) {
//   return (
//     <>
//       <ul className="pagination justify-content-start">
//         {getPaginationGroup.length <= 0 ? null : (
//           <li onClick={prev} className="page-item">
//             {currentPage === 1 ? null : (
//               <a className="page-link">
//                 <i className="fi-rs-angle-double-small-left"></i>
//               </a>
//             )}
//           </li>
//         )}
//         {getPaginationGroup.map((item, index) => {
//           return (
//             <li
//               onClick={() => handleActive(item)}
//               key={index}
//               className={
//                 currentPage === item ? "page-item active" : "page-item"
//               }
//             >
//               <a className="page-link">{item}</a>
//             </li>
//           );
//         })}

//         {getPaginationGroup.length <= 0 ? null : (
//           <li onClick={next} className="page-item">
//             {currentPage >= pages ? null : (
//               <a className="page-link">
//                 <i className="fi-rs-angle-double-small-right"></i>
//               </a>
//             )}
//           </li>
//         )}
//       </ul>
//       {getPaginationGroup.length <= 0 ? null : (
//         <p>
//           show {currentPage} of {pages}
//         </p>
//       )}
//     </>
//   );
// }

// export default Pagination;
import React from "react";

function Pagination({ prev, currentPage, getPaginationGroup, next, pages, handleActive }) {
  const renderPaginationNumbers = () => {
    let paginationNumbers = [];

    if (pages <= 5) {
      paginationNumbers = Array.from({ length: pages }, (_, i) => i + 1);
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(pages, startPage + 4);

      paginationNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

      if (startPage > 1) {
        paginationNumbers.unshift("...");
        paginationNumbers.unshift(1);
      }

      if (endPage < pages) {
        paginationNumbers.push("...");
        paginationNumbers.push(pages);
      }
    }

    return paginationNumbers;
  };

  return (
    <>
      <ul className="pagination justify-content-start">
        <li onClick={prev} className="page-item">
          {currentPage === 1 ? null : (
            <a className="page-link">
              <i className="fi-rs-angle-double-small-left"></i>
            </a>
          )}
        </li>

        {renderPaginationNumbers().map((item, index) => {
          return (
            <li
              key={index}
              className={item === "..." ? "page-item disabled" : currentPage === item ? "page-item active" : "page-item"}
            >
              {item === "..." ? (
                <span className="page-link">...</span>
              ) : (
                <a className="page-link" onClick={() => handleActive(item)}>
                  {item}
                </a>
              )}
            </li>
          );
        })}

        <li onClick={next} className="page-item">
          {currentPage >= pages ? null : (
            <a className="page-link">
              <i className="fi-rs-angle-double-small-right"></i>
            </a>
          )}
        </li>
      </ul>
      <p>
        show {currentPage} of {pages}
      </p>
    </>
  );
}

export default Pagination;

