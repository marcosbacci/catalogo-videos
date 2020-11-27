import { FormControl, FormControlProps, FormHelperText, Typography } from '@material-ui/core';
import * as React from 'react';
import { useCallback, useImperativeHandle } from 'react';
import { MutableRefObject } from 'react';
import { useRef } from 'react';
import AsyncAutocomplete, { AsyncAutocompleteComponent } from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandle from '../../../hooks/useHttpHandle';
import castMemberHttp from '../../../util/http/cast-member-http';

interface CastMemberFieldProps {
    castMembers: any[];
    setCastMembers: (castMembers) => void;
    error: any;
    disabled?: boolean;
    FormControlProps?: FormControlProps;
}

export interface CastMemberFieldComponent {
    clear: () => void;
}

const CastMemberField = React.forwardRef<CastMemberFieldComponent, CastMemberFieldProps>((props, ref) => {
    const { castMembers, setCastMembers, error, disabled } = props;
    const autocompleteHttp = useHttpHandle();
    const {addItem, removeItem} = useCollectionManager(castMembers, setCastMembers);
    const autocompleteRef = useRef() as MutableRefObject<AsyncAutocompleteComponent>;
    
    const fetchOptions = useCallback((searchText) => {
        return autocompleteHttp(
            castMemberHttp.list({
                queryParams: {
                    search: searchText,
                    all: ""
                }
            })
        ).then(data => data.data)
    }, [autocompleteHttp]);

    useImperativeHandle(ref, () => ({
        clear: () => autocompleteRef.current.clear()
    }));
    
    return (
        <>
            <AsyncAutocomplete
                ref={autocompleteRef}
                fetchOptions={fetchOptions}
                AutocompleteProps={{
                    clearOnEscape: true,
                    freeSolo: true,
                    getOptionLabel: option => option.name,
                    getOptionSelected: (option, value) => option.id === value.id,
                    onChange: (event, value) => addItem(value),
                    disabled
                }}
                TextFieldProps={{
                    label: "Elenco",
                    error: error !== undefined
                }}
            />
            <FormControl
                margin={'normal'}
                fullWidth
                error={error !== undefined}
                {...props.FormControlProps}
            >
                <GridSelected>
                    {
                        castMembers.map((castMember, key) => (
                            <GridSelectedItem key={key} onDelete={() => removeItem(castMember)} xs={6}>
                                <Typography noWrap={true}>
                                    {castMember.name}
                                </Typography>
                            </GridSelectedItem>
                        ))
                    }
                </GridSelected>
                {
                    error && <FormHelperText>{error.message}</FormHelperText>
                }
            </FormControl>
        </>
    );
});

export default CastMemberField;