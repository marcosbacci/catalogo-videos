import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableProps } from 'mui-datatables';
import * as React from 'react';
import {merge, omit, cloneDeep} from 'lodash';
import { MuiThemeProvider, Theme, useMediaQuery, useTheme } from '@material-ui/core';
import DebouncedTableSearch from './DebouncedTableSearch';

export interface TableColumn extends MUIDataTableColumn{
    width?: string
}

const defaultOptions: MUIDataTableOptions = {
    print: false,
    download: false,
    textLabels: {
        body: {
            noMatch: "Nenhum registro encontrado",
            toolTip: "Classificar"
        },
        pagination: {
            next: "Próxima página",
            previous: "Página anterior",
            rowsPerPage: "Por página:",
            displayRows: "de"
        },
        toolbar: {
            search: "Busca",
            downloadCsv: "Download CSV",
            print: "Imprimir",
            viewColumns: "Ver colunas",
            filterTable: "Filtrar tabelas"
        },
        filter: {
            all: "Todos",
            title: "FILTROS",
            reset: "LIMPAR"
        },
        viewColumns: {
            title: "Ver colunas",
            titleAria: "Ver/Esconder Colunas da Tabela"
        },
        selectedRows: {
            text: "registro(s) selecionado(s)",
            delete: "Excluir",
            deleteAria: "Excluir registros selecionados"
        }
    },
    customSearchRender: (
                            searchText: string,
                            handleSearch: any,
                            hideSearch: any,
                            options: any,
                        ) => {
                            return <DebouncedTableSearch 
                                searchText={searchText}
                                onSearch={handleSearch}
                                onHide={hideSearch}
                                options={options}
                            />
                        }
};

export interface TableProps extends MUIDataTableProps {
    columns: TableColumn[];
    loading?: boolean;
}

const Table: React.FC<TableProps> = (props) => {

    const theme = cloneDeep<Theme>(useTheme());
    const isSmOrDown = useMediaQuery(theme.breakpoints.down("sm"));
    const newProps = merge(
        {options: cloneDeep(defaultOptions)},
        props,
        {columns: extractMuiDataTableColumns(props.columns)}
    );

    function extractMuiDataTableColumns(columns:TableColumn[]): MUIDataTableColumn[] {
        setColumnsWith(columns);
        return columns.map(column => omit(column, 'width'));
    }

    function setColumnsWith(columns:TableColumn[]) {
        columns.forEach((column, key) => {
            if (column.width) {
                const overrides = theme.overrides as any;
                overrides.MUIDataTableHeadCell.fixedHeader[`&:nth-child(${key + 2})`] = {
                    width: column.width
                }
            }
        })
    }

    function applyLoading() {
        newProps.options.textLabels!!.body!!.noMatch =
            props.loading === true ? "Carregando..." : newProps.options.textLabels!!.body!!.noMatch;
    }

    function applyResponsive() {
        newProps.options.responsive = isSmOrDown ? "standard" : "simple";
    }

    function getOriginalMuiDataTableProps() {
        return omit(newProps, 'loading');
    }

    applyLoading();
    applyResponsive();
    
    const originalProps = getOriginalMuiDataTableProps();

    return (
        <MuiThemeProvider theme={theme}>
            <MUIDataTable {...originalProps}/>
        </MuiThemeProvider>
    );
};

export default Table;

export function makeActionStyles(column) {
    return theme => {
        const copyTheme = cloneDeep(theme);
        const selector = `&[data-testid^="MuiDataTableBodyCell-${column}"]`;
        (copyTheme.overrides as any).MUIDataTableBodyCell.root[selector] = {
            paddingTop: "0px;",
            paddingBottom: "0px"
        };
        return copyTheme;
    }
}
