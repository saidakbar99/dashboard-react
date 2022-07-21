import React, {useState, useEffect} from 'react'
import {useLocation, Link} from 'react-router-dom'


import {GET} from '../../../api/api'
import {dateFormatterWithoutTime, numberFormatter} from '../../../utils/formatter'

export default function Preview() {
    const id = useLocation().pathname.split('/').slice(-1)

    const [idData, setIdData] = useState({})

    let token = JSON.parse(localStorage.getItem('token'))
    const dataUrl = `https://cabinet.mdokon.uz/services/web/api/documents-in/${id}`
    const deleteUrl = `https://cabinet.mdokon.uz/services/web/api/delete-documents-in-product/${id}`
    useEffect(() => {
        GET(dataUrl, token).then(response => {
            setIdData(response.data)
        })
    }, [])

    async function deleteProduct(token) {
        try{
            let response = await fetch(deleteUrl,{
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.access_token
                    },
                })
            return await response.json()
        }catch(error){
            console.log("Delete Error: ", error)
        }
    }

    const {createdDate, currencyId, currencyName, inNumber, note, organizationId,
    organizationName, paymentTypeId, paymentTypeName, posId, posName, sumDifference,
    sumPrice, sumSalePrice, totalAmount, productList} = idData

    console.log()
    return (
        <div className="page-content">
            <div className="d-flex justify-content-between mb-2">
                <div className="d-flex">
                    <h4 className="header-text">Прием товаров &gt;&gt;</h4>
                    <h6 className='create-sub-heading'>Предварительный просмотр</h6>
                </div>
            </div>
            <div className='card mb-4'>
                <h4 className='preview-header'>Документ от {dateFormatterWithoutTime(createdDate)}</h4>
                <div className='d-flex flex-wrap for-span-text'>
                    <div className='me-3'>
                        <div className='d-flex justify-content-between'>
                            <span className='preview-card1-header'>Торговая точка:</span>
                            <span>{posName}</span>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <span className='preview-card1-header'>Поставщик:</span>
                            <span>{organizationName}</span>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <span className='preview-card1-header'>Валюта:</span>
                            <span>{currencyName}</span>
                        </div>
                    </div>
                    <div className='me-3'>
                        <div className='d-flex justify-content-between'>
                            <span className='preview-card1-header'>№ Накладной:</span>
                            <span>{inNumber}</span>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <span className='preview-card1-header'>Примечание:</span>
                            <span>{note}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card'>
                <div className='table-responsive table-scroll w-100'>
                        <table className="table table-striped table-sm">
                            <thead>
                                <tr className='create-table'>
                                    <th id='text-left'>Наименование товара</th>
                                    <th>Штрих-код</th>
                                    <th>Цена поступление</th>
                                    <th>Серия</th>
                                    <th>Срок годности</th>
                                    <th>Количество</th>
                                    <th>Оптом цена</th>
                                    <th>Цена за единицу</th>
                                    <th>НДС</th>
                                    <th>Сумма</th>
                                    <th>Действие</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productList?.content.map((p,i) => {
                                    return(
                                        <tr key={p.barcode} className='preview-table'>
                                            <td id='text-left'>{i+1}. {p.productName}</td>
                                            <td>{p.barcode}</td>
                                            <td>{p.price}</td>
                                            <td>{p.serial}</td>
                                            <td>{dateFormatterWithoutTime(p.expDate)}</td>
                                            <td>{p.quantity} {p.uomName}</td>
                                            <td>{p.wholesalePrice}</td>
                                            <td>{p.salePrice}</td>
                                            <td>{p.vat}</td>
                                            <td>{p.totalAmount}</td>
                                            <td>
                                                {p.status
                                                ?   p.status === 1
                                                    ?   <span className='text-danger'>Используется</span>
                                                    :   <span className='text-danger'>Удалено</span>
                                                :   <i 
                                                        id='edit-close-icon' 
                                                        className="bi bi-x-square" 
                                                        onClick={() => deleteProduct(token)}
                                                    ></i>
                                                }
                                                
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className='d-flex justify-content-end w-100'>
                        <div className=' flex-column obshiy-preview'>
                            <h5 className='d-flex justify-content-between'>
                                <strong className='me-4'>Сумма прихода: </strong>
                                {totalAmount ? numberFormatter(totalAmount) : 0} {currencyName}
                            </h5>
                            <h5 className='d-flex justify-content-between'>
                                <strong className='me-2'>Сумма продаж: </strong>
                                {sumSalePrice ? numberFormatter(sumSalePrice) : 0} {currencyName}
                            </h5>
                            <h5 className='d-flex justify-content-between'>
                                <strong className='me-2'>Доход: </strong>
                                {totalAmount & sumSalePrice ? numberFormatter(sumSalePrice - totalAmount) : 0} {currencyName}
                            </h5>
                        </div>
                    </div>
                    <div className='d-flex justify-content-end mt-5'>
                        <Link to='/documents-in'>
                            <button className='cancel-btn-create'>Отмена</button>
                        </Link>
                    </div>
            </div>
        </div>
    )
}