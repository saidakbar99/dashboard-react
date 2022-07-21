import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Select from 'react-select'
import { Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {DebounceInput} from 'react-debounce-input';

import { GET } from '../../../api/api'
import { onlyNumbers, numberFormatter } from '../../../utils/formatter';
import MyModal from '../../UI/modal/MyModal';

const optionsPos = []
const optionsCategory = []
const optionsOrganization = []
const optionsCurrency = [
    { value: '1', label: 'So`m' },
    { value: '2', label: 'USD' },
]
const optionsPayment = [
    { value: '1', label: 'Наличные' },
    { value: '2', label: 'Перечисление' },
]

export default function Create() {
    const [selectDisabled, setSelectDisabled] = useState(false)

    const [barcodeSearch,setBarcodeSearch] = useState(false)

    const [createName, setCreateName] = useState('')
    const [posSelect, setPosSelect] = useState({value: 84, label: 'mDokonn'})
    const [currencySelect, setCurrnecySelect] = useState({ value: 1, label: 'So`m' })

    const [defaultVat, setDefaultVat] = useState()
    const [paymentType, setPaymentType] = useState(1)
    const [productCategory, setProductCategory] = useState(null)
    const [inNumber, setInNumber] = useState()
    const [note, setNote] = useState()
    const [organizationId, setOrganizationId] = useState(106)
    const [salePriceMarkup, setSalePriceMarkup] = useState()

    const [searchedProducts, setSearchedProducts] = useState([])

    const [showResult, setShowResult] = useState(false)
    const [waitingForSearch, setWaitingForSearch] = useState(true)

    const [addedProducts, setAddedProducts] = useState([])

    const [startDate, setStartDate] = useState(null);

    const [showQRIcon, setShowQRIcon] = useState(true)

    const [canSave, setCanSave] = useState(false)
    const [validateQty, setValidateQty] = useState(false)
    const [validateWholesalePrice, setValidateWholesalePrice] = useState(false)
    const [validateSalePrice, setValidateSalePrice] = useState(false)

    // const [totalAmount, setTotalAmount] = useState(0)
    
    function setOptions(res, arr) {
        for(let i=0;i<res.length;i++){
            arr.push({value: res[i].id, label: res[i].name},)
        }
    }

    let token = JSON.parse(localStorage.getItem('token'))
    const posUrl = 'https://cabinet.mdokon.uz/services/web/api/pos-helper'
    const categoryUrl = 'https://cabinet.mdokon.uz/services/web/api/product-category-helper'
    const organizationUrl = 'https://cabinet.mdokon.uz/services/web/api/organization-helper'
    let createUrl = `https://cabinet.mdokon.uz/services/web/api/product-in-helper?name=${createName}&posId=${posSelect.value}&barcode=${barcodeSearch}&currencyId=${currencySelect.value}`
    let createProductUrl = 'https://cabinet.mdokon.uz/services/web/api/product-instant-create'
    useEffect(()=> {
        GET(posUrl,token).then(response => {setOptions(response.data,optionsPos)})
        GET(categoryUrl,token).then(response => {setOptions(response.data,optionsCategory)})
        GET(organizationUrl,token).then(response => {setOptions(response.data,optionsOrganization)})
    }, [])

    function clearSearch() {
        if(addedProducts.length === 0){
            setSelectDisabled(false)
            setCanSave(false)
        }
        setCreateName('')
        setSearchedProducts([])
        setWaitingForSearch(true)
        setShowQRIcon(true)
    }

    function addProduct(product) {
        setAddedProducts([...addedProducts, product])
        const newSearchedProducts = searchedProducts.filter(obj => {
            return obj.productId !== product.productId
        })
        setSearchedProducts(newSearchedProducts)
        setCanSave(true)
    }
    
    function deleteProduct(id) {
        const newAddedProducts = addedProducts.filter(obj => {
            return obj.productId !== id
        })
        setAddedProducts(newAddedProducts)

        if(createName.length === 0 && addedProducts.length === 1) {
            setSelectDisabled(false)
        }
    }

    function handleInputChange(e, i, p) {
        let addedProductsCopy = [...addedProducts]
        if(e.target.name === 'price'){
            addedProductsCopy[i]['price'] = e.target.value
            addedProductsCopy[i]['wholesalePrice'] = e.target.value
            addedProductsCopy[i]['salePrice'] = e.target.value * (1+salePriceMarkup/100)
        }else{
            addedProductsCopy[i][e.target.name] = e.target.value

        }
        setAddedProducts(addedProductsCopy)
    }

    function searchHandle(e) {
        let input = e.target.value
        setShowResult(false)
        setWaitingForSearch(false)
        createUrl = `https://cabinet.mdokon.uz/services/web/api/product-in-helper?name=${input}&posId=${posSelect.value}&barcode=${barcodeSearch}&currencyId=${currencySelect.value}`
        GET(createUrl, token).then((result) => {
            if(result.data.length === 1) {
                addProduct(result.data[0])
                setCreateName('')
                setWaitingForSearch(true)
                setShowResult(false)
                
                // uniKeyCode(e,'qty')
            }else{
                setSearchedProducts(result.data)
                setShowResult(true)
                setCreateName(input)
                setWaitingForSearch(false)
                setShowQRIcon(false)
            }
        })
        setCreateName('')
        setSelectDisabled(true)
    }

    let totalAmount = 0
    let totalAmountSale = 0

    let post = {
        based: null,
        currencyId: currencySelect.value,
        currencyName: currencySelect.label,
        defaultVat: defaultVat,
        error: false,
        importExcel: false,
        inNumber: inNumber,
        note: note,
        organizationId: organizationId,
        paymentTypeId: paymentType,
        posId: posSelect.value,
        productCategoryId: productCategory,
        productSerial: false,
        salePriceMarkup: salePriceMarkup,
        totalAmount: 0,
        wholesalePriceMarkup: 0,
        productList: addedProducts
    }

    // function uniKeyCode(event, element) {
    //     let key = event.keyCode;
    //     if(key == 9) {
    //         document.getElementById(element).focus()
    //         return false
    //     }
    // }

    const newProduct = {
        barcode: 1,
        categoryId: 1,
        name: 1,
        uomId: 1
    }

    async function saveAddedProducts(post,token) {
        try{
            let response = await fetch('https://cabinet.mdokon.uz/services/web/api/documents-in',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.access_token
                    },
                    body: JSON.stringify(post)
                })
            return await response.json()
        }catch(error){
            console.log("Save Error: ", error)
        }
    }

    // async function createProduct(newProduct,token) {
    //     try{
    //         let response = await fetch('https://cabinet.mdokon.uz/services/web/api/documents-in',{
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': 'Bearer ' + token.access_token
    //                 },
    //                 body: JSON.stringify(post)
    //             })
    //         return await response.json()
    //     }catch(error){
    //         console.log("Save Error: ", error)
    //     }
    // }

    return (
        <div className="page-content h-vh120 mb-500">
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <h4 className="header-text">Прием товаров &gt;&gt;</h4>
                    <h6 className='create-sub-heading'>Создать</h6>
                </div>
            </div>
            <div className="card my-2">
                <div className='row mb-2'>
                    <Col>
                        <div>
                            <label>
                                Торговая точка
                                <span className='required-star'>*</span>
                            </label>
                            <Select
                                defaultValue={{value: 84, label: 'mDokonn'}}
                                options={optionsPos}
                                isDisabled={selectDisabled}
                                onChange={(option) => setPosSelect(option)}
                            />
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <label>
                                Поставщик
                                <span className='required-star'>*</span>
                            </label>
                            <Select 
                                options={optionsOrganization}  
                                defaultValue={{value: 106, label: 'mDokon2'}}
                                isDisabled={selectDisabled}
                                onChange={(option) => setOrganizationId(option.value)}
                            />
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <label>
                                Валюта
                                <span className='required-star'>*</span>
                            </label>
                            <Select 
                                options={optionsCurrency}
                                defaultValue={{ value: 1, label: 'So`m' }}
                                isDisabled={selectDisabled}
                                onChange={(option) => setCurrnecySelect(option)}
                            />
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <label>
                                Способ оплаты
                                <span className='required-star'>*</span>
                            </label>
                            <Select 
                                options={optionsPayment}
                                defaultValue={{ value: '1', label: 'Наличные' }}
                                onChange={(option) => setPaymentType(option.value)}
                            />
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <label>№ Накладной</label>
                            <input 
                                type="text"
                                className='createInput'
                                onChange={(e) => setInNumber(e.target.value)}
                                value={inNumber}
                            />
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <label>Примечание</label>
                            <input 
                                type="text"
                                className='createInput'
                                onChange={(e) => setNote(e.target.value)}
                                value={note}
                            />
                        </div>
                    </Col>
                </div>
                <div className='row'>
                    <Col md={2}>
                        <div>
                            <label>Наценка продажная</label>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control shadow-none"
                                    onKeyPress={onlyNumbers}
                                    onChange={(e) => setSalePriceMarkup(e.target.value)}
                                    value={salePriceMarkup}
                                />
                                <span className="input-group-text" id="basic-addon2">%</span>
                            </div>
                        </div>
                    </Col>
                    <Col md={2}>
                        <div>
                            <label>НДС</label>
                            <input 
                                type="text"
                                className='createInput'
                                onKeyPress={onlyNumbers}
                                onChange={(e) => setDefaultVat(e.target.value)}
                                value={defaultVat}
                            />
                        </div>
                    </Col>
                    <Col md={2}>
                        <div>
                            <label>Категория</label>
                            <Select
                                options={optionsCategory}
                                placeholder=''
                                onChange={(option) => setProductCategory(option.value)}
                            />
                        </div>
                    </Col>
                </div>
            </div>
                <div className="card">
                    <div className='table-responsive table-scroll w-100'>
                        <table className="table table-striped table-sm">
                            <thead>
                                <tr className='create-table'>
                                    <th id='text-left'>Наименование товара</th>
                                    <th>Штрих-код</th>
                                    <th>Остаток</th>
                                    <th>Количество</th>
                                    <th>Ед. изм</th>
                                    <th>Цена поступление</th>
                                    <th>Оптом цена</th>
                                    <th>Цена за единицу</th>
                                    <th>Серия</th>
                                    <th>Срок годности</th>
                                    <th>НДС</th>
                                    <th>Действие</th>
                                </tr>
                            </thead>
                            <tbody>
                                {addedProducts.map((p, i) => {
                                    totalAmountSale += p.salePrice * (p.quantity ? p.quantity : 0)
                                    // p.salePrice += p.salePrice * (salePriceMarkup/100)
                                    totalAmount += p.price * (p.quantity ? p.quantity : 0)
                                    post.totalAmount = totalAmount
                                    p.label = '' //fake
                                    p.serialNumbers = [] // fake
                                    p.totalAmount = p.quantity * p.price
                                    
                                    // if(addedProducts[i].quantity > 0){setValidateQty(true)}
                                    // if(parseInt(p.price) < parseInt(p.wholesalePrice)){setValidateWholesalePrice(true)}
                                    // if(parseInt(p.wholesalePrice) < parseInt(p.salePrice)){setValidateSalePrice(true)}
                                    // console.log(validateQty,validateWholesalePrice, validateSalePrice)
                                    return(
                                        <tr key={p.barcode} className='addedProduct-table'>
                                            <td>{i + 1}. {p.name}</td>
                                            <td className='text-center'>{p.barcode}</td>
                                            <td className='text-center'>{p.balance}</td>
                                            <td>
                                                <input
                                                    // id='qty'
                                                    // onKeyDown={(e) => uniKeyCode(e, 'prc')}
                                                    name='quantity'
                                                    type="text" 
                                                    className={`addedProduct-input ${addedProducts[i].quantity < 1 || addedProducts[i].quantity === undefined ? 'input-error' : ''}`}
                                                    value={p.quantity}
                                                    onChange={(e) => handleInputChange(e,i)}
                                                    onKeyPress={onlyNumbers}
                                                />
                                            </td>
                                            <td className='text-center'>{p.uomName}</td>
                                            <td>
                                                <input
                                                    // id='prc'
                                                    // onKeyDown={(e) => uniKeyCode(e, 'oprc')}
                                                    type="text"
                                                    name="price"
                                                    className='addedProduct-input'
                                                    onKeyPress={onlyNumbers}
                                                    value={p.price}
                                                    onChange={(e) => handleInputChange(e, i, p)}
                                                    
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    // id='oprc'
                                                    // onKeyDown={(e) => uniKeyCode(e, 'sprc')}
                                                    type="text" 
                                                    name="wholesalePrice"
                                                    className={`addedProduct-input ${ parseInt(p.price) > parseInt(p.wholesalePrice) ? 'input-error' : ''}`}
                                                    value={p.wholesalePrice}
                                                    onChange={(e) => handleInputChange(e, i)}
                                                    onKeyPress={onlyNumbers}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    // id='sprc'
                                                    // onKeyDown={(e) => uniKeyCode(e, 'qty')}
                                                    
                                                    type="text"
                                                    name="salePrice"
                                                    className={`addedProduct-input ${ parseInt(p.wholesalePrice) > parseInt(p.salePrice) ? 'input-error' : ''}`}
                                                    value={p.salePrice}
                                                    onChange={(e) => handleInputChange(e, i)}
                                                    onKeyPress={onlyNumbers}
                                                />
                                            </td>
                                            <td><span className="badge-pill">Не указано</span></td>
                                            <td>
                                                <DatePicker
                                                    name='expDate'
                                                    tabIndex={-1}
                                                    className='addedProduct-input'
                                                    selected={startDate}
                                                    onChange={(date) => {setStartDate(date)}}
                                                    value={startDate}
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="text"
                                                    tabIndex={-1}
                                                    name='vat'
                                                    className='addedProduct-input'
                                                    defaultValue={defaultVat}
                                                    value={p.vat}
                                                    onChange={(e) => {handleInputChange(e,i)}}
                                                />
                                            </td>
                                            <td>
                                                <button 
                                                    tabIndex={-1}
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => deleteProduct(p.productId)}
                                                >   
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className="input-group w-50 mt-4 position-relative">
                            <div className='w-100'>
                                {/* <div className='add-icon-container-add'>
                                    <i 
                                        className="bi bi-plus"
                                        id='create-add-icon'
                                        onClick={() => setModal(true)}
                                    ></i>
                                </div> */}
                                {/* <MyModal visible={modal} setVisible={setModal}>
                                    123
                                </MyModal> */}
                                
                                {showQRIcon 
                                ?   <i 
                                        onClick={() => setBarcodeSearch(!barcodeSearch)} 
                                        id='qr-icon-position' 
                                        className={`bi bi-qr-code-scan ${barcodeSearch ? 'qr-icon-active' : ''}`}
                                    ></i>
                                :   <i onClick={clearSearch} id='clear-icon-position' className="bi bi-x-lg"></i>
                                }
                                <DebounceInput
                                    className='debounce_input '
                                    minLength={3}
                                    debounceTimeout={500}
                                    onChange={e => searchHandle(e)}
                                    placeholder='Поиск...'
                                    value={createName}
                                />
                            </div>

                            {waitingForSearch ? '' : showResult 
                            ?   <div className='table-responsive position-fix bg-white table-scroll-create w-100' id='searchedProducts-table'>
                                    <table  className="table table-striped border-for-table">
                                        <thead>
                                            <tr id='create-table'>
                                                <th>Наименование товара</th>
                                                <th>Штрих-код</th>
                                                <th>Количество</th>
                                                <th>Действие</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {searchedProducts.map(p => {
                                                console.log(p)
                                                return(
                                                    <tr key={p.barcode}>
                                                        <td>{p.name}</td>
                                                        <td className='text-center'>{p.barcode}</td>
                                                        <td className='text-center'>{p.balance} {p.uomName}</td>
                                                        <td className='text-center'>
                                                            {p.productShow 
                                                            ?   <div className='add-icon-container mx-4'>
                                                                    <i 
                                                                        onClick={() =>addProduct(p)} 
                                                                        className="bi bi-plus"
                                                                        id='create-add-icon'
                                                                    ></i>
                                                                </div>
                                                            :    <span className='text-danger white-space-wrap'>Выберите другую валюту</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            :   <div className="d-flex justify-content-center my-2 text-primary position-fix w-100">
                                    <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className=''>
                            <div className='d-flex justify-content-between'>
                                <h5 className='mr-2 mb-0'>Сумма прихода: </h5>
                                <h5>{post.totalAmount ? numberFormatter(post.totalAmount) : 0}</h5>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <h5 className='mb-0'>Сумма продаж: </h5>
                                <h5>{totalAmountSale ? numberFormatter(totalAmountSale) : 0}</h5>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-end mt-4'>
                        <Link to='/documents-in'>
                            <button className='cancel-btn-create'>Отмена</button>
                        </Link>
                        <button 
                            className={`save-btn-create${canSave ? '-active' : ''}`}
                            onClick={() => saveAddedProducts(post,token)}
                            disabled={!canSave}
                        >
                            Сохранить
                        </button>
                    </div>
            </div>
        </div>
    )
}

