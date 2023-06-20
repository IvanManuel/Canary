import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { SaveOutlined, UploadOutlined, WorkOutline } from '@mui/icons-material';

import { AdminLayout } from '../../../components/layouts'
import { IJob } from '../../../interfaces';
import { dbJobs } from '../../../database';
import { tesloApi } from '@/api';
import { Job } from '@/models';

const validIsland = ['El Hierro', 'Fuerteventura', 'Gran Canaria', 'La Gomera', 'Lanzarote', 'La Palma', 'Tenerife']

interface FormData {
    _id?:            string;
    shortDescription:string;
    longDescription: string;
    images:          string[];
    view:            number;
    cellPhone:       string;
    email:           string;
    slug:            string;
    island:          string;
    city:            string;
    tags:            string[];
    title:           string;
}

interface Props {
    job: IJob;
}

const JobAdminPage: FC<Props> = ({ job }) => {

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [newTagValue, setNewTagValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: job
    })

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === 'title') {
                const newSlug = value.title?.trim()
                    .replaceAll(' ', '_')
                    .replaceAll("'", '')
                    .toLocaleLowerCase() || '';

                setValue('slug', newSlug);
            }
        })

        return () => subscription.unsubscribe();
    }, [watch, setValue])


    const onNewTag = () => {
        const newTag = newTagValue.trim().toLocaleLowerCase();
        setNewTagValue('');
        const currentTags = getValues('tags');

        if (currentTags.includes(newTag)) {
            return;
        }

        currentTags.push(newTag);
    }

    const onDeleteTag = (tag: string) => {
        const updatedTags = getValues('tags').filter(t => t !== tag);
        setValue('tags', updatedTags, { shouldValidate: true })
    }

    const onFilesSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (!target.files || target.files.length === 0) {
            return;
        }

        try {

            //            console.log( file );
            for (const file of target.files) {
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await tesloApi.post<{ message: string }>('/admin/upload', formData);

                setValue('images', [...getValues('images'), data.message], { shouldValidate: true })

            }
        } catch (error) {
            console.log({ error })
        }
    }

    const onDeleteImage = (image: string) => {
        setValue('images',
            getValues('images').filter(img => img !== image),
            { shouldValidate: true }
        );
    }

    const onSubmit = async (form: FormData) => {
        if (form.images.length < 2) return alert('Mínimo 2 imágenes');
        setIsSaving(true);

        try {
            const { data } = await tesloApi({
                url: '/admin/jobs',
                method: form._id ? 'PUT' : 'POST', //si tenemos _id actualizarm sino crear
                data: form
            });

            console.log({ data })
            if (!form._id) {
                router.replace(`/admin/jobs/${form.slug}`) //Se utiliza replace para que la persona no pueda hechar para atrás en el navegador
            } else {
                setIsSaving(false)
            }

        } catch (error) {
            console.log({ error });
            setIsSaving(false);
        }

    }

    return (
        <AdminLayout
            title={'Empleo'}
            subTitle={`Editando: ${job.title}`}
            icon={<WorkOutline />}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button
                        color="secondary"
                        startIcon={<SaveOutlined />}
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={isSaving}
                    >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={6}>

                        <TextField
                            label="Título"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('title', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />

                        <TextField
                            label="Descripción corta"
                            variant="filled"
                            fullWidth
                            multiline
                            sx={{ mb: 1 }}
                            {...register('shortDescription', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.shortDescription}
                            helperText={errors.shortDescription?.message}
                        />

                        <TextField
                            label="Descripción completa"
                            variant="filled"
                            fullWidth
                            multiline
                            sx={{ mb: 1 }}
                            {...register('longDescription', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.longDescription}
                            helperText={errors.longDescription?.message}
                        />

                            {/*/Falta el validador para la entradas*/}
                        <TextField
                            label="Teléfono"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('cellPhone', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.cellPhone}
                            helperText={errors.cellPhone?.message}
                        />

                            {/*/Falta el validador para la entradas*/}
                        <TextField
                            label="Correo Electrónico"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('email', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Isla</FormLabel>
                            <RadioGroup
                                row
                                value={getValues('island')}
                                onChange={({ target }) => setValue('island', target.value, { shouldValidate: true })}
                            >
                                {
                                    validIsland.map(option => (
                                        <FormControlLabel
                                            key={option}
                                            value={option}
                                            control={<Radio color='secondary' />}
                                            label={capitalize(option)}
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <TextField
                            label="Ciudad"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('city', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('slug', {
                                required: 'Este campo es requerido',
                                validate: (val) => val.trim().includes(' ') ? 'No puede tener espacios en blanco' : undefined
                            })}
                            error={!!errors.slug}
                            helperText={errors.slug?.message}
                        />

                        <TextField
                            label="Etiquetas"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            helperText="Presiona [spacebar] para agregar"
                            value={newTagValue}
                            onChange={({ target }) => setNewTagValue(target.value)}
                            onKeyUp={({ code }) => code === 'Space' ? onNewTag() : undefined}
                        />

                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                            component="ul">
                            {
                                getValues('tags').map((tag) => {

                                    return (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            onDelete={() => onDeleteTag(tag)}
                                            color="primary"
                                            size='small'
                                            sx={{ ml: 1, mt: 1 }}
                                        />
                                    );
                                })}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={<UploadOutlined />}
                                sx={{ mb: 3 }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Cargar imagen
                            </Button>
                            <input
                                ref={fileInputRef}
                                type='file'
                                multiple
                                accept='image/png, image/jpeg, image/jpg, image/gif'
                                style={{ display: 'none' }}
                                onChange={onFilesSelected}
                            />

                            <Chip
                                label="Es necesario al 2 imagenes"
                                color='error'
                                variant='outlined'
                                sx={{
                                    mb: 1,
                                    display: getValues('images').length < 2 ? 'flex' : 'none'
                                }}
                            />

                            <Grid container spacing={2}>
                                {
                                    getValues('images').map(img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia
                                                    component='img'
                                                    className='fadeIn'
                                                    image={img}
                                                    alt={img}
                                                />
                                                <CardActions>
                                                    <Button
                                                        fullWidth
                                                        color="error"
                                                        onClick={() => onDeleteImage(img)}
                                                    >
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {

    const { id = '' } = query;

    let job: IJob | null;

    if (id === 'new') {
        //crear un porducto
        const tempJob = JSON.parse(JSON.stringify(new Job()))
        delete tempJob._id;

        tempJob.images = ['img1.jpg', 'img2.jpg'];
        job = tempJob;

    } else {
        job = await dbJobs.getJobById(id.toString());
    }

    if (!job) {
        return {
            redirect: {
                destination: '/admin/jobs',
                permanent: false,
            }
        }
    }


    return {
        props: {
            job
        }
    }
}


export default JobAdminPage