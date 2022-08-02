// import React, {useState, useEffect} from 'react'
// import { Link } from 'react-router-dom'
// import {DebounceInput} from 'react-debounce-input'
// import ReactPaginate from 'react-paginate'
// import {utils,writeFileXLSX} from 'xlsx'

// import {GET} from '../../../api/api'
// import { dateFormatterWithoutTime } from '../../../utils/formatter';

// export default function Inventory() {
//     const [inventoryData, setInventoryData] = useState()

//     const [currentPage, setCurrentPage] = useState(0)
//     const [pageCount, setPageCount] = useState(0);
//     const [itemOffset, setItemOffset] = useState(0);

//     let token = JSON.parse(localStorage.getItem('token'))
//     let tableUrl = 'https://cabinet.mdokon.uz/services/web/api/inventory-pageList'

//     useEffect(() => {
//         GET(tableUrl, token).then(response => setInventoryData(response.data))
//     }, [])

//     function handlePageClick(e) {
//         const newOffset = (e.selected * 20);
//         setItemOffset(newOffset);
//         setCurrentPage(e.selected)
//     };


//     function searchHandle(e) {
//         let input = e.target.value
//         tableUrl = `https://cabinet.mdokon.uz/services/web/api/inventory-pageList?search=${input}`
//         GET(tableUrl, token).then((response) => {
//             setInventoryData(response.data)
//             setPageCount(0)
//         })
//     }

//     function getExcel(id) {
//         let excelUrl = `https://cabinet.mdokon.uz/services/web/api/inventory/${id}`
//         const workbook = utils.book_new()
//         GET(excelUrl, token).then(response => {
//             const newArray = response.data.productList.content.map((row) => {
//                 return (
//                 {
//                     'Торговая точка': response.data.posName,
//                     'Поставщик': response.data.organizationName,
//                     'Наименование товара': row.productName,
//                     'Штрих-код': row.barcode,
//                     'Ед. изм': row.uomName,
//                     'Цена поступление': row.price,
//                     'Серия': row.serial,
//                     'Срок годности': row.expDate ? dateFormatterWithoutTime(row.expDate) : '',
//                     'Количество': row.quantity,
//                     'Оптом цена': row.wholesalePrice,
//                     'Цена за единицу': row.salePrice,
//                     'НДС': row.vat,
//                     'Сумма': row.totalAmount
//                 })
//             })
//             const worksheet = utils.json_to_sheet(newArray)
//             utils.book_append_sheet(workbook, worksheet, 'SheetJS')
//             writeFileXLSX(workbook, 'Инвентаризация.xlsx')
//         })
        
        
//     }
    
//     return(
//         <div className='page-content'>
//             <div className="d-flex justify-content-between mb-2">
//                 <h4 className="header-text">Инвентаризация</h4>
//                 <Link to='/inventory/create'>
//                     <button className="btn-rounded btn btn-primary fz-09 create-btn-link">
//                         <svg className="me-2" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" 
//                             width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
//                             <path fill="currentColor" d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2Z"/>
//                         </svg>
//                         Создать
//                     </button>
//                 </Link>
//             </div>
//             <div className="card">
//                 <div className='searchPositionContainer mb-3'>
//                     <i id='search-icon-position' className="bi bi-search"></i>
//                     <DebounceInput
//                         className='debounce_input'
//                         minLength={3}
//                         debounceTimeout={300}
//                         onChange={e => searchHandle(e)}
//                         placeholder='Поиск...'
//                     />
//                 </div>
//                 <div className="table-responsive">
//                     <table className="table table-striped">
//                         <thead>
//                             <tr className="doc-in-head">
//                                 <th className='text-left'>№</th>
//                                 <th className='text-left'>Торговая точка</th>
//                                 <th className='text-center'>№ Документ</th>
//                                 <th className='text-center'>Дата</th>
//                                 <th className='text-center'>Статус</th>
//                                 <th className='text-center'>Действие</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {inventoryData?.map((row) => {
//                                 console.log(row)
//                                 return(
//                                     <tr key={row.id} className='doc-in-body'>
//                                         <td className="text-left">{row.rowNum}</td>
//                                         <td className="text-left">{row.posName}</td>
//                                         <td className='text-center'>{row.inventoryNumber}</td>
//                                         <td>{dateFormatterWithoutTime(row.beginDate)}</td>
//                                         <td>
//                                             {row.completed 
//                                             ? <span className="bg-success bg-border text-white text-nowrap">Закрыто</span>
//                                             : <span className="bg-secondary bg-border text-white text-nowrap">Ожидается</span>
//                                             }
//                                         </td>
//                                         <td>
//                                             <div className="icon__container">
//                                                 {row.completed 
//                                                     ?   <Link className="bg-transparent" to={`/documents-in/preview/${row.id}`}>
//                                                             <div className='check-icon-container me-2'>
//                                                                 <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" id="eye-icon" 
//                                                                     width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
//                                                                     <path fill="currentColor" d="M21.92 11.6C19.9 6.91 16.1 4 12 4s-7.9 2.91-9.92 7.6a1 1 0 0 0 0 .8C4.1 17.09 7.9 20 12 20s7.9-2.91 9.92-7.6a1 1 0 0 0 0-.8ZM12 18c-3.17 0-6.17-2.29-7.9-6C5.83 8.29 8.83 6 12 6s6.17 2.29 7.9 6c-1.73 3.71-4.73 6-7.9 6Zm0-10a4 4 0 1 0 4 4a4 4 0 0 0-4-4Zm0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2Z"/>
//                                                                 </svg>
//                                                             </div>
//                                                         </Link>
//                                                     :   <Link className="bg-transparent" to={`/documents-in/update/${row.id}`}>
//                                                             {/* <div className='check-icon-container me-2'>
//                                                                 <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" id="eye-icon" 
//                                                                     width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
//                                                                     <path fill="currentColor" d="M21.92 11.6C19.9 6.91 16.1 4 12 4s-7.9 2.91-9.92 7.6a1 1 0 0 0 0 .8C4.1 17.09 7.9 20 12 20s7.9-2.91 9.92-7.6a1 1 0 0 0 0-.8ZM12 18c-3.17 0-6.17-2.29-7.9-6C5.83 8.29 8.83 6 12 6s6.17 2.29 7.9 6c-1.73 3.71-4.73 6-7.9 6Zm0-10a4 4 0 1 0 4 4a4 4 0 0 0-4-4Zm0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2Z"/>
//                                                                 </svg>
//                                                             </div> */}
//                                                             <div className='edit-icon-container me-2'>
//                                                                 <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" id='edit-icon' 
//                                                                     width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
//                                                                     <path fill="currentColor" d="M5 18h4.24a1 1 0 0 0 .71-.29l6.92-6.93L19.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71V17a1 1 0 0 0 1 1Zm9.76-13.59l2.83 2.83l-1.42 1.42l-2.83-2.83ZM6 13.17l5.93-5.93l2.83 2.83L8.83 16H6ZM21 20H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2Z"/>
//                                                                 </svg>
//                                                             </div>
//                                                         </Link>
//                                                 }
//                                                 <div className='excel-icon-container'>
//                                                     <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" onClick={() => getExcel(row.id)}
//                                                         width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" id='excel-icon'>
//                                                         <path fill="currentColor" d="M9 10h1a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2Zm0 2a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Zm11-3.06a1.31 1.31 0 0 0-.06-.27v-.09a1.07 1.07 0 0 0-.19-.28l-6-6a1.07 1.07 0 0 0-.28-.19a.32.32 0 0 0-.09 0a.88.88 0 0 0-.33-.11H7a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8.94Zm-6-3.53L16.59 8H15a1 1 0 0 1-1-1ZM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v3a3 3 0 0 0 3 3h3Zm-3-3H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Z"/>
//                                                     </svg>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )
//                             })}
//                         </tbody>
//                     </table>
//                     <ReactPaginate
//                         breakLabel="..."
//                         nextLabel="next >"
//                         onPageChange={handlePageClick}
//                         pageRangeDisplayed={3}
//                         pageCount={pageCount}
//                         previousLabel="< previous"
//                         renderOnZeroPageCount={null}
//                         containerClassName="pagination justify-content-start"
//                         pageClassName="page-item"
//                         pageLinkClassName="page-link"
//                         previousClassName="page-item"
//                         previousLinkClassName="page-link"
//                         nextClassName="page-item"
//                         nextLinkClassName="page-link"
//                         activeClassName="active"
//                         breakClassName="page-item"
//                         breakLinkClassName="page-link"
//                     />
//                 </div>
//             </div>
//         </div>
//     )
// }