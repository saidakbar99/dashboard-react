import React, {useState, useEffect} from 'react'
import ReactPaginate from 'react-paginate';
import Select from 'react-select'
import Dropdown from 'react-bootstrap/Dropdown';
import {utils,writeFileXLSX} from 'xlsx'
import {DebounceInput} from 'react-debounce-input';

import { numberFormatter, onlyNumbers } from '../../utils/formatter'
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
    const [inStorage, setInStorage] = useState()
    const [posSelect, setPosSelect] = useState()
    const [orgSelect, setOrgSelect] = useState()

    const [edit, setEdit] = useState(false)
    const [editRow, setEditRow] = useState()

    const [, updateState] = useState();

    const [newAllData, setNewAllData] = useState([])

    const forceUpdate = useForceUpdate();

    // let allDataUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-pageList?page=${currentPage}&size=20`
    let allDataUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-pageList?page=${currentPage}&size=20`
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

    }, [itemOffset, currentPage, allDataUrl, totalUrl])


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
            arr.push({value: res[i].id, label: res[i].name},)
        }
    }

    function filterBtnHandler() {
        setShowDropdown(false)
        allDataUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-pageList?page=${currentPage}&size=20${posSelect ? `&posId=${posSelect.value}` : ''}${orgSelect ? `&organizationId=${orgSelect.value}` : ''}${inStorage ? `&balance=${inStorage}` : ''}${searchInput ? `&search=${searchInput}` : ''}`
        totalUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-total?${posSelect ? `&posId=${posSelect.value}` : ''}${orgSelect ? `&organizationId=${orgSelect.value}` : ''}${inStorage ? `&balance=${inStorage}` : ''}${searchInput ? `&search=${searchInput}` : ''}`
        GET(totalUrl, token).then(response => setTotalSum(response.data))
        GET(allDataUrl,token).then(response => {
            setPageCount(Math.ceil(response.headers["x-total-count"]/20))
            setAllData(response.data)
            setNewAllData(response.data)
        })
        setShowFilters(true)
        
    }
    function clearFilters() {
        setSearchInput('')
        setInStorage()
        setPosSelect()
        setOrgSelect()
        setShowFilters(false)
        allDataUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-pageList?page=${currentPage}&size=20`
        totalUrl = `https://cabinet.mdokon.uz/services/web/api/nomenclature-total`
    }

    

    function makeExcel() {
        let workbook = utils.book_new(),
        worksheet = utils.json_to_sheet(allData)

        utils.book_append_sheet(workbook, worksheet, 'SheetJS')
        writeFileXLSX(workbook, '????????????????????????.xlsx')
        //???????????????? ?????????? ?????????????????? ?????? ???? ??????????????
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
    console.log(newAllData)
    return(
        <div className="page-content">
            <div className='mb-4'>
                <h4 className="header-text">????????????????????????</h4>
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
                                placeholder='??????????...'
                                value={searchInput}
                            />
                        </div>

                        <Dropdown show={showDropdown}>
                            <Dropdown.Toggle className='mx-2 px-4' variant="outline-primary shadow-none" id="dropdown-basic" onClick={() => setShowDropdown(!showDropdown)}>
                                ????????????
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <div className='filter-dropdown-container'>
                                    <div className='row'>
                                        <div className='col'>
                                            <label>???????????????? ??????????</label>
                                            <Select
                                                options={optionsPos}
                                                placeholder=''
                                                onChange={(option) => setPosSelect(option)}
                                            />
                                        </div>

                                        <div className='col'>
                                            <label>??????????????????</label>
                                            <Select 
                                                options={optionsOrganization} 
                                                placeholder=''
                                                onChange={(option) => setOrgSelect(option)}
                                            />
                                        </div>
                                    </div>
                                    <div className='w-50 mt-2'>
                                        <label>???? ????????????</label>
                                        <input 
                                            type="text" 
                                            className='filter-drop-input'
                                            onChange={(e) => setInStorage(e.target.value)}
                                            value={inStorage}
                                            onKeyPress={onlyNumbers}
                                        />
                                    </div>
                                    <div className='d-flex justify-content-end'>
                                        <button type="button" 
                                            className="btn btn-secondary mx-2 shadow-none"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            ????????????
                                        </button>
                                        <button type="button" 
                                            className="btn btn-primary shadow-none"
                                            onClick={filterBtnHandler}
                                        >
                                            ??????????????????
                                        </button>
                                    </div>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                        
                        <button 
                            type="button" 
                            className="btn btn-outline-primary filter-btn shadow-none px-4"
                            onClick={makeExcel}
                        >
                            EXCEL
                        </button>
                    </div>
                    <div className='vertical-center'>
                        <h4 className='nomenclature-total'>
                            <b>?????????? ??????????: </b>
                            {totalSum ? numberFormatter(totalSum) : 0}
                        </h4>
                    </div>
                </div>
                { searchInput !== '' || showFilters ?
                    <div className='filter-container'>
                        <div>
                            <strong>????????????</strong>
                            <br />
                            {searchInput && <span><b>??????????:</b> {searchInput}</span>}
                            {showFilters ? <span><b>???????????????? ??????????:</b> {posSelect?.label}</span> : ''}
                            {showFilters ? <span><b>??????????????????:</b> {orgSelect?.label}</span> : ''}
                            {showFilters ? <span><b>???? ????????????:</b> {inStorage}</span> : ''}
                        </div>
                        <div>
                            <button 
                            className="btn btn-outline-secondary z-0 shadow-none vertical-center" 
                            type="button"
                            onClick={clearFilters}
                        >
                            ????????????????
                        </button>
                        </div>
                    </div>
                    : ''
                }
                
                <div className="table-responsive table-scroll mb-4">
                    <table className="table table-sm text-alignment">
                        <thead>
                            <tr className='nomenclature-thead'>
                                <th>???</th>
                                <th className='text-left'>???????????????? ??????????</th>
                                <th className='text-left'>???????????????????????? ????????????</th>
                                <th>??????????????????</th>
                                <th>??????????-??????</th>
                                <th>???????? ??????????????????????</th>
                                <th>?????????? ????????</th>
                                <th>???????? ???? ??????????????</th>
                                <th>????????????</th>
                                <th>??????????</th>
                                <th>???????? ????????????????</th>
                                <th>???? ????????????</th>
                                <th>????????????????</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allData.map((r, index) => {
                                return(
                                    <tr key={index} className='nomenclature-table-fetched'>
                                        <td>{index + 1 + currentPage * 20}</td>
                                        <td>{r.posName}</td>
                                        <td className='text-left'>{r.productName}</td>
                                        <td className='text-left'>{r.organizationName}</td>
                                        <td className='white-space-nowrap'>{r.barcode}</td>
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
                                                    className='addedProduct-input' 
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
                                                    className='addedProduct-input' 
                                                    value={newAllData[index].salePrice}
                                                    onChange={(e) => handleInputChange(e,index)}
                                                />
                                            :   numberFormatter(r.salePrice)
                                            }
                                        </td>
                                        <td>{r.currencyName}</td>
                                        <td>{r.serial}</td>
                                        <td className='white-space-nowrap'>{r.expDate}</td>
                                        <td className='white-space-nowrap'>{r.balance} {r.uomName}</td>
                                        <td>
                                            {r.lastId 
                                            ?   edit
                                                ?   editRow === index 
                                                    ?   <div className=''>
                                                            <i id='edit-icon' className="bi bi-check-square" onClick={() => changeData(newAllData[index], token)}></i>
                                                            <i id='edit-close-icon' className="bi bi-x-square" onClick={() => setEdit(false)}></i>
                                                        </div>
                                                    :   ''
                                                :   <div><i id='edit-icon' className="bi bi-pencil-square" onClick={() => canEdit(index)}></i></div>
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
                        nextLabel="???????? >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        pageCount={pageCount}
                        previousLabel="< ????????"
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
    )
}