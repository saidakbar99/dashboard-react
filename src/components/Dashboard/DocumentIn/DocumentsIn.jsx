import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate';
import {DebounceInput} from 'react-debounce-input';

import { GET } from "../../../api/api";
import { numberFormatter, dateFormatter } from '../../../utils/formatter'

export default function DocumentsIn() {
    const [currentPage, setCurrentPage] = useState(0)
    const [tableInfo, setTableInfo] = useState([])

    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    let token = JSON.parse(localStorage.getItem('token'))
    let tableUrl = `https://cabinet.mdokon.uz/services/web/api/documents-in-pageList?page=${currentPage}&size=20`

    useEffect(() => {
        GET(tableUrl, token).then((result) => {
            setTableInfo(result.data)
            setPageCount(Math.ceil(result.headers["x-total-count"]/20))
        })
    }, [itemOffset, currentPage, tableUrl])

    const handlePageClick = (event) => {
        const newOffset = (event.selected * 20);
        setItemOffset(newOffset);
        setCurrentPage(event.selected)
    };

    function searchHandle(e) {
        let input = e.target.value
        tableUrl = `https://cabinet.mdokon.uz/services/web/api/documents-in-pageList?search=${input}`
        GET(tableUrl, token).then((result) => {
            setTableInfo(result.data)
            setPageCount(0)
        })
    }

    return(
        <div className="page-content">
            <div className="d-flex justify-content-between">
                <h4 className="header-text">Прием товаров</h4>
                <Link to='/documents-in/create'>
                    <button className="btn btn-primary">+ Создать</button>
                </Link>
            </div>
            <div className="card mt-2">
                <div className='searchPositionContainer'>
                    <i id='search-icon-position' className="bi bi-search"></i>
                    <DebounceInput
                        className='debounce_input'
                        minLength={3}
                        debounceTimeout={300}
                        onChange={e => searchHandle(e)}
                        placeholder='Поиск...'
                    />
                </div>
                <div className="table-responsive">
                    <table className="table table-striped table-overflow">
                        <thead>
                            <tr>
                                <th scope="col">Торговая точка</th>
                                <th scope="col">Поставщик</th>
                                <th scope="col">№ Документ</th>
                                <th scope="col">Сумма</th>
                                <th scope="col">Дата приема</th>
                                <th scope="col">Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableInfo.map((row) => {
                                return(
                                    <tr key={row.id}>
                                        <td>{row.rowNum}. {row.posName}</td>
                                        <td>{row.organizationName}</td>
                                        <td>{row.inNumber}</td>
                                        <td>{row.totalAmount ? numberFormatter(row.totalAmount) : 0} {row.currencyName}</td>
                                        <td>{dateFormatter(row.createdDate)}</td>
                                        <td>
                                            <div className="icon__container">
                                                <Link className="bg-transparent" to={`/documents-in/preview/${row.id}`}>
                                                    <div className="icon__item">
                                                        <i className="bi bi-eye eye-icon"></i>
                                                    </div>
                                                </Link>
                                                {/* <div className="icon__item">
                                                    <i className="bi bi-file-earmark-text excel-icon"></i>
                                                </div> */}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        pageCount={pageCount}
                        previousLabel="< previous"
                        renderOnZeroPageCount={null}
                        containerClassName="pagination justify-content-center"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                    />
                </div>
            </div>
        </div>
    )
}