import { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';

import { decoratePriceChartOrders } from '../redux/decorators';
import { chartOptions, dummyData } from './PriceChart.config';
import { GREEN, RED } from '../helpers';

const PriceChart = () => {
    const [priceChartData, setPriceChartData] = useState(null)

    const exchange = useSelector(state => state.exchange)
    const { filledOrders } = exchange

    useEffect(() => {
        if (filledOrders) {

            setPriceChartData(decoratePriceChartOrders(filledOrders.data))

        }
    }, [filledOrders])

    return (
        <Card style={{ minHeight: "400px" }}>
            <Card.Header>
                <h4>
                    DAPP/ETH &nbsp;

                    {priceChartData && (
                        <span>
                            {priceChartData.lastPriceChange === '+' ? (
                                <span style={{ color: GREEN }}>&#9650; {priceChartData.lastPrice}</span>
                            ) : (
                                <span style={{ color: RED }}>&#9660; {priceChartData.lastPrice}</span>
                            )}
                        </span>
                    )}
                </h4>
            </Card.Header>
            <Card.Body className='p-1'>
                {priceChartData ? (
                    <Chart options={chartOptions} series={priceChartData.series} type='candlestick' width='100%' height='100%' />
                ) : (
                    <Spinner animation="border" className='mx-auto' style={{ display: 'flex' }} />
                )}
            </Card.Body>
        </Card>
    );
}

export default PriceChart;