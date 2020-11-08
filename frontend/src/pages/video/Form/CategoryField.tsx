import { FormControl, FormControlProps, FormHelperText, makeStyles, Theme, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import * as React from 'react';
import { MutableRefObject, useRef, useImperativeHandle } from 'react';
import AsyncAutocomplete, { AsyncAutocompleteComponent } from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandle from '../../../hooks/useHttpHandle';
import categoryHttp from '../../../util/http/category-http';
import { getGenresFromCategory } from '../../../util/model-filters';
import { Genre } from '../../../util/models';

const useStyles = makeStyles((theme: Theme) => ({
    genresSubtitle: {
        color: grey['800'],
        fontSize: '0.8rem'
    }
}));

interface CategoryFieldProps {
    categories: any[];
    setCategories: (categories) => void;
    genres: Genre[];
    error: any;
    disabled?: boolean;
    FormControlProps?: FormControlProps;
}

export interface CategoryFieldComponent {
    clear: () => void;
}

const CategoryField = React.forwardRef<CategoryFieldComponent, CategoryFieldProps>((props, ref) => {
    const { categories, setCategories, genres, error, disabled } = props;
    const classes = useStyles();
    const autocompleteHttp = useHttpHandle();
    const {addItem, removeItem} = useCollectionManager(categories, setCategories);
    const autocompleteRef = useRef() as MutableRefObject<AsyncAutocompleteComponent>;
    
    function fetchOptions(searchText) {
        return autocompleteHttp(
            categoryHttp.list({
                queryParams: {
                    genres: genres.map(genre => genre.id).join(','),
                    all: ""
                }
            })
        ).then(data => data.data)
    }

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
                    freeSolo: false,
                    getOptionLabel: option => option.name,
                    getOptionSelected: (option, value) => option.id === value.id,
                    onChange: (event, value) => addItem(value),
                    disabled: disabled === true || !genres.length
                }}
                TextFieldProps={{
                    label: "Categorias",
                    error: error !== undefined
                }}
            />
            <FormControl
                margin={"normal"}
                fullWidth
                error={error !== undefined}
                disabled={disabled === true}
                {...props.FormControlProps}
            >
                <GridSelected>
                    {
                        categories.map((category, key) => {
                            const genresFromCategory = getGenresFromCategory(genres, category)
                                .map(genre => genre.name)
                                .join(',');
                            return (
                            <GridSelectedItem key={key} onDelete={() => removeItem(category)} xs={12}>
                                <Typography noWrap={true}>
                                    {category.name}
                                </Typography>
                                <Typography noWrap={true} className={classes.genresSubtitle}>
                                    Gêneros: {genresFromCategory}
                                </Typography>
                            </GridSelectedItem>)
                        })
                    }
                </GridSelected>
                {
                    error && <FormHelperText>{error.message}</FormHelperText>
                }
            </FormControl>
        </>
    );
});

export default CategoryField;