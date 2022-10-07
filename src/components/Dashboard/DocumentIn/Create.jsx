import React, {useState, useEffect} from 'react'
// import {format,parseISO, parse} from 'date-fns';
import {Link} from 'react-router-dom'
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {DebounceInput} from 'react-debounce-input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GET } from '../../../api/api'
import { onlyNumbers, numberFormatter} from '../../../utils/formatter';
import MyModal from '../../UI/modal/MyModal'

const optionsPos = []
const optionsCategory = []
const optionsOrganization = [
    {label: 'Добавить новое'}
]
const optionsUom = []
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

    const [defaultVat, setDefaultVat] = useState(0)
    const [paymentType, setPaymentType] = useState(1)
    const [productCategory, setProductCategory] = useState(null)
    const [inNumber, setInNumber] = useState()
    const [note, setNote] = useState()
    const [organizationId, setOrganizationId] = useState(106)
    const [salePriceMarkup, setSalePriceMarkup] = useState(0)

    const [searchedProducts, setSearchedProducts] = useState([])

    const [showResult, setShowResult] = useState(false)
    const [waitingForSearch, setWaitingForSearch] = useState(true)

    const [addedProducts, setAddedProducts] = useState([])

    const [startDate, setStartDate] = useState([]);

    const [showQRIcon, setShowQRIcon] = useState(true)

    const [canSave, setCanSave] = useState(false)

    const [modal, setModal] = useState(false)
    const [newBarcode, setNewBarcode] = useState('')
    const [newProductName, setNewProductName] = useState('')
    const [newCategory, setNewCategory] = useState(1)
    const [newUom, setNewUom] = useState(1)
    const [canAdd, setCanAdd] = useState(false)

    const [modalOrg, setModalOrg] = useState(false)
    const [newOrg, setNewOrg] = useState('')
    const [newPhone, setNewPhone] = useState('')
    const [canSaveOrg, setCanSaveOrg] = useState(false)

    const [modalSerial, setModalSerial] = useState(false)
    const [serials, setSerials] = useState([])
    const [newSerial, setNewSerial] = useState('')
    const [serialProduct, setSerialProduct] = useState({})
    const [serialProductIndex, setSerialProductIndex] = useState()

    const [isSearchEmpty, setIsSearchEmpty] = useState(false)
    
    function setOptions(res, arr) {
        for(let i=0;i<res.length;i++){
            if(arr.length !== res.length){
                arr.push({value: res[i].id, label: res[i].name},)
            }
        }
    }

    let token = JSON.parse(localStorage.getItem('token'))
    const posUrl = 'https://cabinet.mdokon.uz/services/web/api/pos-helper'
    const categoryUrl = 'https://cabinet.mdokon.uz/services/web/api/product-category-helper'
    const organizationUrl = 'https://cabinet.mdokon.uz/services/web/api/organization-helper'
    let createUrl = `https://cabinet.mdokon.uz/services/web/api/product-in-helper?name=${createName}&posId=${posSelect.value}&barcode=${barcodeSearch}&currencyId=${currencySelect.value}`
    let createProductUrl = 'https://cabinet.mdokon.uz/services/web/api/product-instant-create'
    let createProductHelperUrl = 'https://cabinet.mdokon.uz/services/web/api/product-uom-helper'
    let createOrgUrl = 'https://cabinet.mdokon.uz/services/web/api/organization-instant-create'
    
    useEffect(()=> {
        GET(posUrl,token).then(response => {setOptions(response.data,optionsPos)})
        GET(categoryUrl,token).then(response => {setOptions(response.data,optionsCategory)})
        GET(organizationUrl,token).then(response => {setOptions(response.data,optionsOrganization)})
        GET(createProductHelperUrl,token).then(response => {setOptions(response.data, optionsUom)})
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
        // Promise.resolve()
        //     .then(() => { setAddedProducts([...addedProducts, product])})
        //     .then(() => {
        //         if(barcodeSearch){
        //             afterAddInput.current.focus()
        //      }
        // })
        const byId = document.getElementById(addedProducts.length)
        setTimeout(() => {
            byId.select()
        }, 200);

        product.serialNumbers = []
        product.quantity = ''
        setAddedProducts([...addedProducts, product])
        
        const newSearchedProducts = searchedProducts.filter(obj => {
            return obj.productId !== product.productId
        })
        setSearchedProducts(newSearchedProducts)
        setCanSave(true)
        if(searchedProducts.length === 1){
            clearSearch()
            setShowResult(false)
        }
        
        
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
            addedProductsCopy[i]['salePrice'] = salePriceMarkup ? e.target.value*(Math.floor(1+salePriceMarkup/100)) : e.target.value
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
            // if(result.data.length < 2) {
            //     addProduct(result.data[0])
            //     setWaitingForSearch(true)
            //     setShowResult(false)
            //     setCanSave(true)
            //     setCreateName("")
            // }
            if(barcodeSearch){
                addProduct(result.data[0])
                setWaitingForSearch(true)
                setShowResult(false)
                setCanSave(true)
                setCreateName("")
            }else{
                setSearchedProducts(result.data)
                setShowResult(true)
                setCreateName(input)
                setWaitingForSearch(false)
                setShowQRIcon(false)
                setIsSearchEmpty(false)
                if(result.data.length<1){
                    setIsSearchEmpty(true)
                }
            }
        })
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

    const newProduct = {
        barcode: newBarcode,
        categoryId: newCategory,
        name: newProductName,
        uomId: newUom
    }
    const newOrganisation = {
        name: newOrg,
        phone: newPhone
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

    async function createProduct(newProduct,token) {
        try{
            let response = await fetch(createProductUrl,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.access_token
                    },
                    body: JSON.stringify(newProduct)
                })
            let finalResult = await response.json()
            addProduct(finalResult)
            return finalResult
        }catch(error){
            console.log("Save Error: ", error)
        }
    }

    function createNewProduct(newProduct,token) {
        closeModal()
        createProduct(newProduct, token)
    }

    function changeDate(date,i) {
        // const result_date = format(parseISO(date), 'dd.MM.yyyy')
        let startDateCopy = [...startDate]
        startDateCopy[i] = date
        setStartDate(startDateCopy)

        let addedProductsCopy = [...addedProducts]
        addedProductsCopy[i]['  '] = date
        setAddedProducts(addedProductsCopy)

    }

    function closeModal() {
        setNewBarcode('')
        setNewProductName('')
        setModal(false)
        setCanAdd(false)
    }

    function closeModalOrg() {
        setModalOrg(false)
        setNewOrg('')
        setNewPhone('')
        setCanSaveOrg(false)
    }
    function openModalSerial(product,index){
        setModalSerial(true)
        setSerialProduct(product)
        setSerialProductIndex(index)
        if(product.serialNumbers){
            setSerials(product.serialNumbers)
        }
    }
    function closeModalSerial() {
        setModalSerial(false)
        setSerials([])
        setNewSerial('')
    }
    function saveModalSerial() {
        let addedProductsCopy2 = [...addedProducts]
        addedProductsCopy2[serialProductIndex].serialNumbers = serials
        setAddedProducts(addedProductsCopy2)
        closeModalSerial()
    }
    const Success = () => {
        if(newBarcode && newProductName) {
            toast.success('Успешно!', {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
        }
    }
    function chooseOrg(option) {
        if(option.label === 'Добавить новое'){
            setModalOrg(true)
        }else{
            setOrganizationId(option.value)
        }
    }
    function addSerial(serial) {
        if(serials.includes(serial)){
            setNewSerial('')
        }else{
            setSerials([...serials,serial])
        }
        setNewSerial('')
    }
    function deleteSerial(serial) {
        const newSerials = serials.filter(item => {
            return item !== serial
        })
        setSerials(newSerials)
    }
    async function createOrg(newOrganisation,token) {
        closeModalOrg()
        Success()
        try{
            let response = await fetch(createOrgUrl,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.access_token
                    },
                    body: JSON.stringify(newOrganisation)
                })
            return await response.json()
        }catch(error){
            console.log("Save Error: ", error)
        }
    }
    return (
        <div className="page-content h-vh120 mb-500">
            <ToastContainer
                limit={1}
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
            />
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <h4 className="header-text">Прием товаров</h4>
                    <div className='vertical-center mt-1px'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='fz-20' aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M8.46 8.29A1 1 0 1 0 7 9.71L9.34 12L7 14.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l3-3a1 1 0 0 0 0-1.42Zm8.5 3l-3-3a1 1 0 0 0-1.42 1.42l2.3 2.29l-2.3 2.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l3-3a1 1 0 0 0 .04-1.42Z"/></svg>
                    </div>
                    <h6 className='create-sub-heading vertical-center'>Создать</h6>
                </div>
            </div>
            <div className="card mt-2 mb-3">
                <div className='row mb-2'>
                    <div className='col-xl-2'>
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
                                className='fz-09'
                            />
                        </div>
                    </div>
                    <div className='col-xl-2'>
                        <div>
                            <label>
                                Поставщик
                                <span className='required-star'>*</span>
                            </label>
                            <Select 
                                options={optionsOrganization}  
                                defaultValue={{value: 106, label: 'mDokon2'}}
                                isDisabled={selectDisabled}
                                onChange={(option) => chooseOrg(option)}
                                className='fz-09'
                            />
                        </div>
                    </div>
                    <div className='col-xl-2'>
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
                                className='fz-09'
                            />
                        </div>
                    </div>
                    <div className='col-xl-2'>
                        <div>
                            <label>
                                Способ оплаты
                                <span className='required-star'>*</span>
                            </label>
                            <Select 
                                options={optionsPayment}
                                defaultValue={{ value: '1', label: 'Наличные' }}
                                onChange={(option) => setPaymentType(option.value)}
                                className='fz-09'
                            />
                        </div>
                    </div>
                    <div className='col-xl-2'>
                        <div>
                            <label>№ Накладной</label>
                            <input 
                                type="text"
                                className='createInput fz-09'
                                onChange={(e) => setInNumber(e.target.value)}
                                value={inNumber}
                            />
                        </div>
                    </div>
                    <div className='col-xl-2'>
                        <div>
                            <label>Примечание</label>
                            <input 
                                type="text"
                                className='createInput fz-09'
                                onChange={(e) => setNote(e.target.value)}
                                value={note}
                            />
                        </div>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-xl-2'>
                        <div>
                            <label>Наценка продажная</label>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control shadow-none fz-09"
                                    onKeyPress={onlyNumbers}
                                    onChange={(e) => setSalePriceMarkup(e.target.value)}
                                    value={salePriceMarkup ? salePriceMarkup : ''}
                                />
                                <span className="input-group-text" id="basic-addon2">%</span>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-2'>
                        <div>
                            <label>НДС</label>
                            <input 
                                type="text"
                                className='createInput fz-09'
                                onKeyPress={onlyNumbers}
                                onChange={(e) => setDefaultVat(e.target.value)}
                                value={defaultVat ? defaultVat : ''}
                            />
                        </div>
                    </div>
                    <div className='col-xl-2' >
                        <div>
                            <label>Категория</label>
                            <Select
                                options={optionsCategory}
                                placeholder=''
                                onChange={(option) => setProductCategory(option.value)}
                                className='fz-09'
                            />
                        </div>
                    </div>
                </div>
            </div>
                <div className="card">
                    <div className='table-responsive mb-3 table-scroll-create '>
                        <table className="table table-striped mb-0 table-sm">
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
                                    p.vat = 0
                                    totalAmountSale += parseInt(p.salePrice) * (p.quantity ? p.quantity : 0)
                                    totalAmount += p.price * (p.quantity ? p.quantity : 0)
                                    post.totalAmount = totalAmount
                                    p.label = '' //fake
                                    p.totalAmount = (p.quantity ? p.quantity : 0) * p.price
                                    return(
                                        <tr key={p.barcode} className='addedProduct-table'>
                                            <td>{i + 1}. {p.name}</td>
                                            <td className='text-center'>{p.barcode}</td>
                                            <td className='text-center'>{p.balance ? p.balance : 0}</td>
                                            <td>
                                                <div className='d-flex justify-content-center'>
                                                    <input
                                                        name='quantity'
                                                        id={i+1}
                                                        type="text" 
                                                        className={`addedProduct-input ${addedProducts[i].quantity < 1 || addedProducts[i].quantity === undefined ? 'input-error' : ''}`}
                                                        value={p?.quantity}
                                                        onChange={(e) => handleInputChange(e,i)}
                                                        onKeyPress={onlyNumbers}
                                                        autoComplete='off'
                                                    />
                                                </div>
                                            </td>
                                            <td className='text-center'>{p.uomName}</td>
                                            <td>
                                                <div className='d-flex justify-content-center'>
                                                    <input
                                                        type="text"
                                                        name="price"
                                                        className='addedProduct-input'
                                                        onKeyPress={onlyNumbers}
                                                        value={p.price}
                                                        onChange={(e) => handleInputChange(e, i, p)}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className='d-flex justify-content-center'>
                                                    <input 
                                                        type="text" 
                                                        name="wholesalePrice"
                                                        className={`addedProduct-input ${ parseInt(p.price) > parseInt(p.wholesalePrice) ? 'input-error' : ''}`}
                                                        value={p.wholesalePrice}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                        onKeyPress={onlyNumbers}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className='d-flex justify-content-center'>
                                                    <input 
                                                        type="text"
                                                        name="salePrice"
                                                        className={`addedProduct-input ${ parseInt(p.wholesalePrice) > parseInt(p.salePrice) ? 'input-error' : ''}`}
                                                        value={p.salePrice}
                                                        onChange={(e) => handleInputChange(e, i)}
                                                        onKeyPress={onlyNumbers}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className='d-flex justify-content-center'>
                                                    {p.serialNumbers?.length
                                                    ?   p.serialNumbers.length === 1
                                                        ?   <span 
                                                                className="bg-5b73e8 bg-border text-white text-nowrap cursor"
                                                                onClick={() => openModalSerial(p,i)}
                                                            >
                                                                {p.serialNumbers[0]}
                                                            </span>
                                                        :   <span 
                                                                className="bg-5b73e8 bg-border text-white text-nowrap cursor"
                                                                onClick={() => openModalSerial(p,i)}
                                                            >
                                                                Указано
                                                            </span>
                                                    :   <span 
                                                            className="bg-danger bg-border text-white text-nowrap cursor"
                                                            onClick={() => openModalSerial(p,i)}
                                                        >
                                                            Не указано
                                                        </span>
                                                }
                                                </div>
                                            </td>
                                            <td>
                                                <div className='d-flex justify-content-center'>
                                                    <DatePicker
                                                        name='expDate'
                                                        id='expDate'
                                                        dateFormat="dd.MM.yyyy"
                                                        disabledKeyboardNavigation
                                                        tabIndex={-1}
                                                        className='addedProduct-input'
                                                        selected={startDate[i]}
                                                        onChange={(date) => {changeDate(date,i)}}
                                                        onKeyPress={onlyNumbers}
                                                        autoComplete='off'
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className='d-flex justify-content-center'>
                                                    <input 
                                                        type="text"
                                                        tabIndex={-1}
                                                        name='vat'
                                                        className='addedProduct-input'
                                                        defaultValue={defaultVat}
                                                        value={p.vat ? p.vat : 0}
                                                        onChange={(e) => {handleInputChange(e,i)}}
                                                        onKeyPress={onlyNumbers}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className='d-flex justify-content-center'>
                                                    <div className='delete-icon-container mx-4 '>
                                                        <i 
                                                            tabIndex={-1} 
                                                            onClick={() => deleteProduct(p.productId)}
                                                            className="bi bi-x"
                                                            id='delete-icon'
                                                        ></i>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className="input-group w-50 mt-2 position-relative">
                            <div className='w-100'>
                                <div className='input-plus-icon'>
                                    <div className='add-icon-container mx-4'>
                                        <i 
                                            onClick={() => setModal(true)}
                                            className="bi bi-plus"
                                            id='create-add-icon'
                                        ></i>
                                    </div>
                                </div>
                                {showQRIcon 
                                ?   <svg onClick={() => setBarcodeSearch(!barcodeSearch)} className={`search-barcode ${barcodeSearch ? 'qr-icon-active' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 0-2 0v4a3 3 0 0 0 3 3h4a1 1 0 0 0 0-2Zm14-6a1 1 0 0 0-1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 0 0 2h4a3 3 0 0 0 3-3v-4a1 1 0 0 0-1-1ZM20 1h-4a1 1 0 0 0 0 2h4a1 1 0 0 1 1 1v4a1 1 0 0 0 2 0V4a3 3 0 0 0-3-3ZM2 9a1 1 0 0 0 1-1V4a1 1 0 0 1 1-1h4a1 1 0 0 0 0-2H4a3 3 0 0 0-3 3v4a1 1 0 0 0 1 1Zm8-4H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1ZM9 9H7V7h2Zm5 2h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1Zm1-4h2v2h-2Zm-5 6H6a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Zm-1 4H7v-2h2Zm5-1a1 1 0 0 0 1-1a1 1 0 0 0 0-2h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1Zm4-3a1 1 0 0 0-1 1v3a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Zm-4 4a1 1 0 1 0 1 1a1 1 0 0 0-1-1Z"/>
                                    </svg>
                                :   <i onClick={clearSearch} id='clear-icon-position' className="bi bi-x-lg"></i>
                                }
                                <DebounceInput
                                    className='debounce_input '
                                    minLength={3}
                                    debounceTimeout={500}
                                    onChange={e => searchHandle(e)}
                                    placeholder='Поиск...'
                                    value={createName ? createName : ''}
                                />
                            </div>

                            {waitingForSearch ? '' : showResult 
                            ?   isSearchEmpty
                                ?   <span className='dropdown-search-menu'>
                                        <div className="dropdown-menu-list d-flex justify-content-between p-2">
                                            <span className="dropdown-menu-result fz-20 c-626262">Товар не найден</span>
                                        </div>
                                    </span>
                                :   <div className='table-responsive position-fix bg-white table-scroll-create-y w-100 p-3 dropdown-table' id='searchedProducts-table'>
                                        <table  className="table table-striped border-for-table">
                                            <thead>
                                                <tr id='create-table'>
                                                    <th className='text-left vertical-center'>Наименование товара</th>
                                                    <th className='text-center vertical-center'>Штрих-код</th>
                                                    <th className='text-center vertical-center'>Количество</th>
                                                    <th className='text-center vertical-center'>Действие</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {searchedProducts.map(p => {
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
                        <div className='flex-column'>
                            <h5 className='d-flex justify-content-between mb-0'>
                                <strong className='me-2'>Сумма прихода: </strong>
                                {post.totalAmount ? numberFormatter(post.totalAmount) : '0.00'}
                            </h5>
                            <h5 className='d-flex justify-content-between mb-0'>
                                <strong className='me-2'>Сумма продаж: </strong>
                                {totalAmountSale ? numberFormatter(totalAmountSale) : '0.00'}
                            </h5>
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
            <MyModal  visible={modal} setVisible={setModal}>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <div className='modal-title h4'>Новый продукт</div>
                        <button type='button' className='btn-close outline-none' onClick={closeModal}></button>
                    </div>
                    <div className='modal-body'>
                        <div>
                            <div className='form-group'>
                                <label className='fz-08'>
                                    Наименование товара
                                    <span className='required-star'>*</span>
                                </label>
                                <input 
                                    type="text"
                                    className='createInput fz-09'
                                    onChange={(e) => {setNewProductName(e.target.value); setCanAdd(newProductName && newBarcode)}}
                                    value={newProductName}
                                />
                            </div>
                            <div className='form-group'>
                                <label className='fz-08'>
                                    Штрих-код
                                    <span className='required-star'>*</span>
                                </label>
                                <input 
                                    type="text"
                                    className='createInput fz-09'
                                    onChange={(e) => {setNewBarcode(e.target.value); setCanAdd(newProductName && newBarcode)}}
                                    value={newBarcode}
                                    onKeyPress={onlyNumbers}
                                />
                            </div>
                            <div className='form-group'>
                                <label className='fz-08'>
                                    Категория
                                </label>
                                <Select
                                    defaultValue={{value: 1, label: 'Продукты питания'}}
                                    options={optionsCategory}
                                    onChange={(option) => setNewCategory(option.value)}
                                    className='fz-09'
                                />
                            </div>
                            <div className='form-group'>
                                <label className='fz-08'>
                                    Единица измерения
                                </label>
                                <Select
                                    defaultValue={{value: 1, label: 'шт'}}
                                    options={optionsUom}
                                    onChange={(option) => setNewUom(option.value)}
                                    className='fz-09'
                                />
                            </div>
                            <div className='d-flex w-100 mt-3'>
                                <button 
                                    className='w-100 me-2 btn btn-outline-warning' 
                                    tabIndex={-1}
                                    onClick={closeModal}
                                >
                                    Отмена
                                </button>
                                <button 
                                    type='submit' 
                                    className='btn btn-primary w-100'
                                    tabIndex={-1}
                                    onClick={() => {createNewProduct(newProduct, token); Success()}}
                                    disabled={!canAdd}
                                >
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </MyModal>
            <MyModal  visible={modalOrg} setVisible={setModalOrg}>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <div className='modal-title h4'>Поставщик</div>
                        <button type='button' className='btn-close outline-none' onClick={closeModalOrg}></button>
                    </div>
                    <div className='modal-body'>
                        <div>
                            <div className='form-group'>
                                <label className='fz-08'>
                                    Название
                                    <span className='required-star'>*</span>
                                </label>
                                <input 
                                    type="text"
                                    className='createInput fz-09'
                                    onChange={(e) => {setNewOrg(e.target.value); setCanSaveOrg(newOrg && newPhone)}}
                                    value={newOrg}
                                />
                            </div>
                            <div className='form-group'>
                                <label className='fz-08'>
                                    Телефон
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-f5f6f8 fz-09" id="basic-addon2">998</span>
                                    <input 
                                        type="text" 
                                        className="form-control shadow-none fz-09"
                                        onKeyPress={onlyNumbers}
                                        value={newPhone}
                                        onChange={(e) => {setNewPhone(e.target.value); setCanSaveOrg(newOrg && newPhone)}}
                                    />
                                </div>
                                {/* <input 
                                    type="text"
                                    className='createInput fz-09'
                                    onChange={(e) => {setNewBarcode(e.target.value); setCanAdd(newProductName && newBarcode)}}
                                    value={newBarcode}
                                    onKeyPress={onlyNumbers}
                                /> */}
                            </div>
                            <div className='d-flex w-100 mt-3'>
                                <button 
                                    className='w-100 me-2 btn btn-outline-warning' 
                                    tabIndex={-1}
                                    onClick={closeModalOrg}
                                >
                                    Отмена
                                </button>
                                <button 
                                    type='submit' 
                                    className='btn btn-primary w-100'
                                    tabIndex={-1}
                                    onClick={() => {createOrg(newOrganisation, token)}}
                                    disabled={!canSaveOrg}
                                >
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </MyModal>
            <MyModal visible={modalSerial} setVisible={setModalSerial}>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <div className='modal-title h4'>Регистрация серийного продукта</div>
                        <button type='button' className='btn-close outline-none' onClick={closeModalSerial}></button>
                    </div>
                    <div className='modal-body'>
                        <div className='mb-2 c-626262'>
                            <strong>Наименование товара:</strong>{serialProduct.name}
                            <br />
                            <strong>Количество:</strong>{serialProduct.quantity}
                            <br />
                            <strong>Ед.изм:</strong>{serialProduct.uomName}
                            <br />
                        </div>
                        <div className='d-flex justify-content-between mb-2'>
                            <input 
                                type="text" 
                                className='form-control me-2 outline-none'
                                tabIndex={-1}
                                value={newSerial}
                                onChange={(e) => setNewSerial(e.target.value)}
                            />
                            <button
                                tabIndex={-1}
                                onClick={() => {addSerial(newSerial)}}
                                disabled={!newSerial}
                                className='btn btn-primary outline-none'
                            >
                                Добавить
                            </button>
                        </div>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>№</th>
                                    <th>Серия</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {serials.map((serial, i) => {
                                    return(
                                        <tr key={serial + Math.random()}>
                                            <td>{i+1}</td>
                                            <td>{serial}</td>
                                            <td>
                                                <div className='delete-icon-container' onClick={() => deleteSerial(serial)}>
                                                    <svg className='fz-18 bin-icon'
                                                        xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M10 18a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1ZM20 6h-4V5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2ZM10 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm7 14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8h10Zm-3-1a1 1 0 0 0 1-1v-6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1Z"/>
                                                    </svg>
                                                </div>
                                            </td>
                                        </tr>
                                    )})
                                }
                            </tbody>
                        </table>
                            
                        <div className='d-flex w-100 mt-3'>
                            <button 
                                className='w-100 me-2 btn btn-outline-warning' 
                                tabIndex={-1}
                                onClick={closeModalSerial}
                            >
                                Отмена
                            </button>
                            <button 
                                type='submit' 
                                className='btn btn-primary w-100'
                                tabIndex={-1}
                                onClick={saveModalSerial}
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </MyModal>
        </div>
    )
}