import { Actions as FilterActions, State as FilterState } from "../store/filter/types";
import { Dispatch, Reducer, useReducer, useState, useEffect, useMemo } from "react";
import reducer, {Creators} from "../store/filter";
import { MUIDataTableColumn } from "mui-datatables";
import * as yup from '../util/vendor/yup';
import { useDebounce } from "use-debounce";
import { useHistory, useLocation } from "react-router";
import {History} from "history";
import {isEqual} from "lodash";
import { MuiDataTableRefComponent } from "../components/Table";
import { ObjectSchema } from "../util/vendor/yup";

interface FilterManagerOptions {
    schema: ObjectSchema;
    columns: MUIDataTableColumn[];
    rowPerPage: number;
    rowsPerPageOptions: number[];
    debounceTime: number;
    history: History;
    tableRef: React.MutableRefObject<MuiDataTableRefComponent>;
    extraFilter?: ExtraFilter;
}

interface ExtraFilter {
    getStateFromURL: (queryParams: URLSearchParams) => any,
    formatSearchParams: (debouncedState: FilterState) => any,
    createValidationSchema: () => any
}

interface UseFilterOptions {
    columns: MUIDataTableColumn[];
    rowPerPage: number;
    rowsPerPageOptions: number[];
    debounceTime: number;
    tableRef: React.MutableRefObject<MuiDataTableRefComponent>;
    extraFilter?: ExtraFilter;
}

export default function useFilter(options: UseFilterOptions) {
    const history = useHistory();
    const location = useLocation();
    const {rowsPerPageOptions, rowPerPage, extraFilter, columns} = options;
    const schema = useMemo(() => {
        return yup.object().shape({
            search: yup.string()
                .transform(value => !value ? undefined : value)
                .default(''),
            pagination: yup.object().shape({
                page: yup.number()
                    .transform(value => isNaN(value) || parseInt(value) < 1 ? undefined : value)
                    .default(1),
                per_page: yup.number()
                    //.oneOf(rowsPerPageOptions)
                    .transform(value => 
                        isNaN(value) || !rowsPerPageOptions.includes(parseInt(value)) ? undefined : value)
                    .default(rowPerPage),
            }),
            order: yup.object().shape({
                sort: yup.string()
                    .nullable()
                    .transform(value => {
                        const columnsName = columns
                            .filter(column => !column.options || column.options.sort !== false)
                            .map(column => column.name);
                        return columnsName.includes(value) ? value : undefined;
                    })
                    .default(null),
                dir: yup.string()
                    .nullable()
                    .transform(value => !value || !['asc', 'desc'].includes(value.toLowerCase()) ? undefined : value)
                    .default(null)
            }),
            ...(
                extraFilter && {
                    extraFilter: extraFilter.createValidationSchema()
                }
            )
        });
    }, [rowsPerPageOptions, rowPerPage, columns, extraFilter]);

    const stateFromURL = useMemo(() => {
        const queryParams = new URLSearchParams(location.search.substr(1));
        return schema.cast({
            search: queryParams.get('search'),
            pagination: {
                page: queryParams.get('page'),
                per_page: queryParams.get('per_page')
            },
            order: {
                sort: queryParams.get('sort'),
                dir: queryParams.get('dir')
            },
            ...(
                extraFilter && {
                    extraFilter: extraFilter.getStateFromURL(queryParams)
                }
            )
        });
    }, [location, schema, extraFilter]);


    const filterManager = new FilterManager({...options, history, schema});
    const INITIAL_STATE = stateFromURL as any;
    const [filterState, dispatch] = useReducer<Reducer<FilterState, FilterActions>>(reducer, INITIAL_STATE);
    const [debouncedFilterState] = useDebounce(filterState, options.debounceTime);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    filterManager.state = filterState;
    // filterManager.debouncedState = debouncedFilterState;
    filterManager.dispatch = dispatch;

    filterManager.applyOrderInColumns();

    useEffect(() => {
        filterManager.replaceHistory()
    }, 
    // eslint-disable-next-line
    []);

    return {
        columns: filterManager.columns,
        filterManager,
        filterState,
        debouncedFilterState,
        dispatch,
        totalRecords,
        setTotalRecords
    }
}

export class FilterManager{

    schema;
    state: FilterState = null as any;
    dispatch: Dispatch<FilterActions> = null as any;
    columns: MUIDataTableColumn[];
    rowPerPage: number;
    rowsPerPageOptions: number[];
    history: History;
    tableRef: React.MutableRefObject<MuiDataTableRefComponent>;
    extraFilter?: ExtraFilter;

    constructor(options: FilterManagerOptions) {
        const { schema } = options;
        this.schema = schema;
        this.columns = options.columns;
        this.rowPerPage = options.rowPerPage;
        this.rowsPerPageOptions = options.rowsPerPageOptions;
        this.history = options.history;
        this.tableRef = options.tableRef;
        this.extraFilter = options.extraFilter;
    }

    private resetTablePagination() {
        this.tableRef.current.changeRowsPerPage(this.rowPerPage);
        this.tableRef.current.changePage(0);
    }

    changeSearch(value) {
        this.dispatch(Creators.setSearch({search: value}));
    }

    changePage(page) {
        this.dispatch(Creators.setPage({page: page + 1}));
    }

    changeRowsPerPage(per_page) {
        this.dispatch(Creators.setPerPage({per_page: per_page}));
    }

    changeColumnSort(changedColumn: string, direction: string) {
        this.dispatch(Creators.setOrder({
            sort: changedColumn,
            dir: direction.includes('desc') ? 'desc' : 'asc'})
        );
        this.resetTablePagination();
    }

    changeExtraFilter(data) {
        this.dispatch(Creators.updateExtraFilter(data));
    }

    resetFilter() {
        const INITIAL_STATE = {
            ...this.schema.cast({}),
            search: {value: null, update: true}
        };
        this.dispatch(Creators.setReset({
            state: INITIAL_STATE
        }));
        this.resetTablePagination();
    }

    applyOrderInColumns() {
        this.columns = this.columns.map(column => {
            return column.name === this.state.order.sort
            ? {
                ...column,
                options: {
                    ...column.options,
                    sortDirection: this.state.order.dir as any
                }
              }: column;
        });
    }

    clearSearchText(text) {
        let newText = text;
        if (text && text.value !== undefined) {
            newText = text.value;
        }
        return newText;
    }

    replaceHistory() {
        this.history.replace({
            pathname: this.history.location.pathname,
            search: "?" + new URLSearchParams(this.formatSearchParams() as any),
            state: this.state
            //state: this.debouncedState
        })
    }

    pushHistory() {
        const newLocation = {
            pathname: this.history.location.pathname,
            search: "?" + new URLSearchParams(this.formatSearchParams() as any),
            state: {
                ...this.state,
                //...this.debouncedState,
                search: this.clearSearchText(this.state.search)
            }
        };

        if (!isEqual(this.history.location.state, this.state))
            this.history.push(newLocation);
    }

    private formatSearchParams() {
        const search = this.clearSearchText(this.state.search);
        return {
            ...(search && search !== '' && {search: search}),
            ...(this.state.pagination.page !== 1 && {page: this.state.pagination.page}),
            ...(this.state.pagination.per_page !== 15 && {per_page: this.state.pagination.per_page}),
            ...(
                this.state.order.sort && {
                    sort: this.state.order.sort,
                    dir: this.state.order.dir
                }
            ),
            ...(
                this.extraFilter && this.extraFilter.formatSearchParams(this.state)
            )
        }
    }
}