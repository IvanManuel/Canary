
import { FC, useMemo, useState } from "react";
import NextLink from "next/link";
import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, Grid, Link, Typography, CardActions } from "@mui/material";
import { IJob, IProduct } from "@/interfaces";
import { ExpandMore, ExpandMoreOutlined, Favorite, FavoriteBorderOutlined, LocationCityOutlined, LocationOnOutlined, Mail, Share, ShareLocationOutlined, ShareOutlined, WhatsApp } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

interface Props {
  product: IJob;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ProductCard: FC<Props> = ({ product }) => {

  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { images, shortDescription, title, longDescription, city, island, createdAt, cellPhone, email, _id } = product;

  const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));


  const productImage = useMemo(() => {
    return isHovered
      ? images[1]
      : images[0]
  }, [isHovered])

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid
      item
      sm={4}
      key={_id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        variant="outlined"
        sx={{ mt: 3, mr: 3, minWidth: 380  }} >
        <NextLink href={`/product/${_id}`} passHref prefetch={false} legacyBehavior>
          <Link>
            <CardActionArea>

              {/*
                (inStock === 0) && (
                  <Chip
                    color='primary'
                    label='No hay disponibles'
                    sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }}
                  />
                )
                */}
              <CardMedia
                sx={{ maxHeight: 300 }}
                component='img'
                className="fadeIn"
                image={productImage}
                alt={title}
                onLoad={() => setIsImageLoaded(true)}
              />

              <CardContent sx={{ mr: 1, ml: 1, mb: 3, mt: 2, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
                
                <Typography><LocationOnOutlined /> { island } - { city }</Typography>
                
                <Typography sx={{ mt: 1, ml: 1 }} fontSize={12}>Creada el { createdAt }</Typography>
                <Typography fontSize={20} sx={{ ml: 1 }} fontWeight={900}>{title}</Typography>
                <Typography sx={{ mt: 1, ml: 1 }}>{ shortDescription }</Typography>

              </CardContent>

            </CardActionArea>
          </Link>
        </NextLink>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteBorderOutlined />
          </IconButton>
          <IconButton aria-label="share">
            <ShareOutlined />
          </IconButton>

          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="Mostrar más"
          >
            <Typography>Más</Typography>
            <ExpandMoreOutlined />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography fontWeight={900}>Detalle</Typography>
            <Typography paragraph>
              { longDescription }
            </Typography>
            <IconButton aria-label="llamar">
              <WhatsApp />
              <Typography sx={{ ml: 1 }}>
                { cellPhone }
              </Typography>
            </IconButton>
            <IconButton aria-label="email">
              <Mail />
              <Typography sx={{ ml: 1 }} >
                { email }
              </Typography>
            </IconButton>

          </CardContent>
        </Collapse>

      </Card >

    </Grid >
  )
}

export default ProductCard