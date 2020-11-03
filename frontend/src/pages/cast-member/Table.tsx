import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import DefaultTable, { makeActionStyles, MuiDataTableRefComponent, TableColumn } from '../../components/Table';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import castMemberHttp from '../../util/http/cast-member-http';
import { CastMember, CastMemberTypeMap, ListResponse } from '../../util/models';
import { useSnackbar } from 'notistack';
import useFilter from '../../hooks/useFilter';
import * as yup from '../../util/vendor/yup';
import { State } from '../../store/filter/types';
import { invert } from 'lodash';
import { FilterResetButton } from '../../components/Table/FilterResetButton';

const castMemberNames = Object.values(CastMemberTypeMap);

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
        name: "type",
        label: "Tipo",
        width: "4%",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return CastMemberTypeMap[value];
            },
            filterOptions: {
                names: castMemberNames
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
                console.log(tableMeta);
                return (
                    <IconButton
                        color={'secondary'}
                        component={Link}
                        to={`/cast_members/${tableMeta.rowData[0]}/edit`}
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
    const [data, setData] = useState<CastMember[]>([]);
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
                        type: yup.string()
                            .nullable()
                            .transform(value => {
                                return !value || !castMemberNames.includes(value) ? undefined : value;
                            })
                            .default(null)
                    })
                },
                formatSearchParams: (debouncedState: State) => {
                    return debouncedState.extraFilter ? {
                        ...(
                            debouncedState.extraFilter.type &&
                            {type: debouncedState.extraFilter.type}
                        )
                    } : undefined
                },
                getStateFromURL: (queryParams) => {
                    return {
                        type: queryParams.get('type')
                    }
                }
            }
        });
        
    const indexColumnType = columns.findIndex(c => c.name === 'type');
    const columnType = columns[indexColumnType];
    const typeFilterValue = filterState.extraFilter && filterState.extraFilter.type as never;
    (columnType.options as any).filterList = typeFilterValue ? [typeFilterValue] : [];

    // const serverSideFilterList = columns.map(column => []);
    // if (typeFilterValue) {
    //     serverSideFilterList[indexColumnType] = [typeFilterValue];
    // }

    useEffect(() => {
        async function getData() {
            setLoading(true);
            try {
                const {data} = await castMemberHttp.list<ListResponse<CastMember>>({
                    queryParams: {
                        search: filterManager.clearSearchText(filterState.search),
                        page: filterState.pagination.page,
                        per_page: filterState.pagination.per_page,
                        sort: filterState.order.sort,
                        dir: filterState.order.dir,
                        ...(
                            debouncedFilterState.extraFilter &&
                            debouncedFilterState.extraFilter.type &&
                            {type: invert(CastMemberTypeMap)[debouncedFilterState.extraFilter.type]}
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
                if (castMemberHttp.isCancelledRequest(error)) {
                    return;
                }
                snackbar.enqueueSnackbar(
                    'Não foi possível buscar os membros de elenco',
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


    // useEffect(() => {
    //     httpVideo.get('cast_members').then(
    //         response => setData(response.data.data)
    //     )
    // }, []);

    return (
        <MuiThemeProvider theme={makeActionStyles(columnsDefinitions.length - 1)}>
            <DefaultTable
                title=""
                columns={columns}
                data={data}
                loading={loading}
                ref={tableRef}
                options={{
                    //serverSideFilterList,
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
                        castMemberHttp.delete(idsToDelete);
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