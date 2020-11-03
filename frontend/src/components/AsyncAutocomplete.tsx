import * as React from 'react';
import { CircularProgress, Omit, TextField, TextFieldProps } from '@material-ui/core';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

interface AsyncAutocomploteProps {
    fetchOptions: (searchText) => Promise<any>;
    TextFieldProps?: TextFieldProps;
    AutocompleteProps?: Omit<AutocompleteProps<any>, "renderInput">;
}

const AsyncAutocomplete: React.FC<AsyncAutocomploteProps> = (props) => {

    const {AutocompleteProps} = props;
    const {freeSolo, onClose, onOpen, onInputChange} = AutocompleteProps as any;
    const snackbar = useSnackbar();
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const textFieldProps: TextFieldProps = {
        margin: 'normal',
        variant: 'outlined',
        fullWidth: true,
        InputLabelProps: {shrink: true},
        ...(props.TextFieldProps && {...props.TextFieldProps})
    };

    const autocompleteProps: AutocompleteProps<any> = {
        loadingText: "Carregando...",
        noOptionsText: "Nenhum item encontrado",
        ...(props.AutocompleteProps && {...props.AutocompleteProps}),
        open,
        options,
        loading,
        onOpen() {
            setOpen(true);
            onOpen && onOpen();
        },
        onClose() {
            setOpen(false);
            onClose && onClose();
        },
        onInputChange(event, value) {
            setSearchText(value);
            onInputChange && onInputChange();
        },
        renderInput: params => {
            return <TextField
                {...params}
                {...textFieldProps}
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <>
                            {loading && <CircularProgress color={"inherit"} size={20}/>}
                            {params.InputProps.endAdornment}
                        </>
                    )
                }}
            />
        }
    };

    useEffect(() => {
        if(!open && !freeSolo)
            setOptions([]);
    },
    // eslint-disable-next-line
    [open]);

    useEffect(() => {
        if(!open || (searchText === "" && freeSolo))
            return;

        let isSubscribed = true;
        (async () => {
            setLoading(true);
            try {
                const data = await props.fetchOptions(searchText);
                if (isSubscribed) {
                    setOptions(data);
                }
            } catch (error) {
                snackbar.enqueueSnackbar(
                    "Não foi possível carregar as informações",
                    {variant: 'error'}
                )
            } finally {
                setLoading(false);
            }
        })();
        
        return () => {
            isSubscribed = false;
        }
    },
    // eslint-disable-next-line
    [freeSolo ? searchText : open]);

    return (
        <Autocomplete {...autocompleteProps}/>
    );
};

export default AsyncAutocomplete;