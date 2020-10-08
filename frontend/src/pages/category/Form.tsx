import { Box, Button, Checkbox, makeStyles, TextField, Theme } from '@material-ui/core';
import {ButtonProps} from '@material-ui/core/Button';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from '../../util/vendor/yup';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
});

const validationSchema = yup.object().shape({
    name: yup.string()
        .label("Nome")
        .required()
        .max(255),
    is_active: yup.boolean()
});

export const Form = () => {

    const classes = useStyles();

    const buttonProps: ButtonProps = {
        className: classes.submit,
        color: "secondary",
        variant: "contained"
    };

    const {register, handleSubmit, getValues, errors} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            is_active: true
        }
    });

    function onSubmit(formData, event) {
        categoryHttp
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
                error={errors.name !== undefined}
                helperText={errors.name && errors.name.message}
            />
            <TextField
                name="description"
                label="Descrição"
                multiline
                rows="4"
                fullWidth
                variant={"outlined"}
                margin={"normal"}
                inputRef={register}
            />
            <Checkbox
                name="is_active"
                inputRef={register}
                defaultChecked
            />
            Ativo?
            <Box dir="rtl">
                <Button color={"primary"} {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
}