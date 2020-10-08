import { Box, Button, makeStyles, MenuItem, TextField, Theme } from '@material-ui/core';
import {ButtonProps} from '@material-ui/core/Button';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';
import genreHttp from '../../util/http/genre-http';
import { useEffect, useState } from 'react';
//import * as yup from 'yup';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

// const validationSchema = yup.object().shape({
//     name: yup.string()
//         .required()
// });

export const Form = () => {

    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: "secondary",
        variant: "contained"
    };

    const [categories, setCategories] = useState<any[]>([]);

    const {register, handleSubmit, getValues, setValue, watch} = useForm({
        //validationSchema,
        defaultValues: {
            categories_id: []
        }
    });

    useEffect(() => {
        register({name: "categories_id"})
    }, [register]);

    useEffect(() => {
        categoryHttp
            .list()
            .then(({data}) => setCategories(data.data))
    }, []);

    function onSubmit(formData, event) {
        genreHttp
            .create(formData)
            .then((response) => console.log(response));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={"outlined"}
                inputRef={register()}
            />
            <TextField
                select
                name="categories_id"
                value={watch('categories_id')}
                label="Categories"
                margin="normal"
                variant="outlined"
                fullWidth
                onChange={e => 
                    setValue("categories_id", e.target.value as any)
                }
                SelectProps={{multiple: true}}
            >
                <MenuItem value="" disabled>
                    <em>Selecione categorias</em>
                </MenuItem>
                {
                    categories.map(
                        (category, key) => (
                            <MenuItem key={key} value={category.id}>{category.name}</MenuItem>
                        )
                    )
                }
            </TextField>
            <Box dir="rtl">
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
}