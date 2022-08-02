import React, {useState, useEffect} from 'react'
import ReactPaginate from 'react-paginate';
import Select from 'react-select'
import Dropdown from 'react-bootstrap/Dropdown';
import {utils,writeFileXLSX} from 'xlsx'
import {DebounceInput} from 'react-debounce-input';
import DatePicker from "react-datepicker";

import { numberFormatter, onlyNumbers, dateFormatterWithoutTime } from '../../utils/formatter'
import { GET } from '../../api/api'

const optionsPos = []
const optionsOrganization = []

const useForceUpdate = () => useState()[1];


const posUrl = 'https://cabinet.mdokon.uz/services/web/api/pos-helper'
const organizationUrl = 'https://cabinet.mdokon.uz/services/web/api/organization-helper'

export default function Nomenclature() {
    const [totalSum, setTotalSum] = useState(0)
    const [allData, setAllData] = useState([])
    const [currentPage, setCurrentPage] = useState(0)

    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    const [showDropdown, setShowDropdown] = useState(false)
    const [showFilters, setShowFilters] = useState(false)

    const [searchInput, setSearchInput] = useState('')
    const [inStorage, setInStorage] = useState(0)
    const [posSelect, setPosSelect] = useState()
    const [orgSelect, setOrgSelect] = useState()

    const [edit, setEdit] = useState(false)
    const [editRow, setEditRow] = useState()


    const [newAllData, setNewAllData] = useState([])

    const forceUpdate = useForceUpdate();
    const [clearFiltersUpdate, setClearFiltersUpdate] = useState(1)
    const [startDate, setStartDate] = useState([]);

    let allDataUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-pageList?page=${currentPage}&size=20${posSelect ? `&posId=${posSelect.value}` : ''}${orgSelect ? `&organizationId=${orgSelect.value}` : ''}${inStorage ? `&balance=${inStorage}` : ''}${searchInput ? `&search=${searchInput}` : ''}`
    let totalUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-total`
    let token = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        GET(posUrl,token).then(response => {setOptions(response.data,optionsPos)})
        GET(organizationUrl,token).then(response => {setOptions(response.data,optionsOrganization)})

        GET(totalUrl, token).then(response => setTotalSum(response.data))
        GET(allDataUrl,token).then(response => {
            setPageCount(Math.ceil(response.headers["x-total-count"]/20))
            setAllData(response.data)
            setNewAllData(response.data)
        })

    }, [itemOffset, currentPage, clearFiltersUpdate, allDataUrl, totalUrl])


    const handlePageClick = (event) => {
        const newOffset = (event.selected * 20);
        setItemOffset(newOffset);
        setCurrentPage(event.selected)
        setEdit(false)
    };

    function searchHandle(e) {
        setSearchInput(e.target.value)
        allDataUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-pageList?page=${currentPage}&size=20${posSelect ? `&posId=${posSelect.value}` : ''}${orgSelect ? `&organizationId=${orgSelect.value}` : ''}${inStorage ? `&balance=${inStorage}` : ''}${`&search=${e.target.value}`}`
        totalUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-total?${posSelect ? `&posId=${posSelect.value}` : ''}${orgSelect ? `&organizationId=${orgSelect.value}` : ''}${inStorage ? `&balance=${inStorage}` : ''}${`&search=${e.target.value}`}`
        GET(totalUrl, token).then(response => setTotalSum(response.data))
        GET(allDataUrl, token).then((result) => {
            setAllData(result.data)
            setNewAllData(result.data)
            setPageCount(0)
        })
    }

    function setOptions(res, arr) {
        for(let i=0;i<res.length;i++){
            if(arr.length !== res.length){
                arr.push({value: res[i].id, label: res[i].name},)
            }
        }
    }

    function filterBtnHandler() {
        setShowDropdown(false)
        allDataUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-pageList?page=${currentPage}&size=20${posSelect ? `&posId=${posSelect?.value}` : ''}${orgSelect ? `&organizationId=${orgSelect?.value}` : ''}${inStorage ? `&balance=${inStorage}` : ''}${searchInput ? `&search=${searchInput}` : ''}`
        totalUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-total?${posSelect ? `&posId=${posSelect.value}` : ''}${orgSelect ? `&organizationId=${orgSelect.value}` : ''}${inStorage ? `&balance=${inStorage}` : ''}${searchInput ? `&search=${searchInput}` : ''}`
        GET(totalUrl, token).then(response => setTotalSum(response.data))
        GET(allDataUrl,token).then(response => {
            setPageCount(Math.ceil(response.headers["x-total-count"]/20))
            setAllData(response.data)
            setNewAllData(response.data)
        })
        setShowFilters(true)
        
    }
    console.log(allDataUrl)
    function clearFilters() {
        setSearchInput('')
        setInStorage(0)
        setPosSelect(null)
        setOrgSelect(null)
        setShowFilters(false)
        setClearFiltersUpdate(Math.random() + 200)
        allDataUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-pageList?page=0&size=20`
        totalUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-total`
        
    }

    function makeExcel() {
        let excelUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-excel?${posSelect ? `&posId=${posSelect.value}` : ''}${orgSelect ? `&organizationId=${orgSelect.value}` : ''}${inStorage ? `&balance=${inStorage}` : ''}${searchInput ? `&search=${searchInput}` : ''}`
        const workbook = utils.book_new()
        
        GET(excelUrl,token).then(response => {
            const newArray = response.data.map((col) => {
                return (
                    {
                        'Торговая точка': col.posName,
                        'Наименование товара': col.productName,
                        'Поставщик': col.organizationName,
                        'Штрих-код': col.barcode,
                        'Цена поступление': col.price,
                        'Оптом цена': col.wholesalePrice,
                        'Цена за единицу': col.salePrice,
                        'Валюта': col.currencyName,
                        'Серия': col.serial,
                        'Срок годности': dateFormatterWithoutTime(col.expDate),
                        'На складе': col.quantity,
                        'Единица измерения': col.uomName,
                    }
                )
            })
            const worksheet = utils.json_to_sheet(newArray)
            utils.book_append_sheet(workbook, worksheet, 'SheetJS')
            writeFileXLSX(workbook, 'Номенклатура.xlsx')
        })
    }

    async function editData(post,token) {
        try{
            post.showInput = true // fake
            post.visible = true // fake
            setEdit(false)
            let response = await fetch('https://cabinet.mdokon.uz/services/web/api/nomenclature',{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.access_token
                    },
                    body: JSON.stringify(post)
                })
            return await response.json()
        }catch(error){
            console.log("Change Error: ", error)
        }

    }
    function changeData(post,token) {
        editData(post,token)
        forceUpdate()
    }

    function canEdit(rowN) {
        setEdit(true)
        setEditRow(rowN)
    }

    function handleInputChange(e, i) {
        let newAllDataCopy = [...newAllData]
        newAllDataCopy[i][e.target.name] = e.target.value
        setNewAllData(newAllDataCopy)
    }
    function changeDate(date,i) {
        let startDateCopy = [...startDate]
        startDateCopy[i] = date
        setStartDate(startDateCopy)

        let newAllDataCopy = [...newAllData]
        newAllDataCopy[i]['expDate'] = date
        setNewAllData(newAllDataCopy)
    }
    return(
        <div className="page-content">
            <div className='mb-3'>
                <h4 className="header-text vertical-center">Номенклатура</h4>
            </div>
            <div className='card'>
                <div className='d-flex justify-content-between mb-4'>
                    <div className='d-flex'>
                        <div className='searchPositionContainer'>
                            <i id='search-icon-position' className="bi bi-search"></i>
                            <DebounceInput
                                className='debounce_input'
                                minLength={3}
                                debounceTimeout={500}
                                onChange={e => searchHandle(e)}
                                placeholder='Поиск...'
                                value={searchInput}
                            />
                        </div>

                        <Dropdown show={showDropdown}>
                            <Dropdown.Toggle className='mx-2 px-4 py-2 fz-09' variant="outline-primary shadow-none" id="dropdown-basic" onClick={() => setShowDropdown(!showDropdown)}>
                                Фильтр
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <div className='filter-dropdown-container'>
                                    <div className='row'>
                                        <div className='col'>
                                            <label>Торговая точка</label>
                                            <Select
                                                options={optionsPos}
                                                placeholder=''
                                                onChange={(option) => setPosSelect(option)}
                                                value={posSelect}
                                            />
                                        </div>

                                        <div className='col'>
                                            <label>Поставщик</label>
                                            <Select 
                                                options={optionsOrganization} 
                                                placeholder=''
                                                onChange={(option) => setOrgSelect(option)}
                                                value={orgSelect}
                                            />
                                        </div>
                                    </div>
                                    <div className='w-50 mt-2'>
                                        <label>На складе</label>
                                        <input 
                                            type="text" 
                                            className='filter-drop-input'
                                            onChange={(e) => setInStorage(e.target.value)}
                                            value={inStorage ? inStorage : ''}
                                            onKeyPress={onlyNumbers}
                                        />
                                    </div>
                                    <div className='d-flex justify-content-end'>
                                        <button type="button" 
                                            className="btn btn-secondary mx-2 shadow-none"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            Отмена
                                        </button>
                                        <button type="button" 
                                            className="btn btn-primary shadow-none"
                                            onClick={filterBtnHandler}
                                        >
                                            Применить
                                        </button>
                                    </div>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                        
                        <button 
                            type="button" 
                            className="btn btn-outline-primary filter-btn shadow-none px-4 fz-09"
                            onClick={makeExcel}
                        >
                            EXCEL
                        </button>
                    </div>
                    <div className='vertical-center'>
                        <h4 className='nomenclature-total'>
                            <b>Общая сумма: </b>
                            {totalSum ? numberFormatter(totalSum) : 0}
                        </h4>
                    </div>
                </div>
                { searchInput !== '' || showFilters ?
                    <div className='filter-container'>
                        <div>
                            <strong>Фильтр</strong>
                            <br />
                            {searchInput && <span><b>Поиск:</b> {searchInput}</span>}
                            {showFilters && posSelect ? <span><b>Торговая точка:</b> {posSelect?.label}</span> : ''}
                            {showFilters && orgSelect ? <span><b>Поставщик:</b> {orgSelect?.label}</span> : ''}
                            {showFilters && inStorage ? <span><b>На складе:</b> {inStorage}</span> : ''}
                        </div>
                        <div>
                            <button 
                            className="btn btn-outline-secondary z-0 shadow-none vertical-center" 
                            type="button"
                            onClick={clearFilters}
                        >
                            Сбросить
                        </button>
                        </div>
                    </div>
                    : ''
                }
                
                <div className="table-responsive table-scroll mb-4">
                    <table className="table table-sm text-alignment">
                        <thead>
                            <tr className='nomenclature-thead'>
                                <th className='text-left'>№</th>
                                <th className='text-left'>Торговая точка</th>
                                <th className='text-left'>Наименование товара</th>
                                <th className='text-left'>Поставщик</th>
                                <th>Штрих-код</th>
                                <th>Цена поступление</th>
                                <th>Оптом цена</th>
                                <th>Цена за единицу</th>
                                <th>Валюта</th>
                                <th>Серия</th>
                                <th>Срок годности</th>
                                <th>На складе</th>
                                <th>Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allData.map((r, index) => {
                                return(
                                    <tr key={index} className='nomenclature-table-fetched'>
                                        <td className='text-left'>{index + 1 + currentPage * 20}</td>
                                        <td className='text-left'>{r.posName}</td>
                                        <td className='text-left'>{r.productName}</td>
                                        <td className='text-left'>{r.organizationName}</td>
                                        <td className='white-space-nowrap '>{r.barcode}</td>
                                        <td className='white-space-nowrap'>
                                            {edit & editRow === index
                                            ?   <input 
                                                    type='text'
                                                    name='price'
                                                    className='addedProduct-input'
                                                    value={newAllData[index].price}
                                                    onChange={(e) => handleInputChange(e,index)}
                                                />
                                            :   numberFormatter(r.price)
                                            }
                                        </td>
                                        <td className='white-space-nowrap'>
                                            {edit & editRow === index
                                            
                                            ?   <input 
                                                    type='text'
                                                    name='wholesalePrice'
                                                    className={`addedProduct-input ${ parseInt(r.price) > parseInt(r.wholesalePrice) ? 'input-error' : ''}`}
                                                    value={newAllData[index].wholesalePrice}
                                                    onChange={(e) => handleInputChange(e,index)}
                                                />
                                            :   numberFormatter(r.wholesalePrice)
                                            }
                                        </td>
                                        <td className='white-space-nowrap'>
                                            {edit & editRow === index
                                            ?   <input 
                                                    type='text'
                                                    name='salePrice'
                                                    className={`addedProduct-input ${ parseInt(r.wholesalePrice) > parseInt(r.salePrice) || parseInt(r.price) > parseInt(r.salePrice) ? 'input-error' : ''}`}
                                                    value={newAllData[index].salePrice}
                                                    onChange={(e) => handleInputChange(e,index)}
                                                />
                                            :   numberFormatter(r.salePrice)
                                            }
                                        </td>
                                        <td>{r.currencyName}</td>
                                        <td>{r.serial}</td>
                                        <td className='white-space-nowrap'>
                                            {edit & editRow === index
                                            // ?   <input 
                                            //         type='text'
                                            //         name='expDate'
                                            //         className='addedProduct-input' 
                                            //         value={newAllData[index].expDate ? newAllData[index].expDate : ''}
                                            //         onChange={(e) => handleInputChange(e,index)}
                                            //     />
                                            ?   <DatePicker
                                                    autoComplete='off'
                                                    name='expDate'
                                                    id='expDate'
                                                    dateFormat="dd.MM.yyyy"
                                                    disabledKeyboardNavigation
                                                    tabIndex={-1}
                                                    className='addedProduct-input'
                                                    selected={startDate[index]}
                                                    onChange={(date) => changeDate(date,index)}
                                                />
                                            :   dateFormatterWithoutTime(r.expDate)
                                            }
                                            {}
                                        </td>
                                        <td className='white-space-nowrap'>{r.balance} {r.uomName}</td>
                                        <td>
                                            {r.lastId 
                                            ?   edit
                                                ?   editRow === index 
                                                    ?   <div className='d-flex justify-content-center'>
                                                            <div className='check-icon-container me-2'>
                                                                <i 
                                                                    tabIndex={-1} 
                                                                    onClick={() => changeData(newAllData[index], token)}
                                                                    className="bi bi-check"
                                                                    id='check-icon'
                                                                ></i>
                                                            </div>
                                                            <div className='delete-icon-container'>
                                                                <i 
                                                                    tabIndex={-1} 
                                                                    onClick={() => setEdit(false)}
                                                                    className="bi bi-x"
                                                                    id='delete-icon'
                                                                ></i>
                                                            </div>
                                                        </div>
                                                    :   ''
                                                :   <div className='d-flex justify-content-center'>
                                                        <div className='edit-icon-container' onClick={() => canEdit(index)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" id='edit-icon' 
                                                                width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                                                <path fill="currentColor" d="M5 18h4.24a1 1 0 0 0 .71-.29l6.92-6.93L19.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71V17a1 1 0 0 0 1 1Zm9.76-13.59l2.83 2.83l-1.42 1.42l-2.83-2.83ZM6 13.17l5.93-5.93l2.83 2.83L8.83 16H6ZM21 20H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2Z"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                            :   ''
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    
                </div>
                <ReactPaginate
                        breakLabel="..."
                        nextLabel="След >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        pageCount={pageCount}
                        previousLabel="< Пред"
                        renderOnZeroPageCount={null}
                        containerClassName="pagination justify-content-start"
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
    )
}