import { Card, CardContent, Checkbox, FormControlLabel, Grid, makeStyles, TextField, Theme, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import videoHttp from '../../../util/http/video-http';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from '../../../util/vendor/yup';
import { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
import SubmitActions from '../../../components/SubmitActions';
import { DefaultForm } from '../../../components/DefaultForm';
import { Video, VideoFileFieldsMap } from '../../../util/models';
import { RatingField } from './RatingField';
import { UploadField } from './UploadField';
import GenreField, { GenreFieldComponent } from './GenreField';
import CategoryField, { CategoryFieldComponent } from './CategoryField';
import CastMemberField, { CastMemberFieldComponent } from './CastMemberField';
import { useRef } from 'react';
import { MutableRefObject } from 'react';
import { InputFileComponent } from '../../../components/InputFile';
import { createRef } from 'react';
import { omit, zipObject } from 'lodash';
import useSnackbarFormError from '../../../hooks/useSnackbarFormError';
import LoadingContext from '../../../components/Loading/LoadingContext';
import { useDispatch, useSelector } from 'react-redux';
import { FileInfo, Upload, UploadModule } from '../../../store/upload/types';
import { Creators } from '../../../store/upload';
import SnackbarUpload from '../../../components/SnackbarUpload';

const useStyles = makeStyles((theme: Theme) => ({
    cardUpload: {
        borderRadius: "4px",
        backgroundColor: "#fsfsfs",
        margin: theme.spacing(2, 0)
    },
    cardOpened: {
        borderRadius: "4px",
        backgroundColor: "#fsfsfs"
    },
    cardContentOpened: {
        paddingBottom: theme.spacing(2) + "px !important"
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
        .required(),
    cast_members: yup.array()
        .label("Elenco")
        .required(),
    categories: yup.array()
        .label("Categorias")
        .required(),
    genres: yup.array()
        .label("Gêneros")
        .required()
        .test({
            message: "Cada gênero escolhido precisa ter pelo menos uma categoria selecionada",
            test(value: any){
                return value.every(
                    v => v.categories.filter(
                        cat => this.parent.categories.map(c => c.id).includes(cat.id)
                    ).length !== 0
                );
            }
        })
});

const fileFields = Object.keys(VideoFileFieldsMap);

export const Form = () => {

    const {register, handleSubmit, getValues, setValue, errors, reset, watch, trigger, formState} = useForm({
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
            video_file: '',
            genres: [],
            categories: [],
            cast_members: []
        }
    });
    useSnackbarFormError(formState.submitCount, errors);

    const classes = useStyles();
    const snackbar = useSnackbar();
    const history = useHistory();
    const {id} = useParams();
    const [video, setVideo] = useState<Video | null>(null);
    const loading = useContext(LoadingContext);
    const theme = useTheme();
    const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'));
    const castMemberRef = useRef() as MutableRefObject<CastMemberFieldComponent>;
    const genreRef = useRef() as MutableRefObject<GenreFieldComponent>;
    const categoryRef = useRef() as MutableRefObject<CategoryFieldComponent>;
    const uploadsRef = useRef(
            zipObject(fileFields, fileFields.map(() => createRef()))
        ) as MutableRefObject<{[key: string]: MutableRefObject<InputFileComponent>}>;

    const uploads = useSelector<UploadModule, Upload[]>((state) => state.upload.uploads);
    const dispatch = useDispatch();

    setTimeout(() => {
        const obj: any = {
            video: {
                id: '1',
                title: 'e o vento levou'
            },
            files: [
                {file: new File([""], "teste.mp4")}
            ]
        };
        dispatch(Creators.addUpload(obj));
    }, 1000);

    console.log(uploads);

    useEffect(() => {
        register({name: "thumb_file"});
        register({name: "banner_file"});
        register({name: "trailer_file"});
        register({name: "video_file"});
        register({name: "rating"});
        register({name: "opened"});
        register({name: "genres"});
        register({name: "categories"});
        register({name: "cast_members"});
    }, [register]);

    useEffect(() =>{
        if (!id)
            return;

        let isSubcribed = true;
        (async () => {
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
            }
        })();

        return () => {
            isSubcribed = false;
        }
    },
    // eslint-disable-next-line 
    []);

    async function onSubmit(formData, event) {
        const sendData = omit(formData, ['cast_members', 'genres', 'categories']);
        sendData['cast_members_id'] = formData['cast_members'].map(cast_member => cast_member.id);
        sendData['categories_id'] = formData['categories'].map(category => category.id);
        sendData['genres_id'] = formData['genres'].map(genre => genre.id);

        try {
            const http = !video
            ? videoHttp.create(sendData)
            : videoHttp.update(video.id, {...sendData, _method: 'PUT'}, {http: {usePost: true}});
        
            const {data} = await http;
            snackbar.enqueueSnackbar(
                'Vídeo salvo com sucesso',
                {variant: 'success'}
            );
            uploadFiles(data.data);
            id && resetForm(video);
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
        }
    }

    function resetForm(data) {
        Object.keys(uploadsRef.current).forEach(
            field => uploadsRef.current[field].current.clear()
        );
        castMemberRef.current.clear();
        genreRef.current.clear();
        categoryRef.current.clear();
        reset(data);
    }

    function uploadFiles(video) {
        const files: FileInfo[] = fileFields
            .filter(fileField => getValues()[fileField])
            .map(fileField => ({fileField, file: getValues()[fileField] as File}));

        if (!files.length) {
            return;
        }

        dispatch(Creators.addUpload({video, files}));

        snackbar.enqueueSnackbar('', {
            key: 'snackbar-upload',
            persist: true,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right'
            },
            content: (key, message) => {
                const id = key as any;
                return <SnackbarUpload id={id}/>
            }
        });
    }

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
                    <CastMemberField
                        ref={castMemberRef}
                        castMembers={watch('cast_members')}
                        setCastMembers={(value) => setValue('cast_members', value)}
                        error={errors.cast_members}
                        disabled={loading}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <GenreField
                                ref={genreRef}
                                genres={watch('genres')}
                                setGenres={(value) => setValue('genres', value)}
                                categories={watch('categories')}
                                setCategories={(value) => setValue('categories', value)}
                                error={errors.genres}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CategoryField
                                ref={categoryRef}
                                categories={watch('categories')}
                                setCategories={(value) => setValue('categories', value)}
                                genres={watch('genres')}
                                error={errors.categories}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>
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
                                ref={uploadsRef.current['thumb_file']}
                                accept={'image/*'}
                                label={'Thumb'}
                                setValue={(value) => setValue('thumb_file', value)}
                            />
                            <UploadField
                                ref={uploadsRef.current['banner_file']}
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
                                ref={uploadsRef.current['trailer_file']}
                                accept={'video/mp4'}
                                label={'Trailer'}
                                setValue={(value) => setValue('trailer_file', value)}
                            />
                            <UploadField
                                ref={uploadsRef.current['video_file']}
                                accept={'video/mp4'}
                                label={'Principal'}
                                setValue={(value) => setValue('video_file', value)}
                            />
                        </CardContent>
                    </Card>
                    <Card className={classes.cardOpened}>
                        <CardContent className={classes.cardContentOpened}>
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
                        </CardContent>
                    </Card>
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