import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
//import MUIDataTable from 'mui-datatables';
//import {httpVideo} from "../../util/http";
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import DefaultTable, { makeActionStyles, MuiDataTableRefComponent, TableColumn } from '../../components/Table';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import genreHttp from '../../util/http/genre-http';
import { Category, Genre, ListResponse } from '../../util/models';
import { useSnackbar } from 'notistack';
import useFilter from '../../hooks/useFilter';
import * as yup from '../../util/vendor/yup';
import categoryHttp from '../../util/http/category-http';
import { FilterResetButton } from '../../components/Table/FilterResetButton';

const columnsDefinitions: TableColumn[] = [
    {
        name: "id",
        label: "ID",
        width: "30%",
        options: {
            sort: false,
            filter: false
        }
    },
    {
        name: "name",
        label: "Nome",
        width: "23%",
        options: {
            filter: false
        }
    },
    {
        name: "is_active",
        label: "Ativo?",
        width: "4%",
        options: {
            // filterOptions: {
            //     names: ['Sim', 'Não']
            // },
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes/> : <BadgeNo/>;
            }
        }
    },
    {
        name: "categories",
        label: "Categorias",
        width: "20%",
        options: {
            filterType: "multiselect",
            filterOptions: {
                names: []
            },
            customBodyRender(value, tableMeta, updateValue) {
                return value.map(value => value.name).join(', ');
            }
        }
    },
    {
        name: "created_at",
        label: "Criado em",
        width: "10%",
        options: {
            filter: false,
            customBodyRender(value, tableMeta, updateValue) {
            return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
            }
        }
    },
    {
        name: "action",
        label: "Ações",
        width: "13%",
        options: {
            sort: false,
            filter: false,
            customBodyRender: (value, tableMeta) => {
                return (
                    <IconButton
                        color={'secondary'}
                        component={Link}
                        to={`/genres/${tableMeta.rowData[0]}/edit`}
                    >
                        <EditIcon />
                    </IconButton>
                )
            }
        }
    }
];
// const data = [
//     { name: "teste1", is_active: true, created_at: "2019-12-12"},
//     { name: "teste2", is_active: false, created_at: "2019-12-13"},
//     { name: "teste3", is_active: true, created_at: "2019-12-14"},
//     { name: "teste4", is_active: false, created_at: "2019-12-15"}
// ];
const rowPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];
const Table = () => {

    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const [data, setData] = useState<Genre[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    // eslint-disable-next-line
    const [categories, setCategories] = useState<Category[]>();
    const tableRef = useRef() as React.MutableRefObject<MuiDataTableRefComponent>;

    const {
            columns,
            filterManager,
            filterState,
            debouncedFilterState,
            //dispatch,
            totalRecords,
            setTotalRecords
        } = useFilter({
            columns: columnsDefinitions,
            debounceTime: 300,
            rowPerPage,
            rowsPerPageOptions,
            tableRef,
            extraFilter: {
                createValidationSchema: () => {
                    return yup.object().shape({
                        categories: yup.mixed()
                            .nullable()
                            .transform(value => {
                                return !value || value === '' ? undefined : value.split(',');
                            })
                            .default(null)
                    })
                },
                formatSearchParams: (debouncedState) => {
                    return debouncedState.extraFilter ? {
                        ...(
                            debouncedState.extraFilter.categories &&
                            {categories: debouncedState.extraFilter.categories.join(',')}
                        )
                    } : undefined
                },
                getStateFromURL: (queryParams) => {
                    return {
                        categories: queryParams.get('categories')
                    }
                }
            }
        });

    const indexColumnCategories = columns.findIndex(c => c.name === 'categories');
    const columnCategories = columns[indexColumnCategories];
    const categoriesFilterValue = filterState.extraFilter && filterState.extraFilter.categories;
    (columnCategories.options as any).filterList = categoriesFilterValue ? categoriesFilterValue : [];

    // const serverSideFilterList = columns.map(column => []);
    // if (categoriesFilterValue) {
    //     serverSideFilterList[indexColumnCategories] = categoriesFilterValue;
    // }

    useEffect(() => {
        let isSubscribed = true;
        (async () => {
            try {
                const {data} = await categoryHttp.list({queryParams: {all: ''}});
                if (isSubscribed) {
                    setCategories(data.data);
                    (columnCategories.options as any).filterOptions.names = data.data.map(category => category.name);
                }
            }
            catch (error) {
                console.log(error);
                snackbar.enqueueSnackbar(
                    'Não foi possível carregar as informações',
                    {variant: 'error'}
                );
            }
        })();

        return () => {
            isSubscribed = false;
        }
    },
    // eslint-disable-next-line 
    []);

    useEffect(() => {
        async function getData() {
            setLoading(true);
            try {
                const {data} = await genreHttp.list<ListResponse<Genre>>({
                    queryParams: {
                        search: filterManager.clearSearchText(filterState.search),
                        page: filterState.pagination.page,
                        per_page: filterState.pagination.per_page,
                        sort: filterState.order.sort,
                        dir: filterState.order.dir,
                        categories: filterState.extraFilter?.categories?.join(',')
                    }
                });
                if (subscribed.current) {
                    setData(data.data);
                    setTotalRecords(data.meta.total);
                }
            }
            catch (error) {
                console.log(error);
                if (genreHttp.isCancelledRequest(error)) {
                    return;
                }
                snackbar.enqueueSnackbar(
                    'Não foi possível buscar os gêneros',
                    {variant: 'error'}
                );
            } finally {
                setLoading(false);
            }
        }

        subscribed.current = true;
        filterManager.pushHistory();
        getData();
        return () => {
            subscribed.current = false;
        }
    },
    // eslint-disable-next-line
    [
        // eslint-disable-next-line
        filterManager.clearSearchText(debouncedFilterState.search),
        debouncedFilterState.pagination.page,
        debouncedFilterState.pagination.per_page,
        debouncedFilterState.order,
        debouncedFilterState.extraFilter
    ]);
    
    // useEffect(() => {
    //     httpVideo.get('genres').then(
    //         response => setData(response.data.data)
    //     )
    // }, []);

    return (
        // <MuiThemeProvider theme={makeActionStyles(columnsDefinitions.length - 1)}>
        //     <MUIDataTable
        //         title="Listagem de categorias"
        //         columns={columnsDefinitions}
        //         data={data}
        //         options={{
        //             onRowsDelete: (rowsDeleted) => {
        //                 const idsToDelete = rowsDeleted.data.map(d => data[d.dataIndex].id);
        //                 genreHttp.delete(idsToDelete);
        //             }
        //         }}
        //     />
        // </MuiThemeProvider>

        <MuiThemeProvider theme={makeActionStyles(columnsDefinitions.length - 1)}>
            <DefaultTable
                title=""
                columns={columns}
                data={data}
                loading={loading}
                ref={tableRef}
                options={{
                    serverSide: true,
                    responsive: 'standard',
                    searchText: filterState.search as any,
                    page: filterState.pagination.page - 1,
                    rowsPerPage: filterState.pagination.per_page,
                    rowsPerPageOptions,
                    count: totalRecords,
                    onFilterChange: (column: string, filterList: any, type) => {
                        const columnIndex = columns.findIndex(c => c.name === column);
                        filterManager.changeExtraFilter({
                            [column]: filterList[columnIndex].length ? filterList[columnIndex] : null
                        })
                    },
                    onRowsDelete: (rowsDeleted) => {
                        const idsToDelete = rowsDeleted.data.map(d => data[d.dataIndex].id);
                        genreHttp.delete(idsToDelete);
                    },
                    customToolbar: () => (
                        <FilterResetButton handleClick={() => filterManager.resetFilter()}/>
                    ),
                    onSearchChange: (value) => filterManager.changeSearch(value),
                    onChangePage: (page)  => filterManager.changePage(page),
                    onChangeRowsPerPage: (per_page)  => filterManager.changeRowsPerPage(per_page),
                    onColumnSortChange: (changedColumn: string, direction: string) => 
                        filterManager.changeColumnSort(changedColumn, direction)
                }}
            />
        </MuiThemeProvider>
    );
};

export default Table;