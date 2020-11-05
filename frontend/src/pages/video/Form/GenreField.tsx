import { FormControl, FormControlProps, Typography } from '@material-ui/core';
import * as React from 'react';
import AsyncAutocomplete from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandle from '../../../hooks/useHttpHandle';
import genreHttp from '../../../util/http/genre-http';
import { getGenresFromCategory } from '../../../util/model-filters';

interface GenreFieldProps {
    genres: any[];
    setGenres: (genres) => void;
    categories: any[];
    setCategories: (categories) => void;
    error: any;
    disabled?: boolean;
    FormControlProps?: FormControlProps;
}

const GenreField: React.FC<GenreFieldProps> = (props) => {
    const {
        genres,
        setGenres,
        categories,
        setCategories,
        error,
        disabled
    } = props;
    const {addItem, removeItem} = useCollectionManager(genres, setGenres);
    const {removeItem: removeCategory} = useCollectionManager(categories, setCategories);
    const autocompleteHttp = useHttpHandle();

    function fetchOptions(searchText) {
        return autocompleteHttp(
            genreHttp.list({
                queryParams: {
                    search: searchText, all: ""
                }
            })
        ).then(data => data.data)
    }

    return (
        <>
            <AsyncAutocomplete
                fetchOptions={fetchOptions}
                AutocompleteProps={{
                    freeSolo: true,
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value)
                }}
                TextFieldProps={{
                    label: "Gêneros"
                }}
            />
            <FormControl
                margin={'normal'}
                fullWidth
                error={error !== undefined}
                disabled={disabled === true}
                {...props.FormControlProps}
            >
                <GridSelected>
                    {
                        genres.map((genre, key) => (
                            <GridSelectedItem
                                key={key}
                                onDelete={() => {
                                    const categoriesWithOneGenre = categories.filter(category => {
                                        const genresFromCategory = getGenresFromCategory(genres, category);
                                        return genresFromCategory.length === 1 && genres[0].id === genre.id;
                                    });
                                    categoriesWithOneGenre.forEach(cat => removeCategory(cat));
                                    removeItem(genre);
                                }}
                                xs={12}>
                                <Typography noWrap={true}>{genre.name}</Typography>
                            </GridSelectedItem>
                        ))
                    }
                </GridSelected>
            </FormControl>
        </>
    );
};

export default GenreField;