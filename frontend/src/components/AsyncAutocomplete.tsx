import * as React from 'react';
import { CircularProgress, Omit, TextField, TextFieldProps } from '@material-ui/core';
import { Autocomplete, AutocompleteProps, UseAutocompleteSingleProps } from '@material-ui/lab';
import { useEffect, useImperativeHandle, useState } from 'react';
import { useDebounce } from 'use-debounce/lib';

interface AsyncAutocomploteProps {
    fetchOptions: (searchText) => Promise<any>;
    debounceTime?: number;
    TextFieldProps?: TextFieldProps;
    AutocompleteProps?: Omit<AutocompleteProps<any>, "renderInput"> & UseAutocompleteSingleProps<any>;
}

export interface AsyncAutocompleteComponent {
    clear: () => void;
}

const AsyncAutocomplete = React.forwardRef<AsyncAutocompleteComponent, AsyncAutocomploteProps>((props, ref) => {

    const {AutocompleteProps, debounceTime = 300, fetchOptions} = props;
    const {freeSolo, onClose, onOpen, onInputChange} = AutocompleteProps as any;
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [debouncedSearchText] = useDebounce(searchText, debounceTime);
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
        inputValue: searchText,
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
    }, [open, freeSolo]);

    useEffect(() => {
        if(!open || (debouncedSearchText === "" && freeSolo))
            return;

        let isSubscribed = true;
        (async () => {
            setLoading(true);
            try {
                const data = await fetchOptions(debouncedSearchText);
                if (isSubscribed) {
                    setOptions(data);
                }
            } finally {
                setLoading(false);
            }
        })();
        
        return () => {
            isSubscribed = false;
        }
    }, [freeSolo, debouncedSearchText, open, fetchOptions]);

    useImperativeHandle(ref, () => ({
        clear: () => {
            setSearchText("");
            setOptions([]);
        }
    }));

    return (
        <Autocomplete {...autocompleteProps}/>
    );
});

export default AsyncAutocomplete;