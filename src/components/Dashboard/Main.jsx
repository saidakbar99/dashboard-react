import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import ReactApexChart from 'react-apexcharts'

import { numberFormatter } from '../../utils/formatter'
import { GET } from '../../api/api'

export default function Main() {
    const [chartInfo, setChartInfo] = useState({
        grossIncome: 0,
        frozenAmount: 0,
        avgChequeAmount: 0,
        cashAmount: 0,
        cardAmount: 0
    })
    const [seriesCurrent, setSeriesCurrent] = useState([])
    const [seriesLast, setSeriesLast] = useState([])

    const options = {
        chart: {
          type: 'area',
          height: 350,
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
        },
        colors: ['#00E396','#C5D1FF'],
        title: {
          text: 'Валовый доход',
          align: 'left',
          style: {
            fontSize: '22px',
            color: '#495057',
            fontWeight:  'medium',
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          onItemClick: {
            toggleDataSeries: true
          },
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return numberFormatter(value)
            }
          }
        },
    } 
    const series = [
      {
        name: 'Текущий месяц',
        data: seriesCurrent
      }, {
        name: 'Прошлый месяц',
        data: seriesLast
      }
    ]

    const chartInfoUrl = 'https://cabinet.mdokon.uz/services/web/api/dashboard-one'
    const graphUrl = 'https://cabinet.mdokon.uz/services/web/api/dashboard-income'
    let token = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
      GET(chartInfoUrl, token).then((result) => {setChartInfo(result.data)})

      const series1 = []
      const series2 = []
        GET(graphUrl, token)
          .then((result) => {
            result.data.incomeCurrent.map((data) => {
              let date = data.incomeDate.split('-')
              series1.push({
                x: date[2],
                y: data.incomeSum
              })
              return 0
            })
            result.data.incomeLast.map((data) => {
              let date = data.incomeDate.split('-')
              series2.push({
                x: date[2],
                y: data.incomeSum
              })
            })
            setSeriesCurrent(series1)
            setSeriesLast(series2)
          })
    }, [])
    
    return(
        <div className="page-content">
            <div>
                <h4 className="header-text">Главная</h4>
            </div>
            <Row className='mb-3'>
                <Col md={3}>
                    <div className="card-item">
                        <div>
                            <p className="card-item-text mb-0">{numberFormatter(chartInfo?.grossIncome)}</p>
                            <p className="mb-0 card-item-subtext">Валовый доход</p>
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="card-item">
                        <div>
                            <p className="card-item-text mb-0">{numberFormatter(chartInfo?.frozenAmount)}</p>
                            <p className="mb-0 card-item-subtext">Замороженные средства</p>
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="card-item">
                        <div>
                            <p className="card-item-text mb-0">{numberFormatter(chartInfo?.avgChequeAmount)}</p>
                            <p className="mb-0 card-item-subtext">Средний чек</p>
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="card-item flex-column">
                        <div className="d-flex justify-content-between">
                            <p className="card-item-text mb-0">{numberFormatter(chartInfo?.cashAmount)}</p>
                            <div className="d-flex">
                              <p className="mb-0 nalichnie me-1">Наличные</p>
                              <i className="bi bi-cash nalichnie mx-2"></i>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="card-item-text mb-0">{numberFormatter(chartInfo?.cardAmount)}</p>
                            <div className="d-flex">
                              <p className="mb-0 terminal me-1">Терминал</p>
                              <i className="bi bi-credit-card terminal mx-2"></i>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="card">
                      <ReactApexChart 
                        options={options} 
                        series={series} 
                        type="area" 
                        height={350}
                      />
                    </div>
                </Col>
            </Row>
        </div>
    )
}