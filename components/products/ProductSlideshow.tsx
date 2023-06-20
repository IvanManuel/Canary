import { FC } from "react";
import { Slide } from 'react-slideshow-image';
//yarn -D @types/react-slideshow-image
import styles from './ProductSlideshow.module.css';
import { CardMedia } from '@mui/material';

interface Props {
    images: string[];
}

export const ProductSlideshow: FC<Props> = ({ images }) => {
    return (
        <Slide
            easing="ease"
            duration={7000}
            indicators
        >
            {
                images.map(image => {
                    return (
                        <CardMedia
                            component='img'
                            className="fadeIn"
                            image={image}
                            key={image}
                        />
                    )
                })
            }
        </Slide >
    )
}
