import { makeStyles, Theme, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import * as React from 'react';
import AsyncAutocomplete from '../../../components/AsyncAutocomplete';
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
}

const CategoryField: React.FC<CategoryFieldProps> = (props) => {
    const { categories, setCategories, genres } = props;
    const classes = useStyles();
    const autocompleteHttp = useHttpHandle();
    const {addItem, removeItem} = useCollectionManager(categories, setCategories);
    
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
    
    return (
        <>
            <AsyncAutocomplete
                fetchOptions={fetchOptions}
                AutocompleteProps={{
                    freeSolo: false,
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value),
                    disabled: !genres.length
                }}
                TextFieldProps={{
                    label: "Categorias"
                }}
            />
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
        </>
    );
};

export default CategoryField;