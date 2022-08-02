import React, {useState, useEffect} from 'react'
import {useLocation, Link} from 'react-router-dom'

import {GET} from '../../../api/api'
import {dateFormatterWithoutTime, numberFormatter} from '../../../utils/formatter'

export default function Preview() {
    const id = useLocation().pathname.split('/').slice(-1)

    const [idData, setIdData] = useState({})
    const [forceUpdate, setForecUpdate] = useState(0)

    let token = JSON.parse(localStorage.getItem('token'))
    const dataUrl = `https://cabinet.mdokon.uz/services/web/api/documents-in/${id}`
    useEffect(() => {
        GET(dataUrl, token).then(response => {
            setIdData(response.data)
        })
    }, [forceUpdate])

    async function deleteProduct(token,pId) {
        try{
            return fetch(`https://cabinet.mdokon.uz/services/web/api/delete-documents-in-product/${pId}`,{
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token.access_token
                    },
                }).then(() => setForecUpdate(Math.random()))
            
             
        }catch(error){
            console.log("Delete Error: ", error)
        }
    }

    const {createdDate, currencyName, inNumber, note, organizationName,
            posName, sumSalePrice, totalAmount, productList} = idData

    return (
        <div className="page-content">
            <div className="d-flex justify-content-between mb-2">
                <div className="d-flex">
                    <h4 className="header-text">Прием товаров</h4>
                    <div className='vertical-center mt-1px'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='fz-20' aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M8.46 8.29A1 1 0 1 0 7 9.71L9.34 12L7 14.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l3-3a1 1 0 0 0 0-1.42Zm8.5 3l-3-3a1 1 0 0 0-1.42 1.42l2.3 2.29l-2.3 2.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l3-3a1 1 0 0 0 .04-1.42Z"/></svg>

                    </div>
                    <h6 className='create-sub-heading vertical-center'>Предварительный просмотр</h6>
                </div>
            </div>
            <div className='card mb-4'>
                <h4 className='preview-header'>Документ от {dateFormatterWithoutTime(createdDate)}</h4>
                <div className='d-flex flex-wrap for-span-text'>
                    <div className='me-3'>
                        <div className='d-flex justify-content-between'>
                            <span className='preview-card1-header'>Торговая точка:</span>
                            <span className='color-626262'>{posName}</span>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <span className='preview-card1-header'>Поставщик:</span>
                            <span className='color-626262'>{organizationName}</span>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <span className='preview-card1-header'>Валюта:</span>
                            <span className='color-626262'>{currencyName}</span>
                        </div>
                    </div>
                    <div className='me-3'>
                        <div className='d-flex justify-content-between'>
                            <span className='preview-card1-header'>№ Накладной:</span>
                            <span className='color-626262'>{inNumber}</span>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <span className='preview-card1-header'>Примечание:</span>
                            <span className='color-626262'>{note}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card'>
                <div className='table-responsive table-scroll w-100'>
                        <table className="table table-striped">
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
                                    console.log(p.productId)
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
                                                :   <div className='d-flex justify-content-center'>
                                                        <div className='delete-icon-container mx-4 '>
                                                            <i 
                                                                tabIndex={-1} 
                                                                onClick={() => {deleteProduct(token,p.id)}}
                                                                className="bi bi-x"
                                                                id='delete-icon'
                                                            ></i>
                                                        </div>
                                                    </div>   
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