import { Card, CardContent, Checkbox, FormControlLabel, Grid, makeStyles, TextField, Theme, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import videoHttp from '../../../util/http/video-http';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from '../../../util/vendor/yup';
import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
import SubmitActions from '../../../components/SubmitActions';
import { DefaultForm } from '../../../components/DefaultForm';
import { Video } from '../../../util/models';
import { RatingField } from './RatingField';
import { UploadField } from './UploadField';
import AsyncAutocomplete from '../../../components/AsyncAutocomplete';
import genreHttp from '../../../util/http/genre-http';
import GridSelectedItem from '../../../components/GridSelectedItem';
import GridSelected from '../../../components/GridSelected';

const useStyles = makeStyles((theme: Theme) => ({
    cardUpload: {
        borderRadius: "4px",
        backgroundColor: "#fsfsfs",
        margin: theme.spacing(2, 0)
    }
}));

const validationSchema = yup.object().shape({
    title: yup.string()
        .label("Título")
        .required()
        .max(255),
    description: yup.string()
        .label("Sinopse")
        .required(),
    year_launched: yup.number()
        .label("Ano de lancçamento")
        .required()
        .min(1),
    duration: yup.number()
        .label("Duração")
        .required()
        .min(1),
    rating: yup.string()
        .label("Classificação")
        .required()
});

//const fileFields = Object.keys(VideoFileFieldsMap);

export const Form = () => {

    const {register, handleSubmit, getValues, setValue, errors, reset, watch, trigger} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            title: '',
            description: '',
            year_launched: '',
            duration: '',
            rating: '',
            opened: false,
            thumb_file: '',
            banner_file: '',
            trailer_file: '',
            video_file: ''
        }
    });

    const classes = useStyles();
    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} = useParams();
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const theme = useTheme();
    const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        register({name: "thumb_file"});
        register({name: "banner_file"});
        register({name: "trailer_file"});
        register({name: "video_file"});
        register({name: "rating"});
        register({name: "opened"});
    }, [register]);

    useEffect(() =>{
        if (!id)
            return;

        let isSubcribed = true;
        (async () => {
            setLoading(true);
            try {
                const {data} = await videoHttp.get(id);
                if (isSubcribed) {
                    setVideo(data.data);
                    reset(data.data);    
                }
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar(
                    "Não foi possível carregar as informações",
                    {variant: "error"}
                )
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            isSubcribed = false;
        }
    },
    // eslint-disable-next-line 
    []);

    async function onSubmit(formData, event) {
        setLoading(true);
        try {
            const http = !video
            ? videoHttp.create(formData)
            : videoHttp.update(video.id, formData);
        
            const {data} = await http;
            snackbar.enqueueSnackbar(
                'Vídeo salvo com sucesso',
                {variant: 'success'}
            );
            setTimeout(() => {
                event ? (
                    id ? history.replace(`/videos/${data.data.id}/edit`) :
                    history.push(`/videos/${data.data.id}/edit`)
                ) : history.push('/videos')
            });
        } catch (error) {
            console.log(error);
            snackbar.enqueueSnackbar(
                'Não foi possível salvar o vídeo',
                {variant: 'error'}
            );
        } finally {
            setLoading(false);
        }
        
    }

    const fetchOptions = (searchText) => genreHttp.list({
        queryParams: {
            search: searchText, all: ""
        }
    }).then(({data}) => data.data);

    
    return (
        <DefaultForm GridItemProps={{xs:12}} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="title"
                        label="Título"
                        fullWidth
                        variant={"outlined"}
                        inputRef={register}
                        disabled={loading}
                        error={errors.title !== undefined}
                        helperText={errors.title && errors.title.message}
                        InputLabelProps={{shrink: true}}
                    />
                    <TextField
                        name="description"
                        label="Sinopse"
                        multiline
                        rows="4"
                        fullWidth
                        variant={"outlined"}
                        margin={"normal"}
                        inputRef={register}
                        disabled={loading}
                        InputLabelProps={{shrink: true}}
                        error={errors.description !== undefined}
                        helperText={errors.description && errors.description.message}
                    />
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField
                                name="year_launched"
                                label="Ano de lançamento"
                                type="number"
                                fullWidth
                                variant={"outlined"}
                                margin={"normal"}
                                inputRef={register}
                                disabled={loading}
                                InputLabelProps={{shrink: true}}
                                error={errors.year_launched !== undefined}
                                helperText={errors.year_launched && errors.year_launched.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="duration"
                                label="Duração"
                                type="number"
                                fullWidth
                                variant={"outlined"}
                                margin={"normal"}
                                inputRef={register}
                                disabled={loading}
                                InputLabelProps={{shrink: true}}
                                error={errors.duration !== undefined}
                                helperText={errors.duration && errors.duration.message}
                            />
                        </Grid>
                    </Grid>
                    Elenco
                    <br/>
                    <AsyncAutocomplete
                        fetchOptions={fetchOptions}
                        AutocompleteProps={{
                            freeSolo: false,
                            getOptionLabel: option => option.name
                        }}
                        TextFieldProps={{
                            label: "Gêneros"
                        }}
                    />
                    <GridSelected>
                        <GridSelectedItem onClick={() => {}} />
                    </GridSelected>
                </Grid>
                <Grid item xs={12} md={6}>
                    <RatingField 
                        value={watch('rating')}
                        setValue={(value) => setValue('rating', value)}
                        error={errors.rating}
                        disabled={loading}
                        FormControlProps={{
                            margin: isGreaterMd ? 'none' : 'normal'
                        }}
                    />
                    <br/>
                    <Card className={classes.cardUpload}>
                        <CardContent>
                            <Typography color="primary" variant="h6">
                                Imagens
                            </Typography>
                            <UploadField
                                accept={'image/*'}
                                label={'Thumb'}
                                setValue={(value) => setValue('thumb_file', value)}
                            />
                            <UploadField
                                accept={'image/*'}
                                label={'Banner'}
                                setValue={(value) => setValue('banner_file', value)}
                            />
                        </CardContent>
                    </Card>
                    <Card className={classes.cardUpload}>
                        <CardContent>
                            <Typography color="primary" variant="h6">
                                Vídeos
                            </Typography>
                            <UploadField
                                accept={'video/mp4'}
                                label={'Trailer'}
                                setValue={(value) => setValue('trailer_file', value)}
                            />
                            <UploadField
                                accept={'video/mp4'}
                                label={'Principal'}
                                setValue={(value) => setValue('video_file', value)}
                            />
                        </CardContent>
                    </Card>
                    <br/>
                    <FormControlLabel
                        disabled={loading}
                        control={
                            <Checkbox
                                name="opened"
                                color="primary"
                                onChange={() => setValue('opened', !getValues()['opened'])}
                                checked={watch('opened')}
                            />
                        }
                        label={
                            <Typography color="primary" variant={"subtitle2"}>
                                Quero que este conteúdo apareça na seleção lançamentos
                            </Typography>
                        }
                        labelPlacement="end"
                    />
                </Grid>
            </Grid>
                            
            <SubmitActions
                disabledButtons={loading}
                handleSave={() => trigger().then(isValid => {
                    isValid && onSubmit(getValues(), null);
                })}
            />
        </DefaultForm>
    );
}