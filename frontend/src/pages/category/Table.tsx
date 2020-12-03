import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import categoryHttp from '../../util/http/category-http';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import { Category, ListResponse } from '../../util/models';
import DefaultTable, { makeActionStyles, TableColumn, MuiDataTableRefComponent } from '../../components/Table';
import { useSnackbar } from 'notistack';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import useFilter from '../../hooks/useFilter';
import * as yup from '../../util/vendor/yup';
import { State } from '../../store/filter/types';

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
        width: "43%",
        options: {
            filter: false
        }
    },
    {
        name: "is_active",
        label: "Ativo?",
        width: "4%",
        options: {
            filterOptions: {
                names: ['Sim', 'Não']
            },
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes/> : <BadgeNo/>;
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
            filter: false,
            sort: false,
            customBodyRender: (value, tableMeta) => {
                //console.log(tableMeta);
                return (
                    <IconButton
                        color={'secondary'}
                        component={Link}
                        to={`/categories/${tableMeta.rowData[0]}/edit`}
                    >
                        <EditIcon />
                    </IconButton>
                )
            }
        }
    }
];

const rowPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];
const Table = () => {

    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
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
                        is_active: yup.string()
                            .nullable()
                            .default(null)
                    })
                },
                formatSearchParams: (debouncedState: State) => {
                    return debouncedState.extraFilter ? {
                        ...(
                            debouncedState.extraFilter.is_active &&
                            {is_active: debouncedState.extraFilter.is_active}
                        )
                    } : undefined
                },
                getStateFromURL: (queryParams) => {
                    return {
                        is_active: queryParams.get('is_active')
                    }
                }
            }
        });

    const indexColumnType = columns.findIndex(c => c.name === 'is_active');
    const columnType = columns[indexColumnType];
    const is_activeFilterValue = filterState.extraFilter && filterState.extraFilter.is_active as never;
    (columnType.options as any).filterList = is_activeFilterValue ? [is_activeFilterValue] : [];

    useEffect(() => {
        async function getData() {
            setLoading(true);
            try {
                const {data} = await categoryHttp.list<ListResponse<Category>>({
                    queryParams: {
                        search: filterManager.clearSearchText(filterState.search),
                        page: filterState.pagination.page,
                        per_page: filterState.pagination.per_page,
                        sort: filterState.order.sort,
                        dir: filterState.order.dir,
                        ...(
                            debouncedFilterState.extraFilter &&
                            debouncedFilterState.extraFilter.is_active &&
                            {is_active: debouncedFilterState.extraFilter.is_active === 'Sim' ? 1 : 0}
                        )
                    }
                });
                if (subscribed.current) {
                    setData(data.data);
                    setTotalRecords(data.meta.total);    
                }
            }
            catch (error) {
                console.log(error);
                if (categoryHttp.isCancelledRequest(error)) {
                    return;
                }
                snackbar.enqueueSnackbar(
                    'Não foi possível buscar as categorias',
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
        // eslint-disable-next-line
        JSON.stringify(debouncedFilterState.extraFilter)
    ]);

    return (
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
                            [column]: filterList[columnIndex].length ? filterList[columnIndex][0] : null
                        })
                    },
                    onRowsDelete: (rowsDeleted) => {
                        const idsToDelete = rowsDeleted.data.map(d => data[d.dataIndex].id);
                        categoryHttp.delete(idsToDelete);
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