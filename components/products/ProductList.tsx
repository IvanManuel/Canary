
import { FC, useEffect, useState } from 'react'
import { Grid, Pagination } from '@mui/material'

import { ICourse, IEvent, IJob, IProduct } from '@/interfaces'
import ProductCard from './ProductCard';

interface Props {
    products: IJob[] | IEvent[] | ICourse[];
}

const pageSize: number = 6;

export const ProductList: FC<Props> = ({ products }) => {

    const productCount = products.length;
    const [pagination, setPagination] = useState({
        from: 0,
        to: pageSize
    });

    const handlePageChange = ( event: any, page: number) => {
        const from = (page - 1) * pageSize;
        const to = (page - 1) * pageSize + pageSize;

        setPagination({ from, to })
    }

    const onChangePage = () => {
        return products.slice(pagination.from, pagination.to );
    }

    useEffect(() => {
        setPagination({ from: 0, to: pageSize })
    
    }, [products])
    

    return (
        <Grid
            sx={{ mt: 2, ml: 2 }}
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
        >
            <Grid container>
                {
                    onChangePage().map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                        />
                    ))
                }
            </Grid>

            <Grid
                item
            >
                <Pagination
                count={Math.ceil(productCount / pageSize )}
                onChange={handlePageChange}
            />
            </Grid>

        </Grid>
    )
}
