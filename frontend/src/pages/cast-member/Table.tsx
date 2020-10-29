import * as React from 'react';
import {useEffect, useState} from 'react';
import MUIDataTable from 'mui-datatables';
import {httpVideo} from "../../util/http";
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { makeActionStyles, TableColumn } from '../../components/Table';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';
import castMemberHttp from '../../util/http/cast-member-http';
import { CastMember } from '../../util/models';

const CastMemberTypeMap = {
    1: 'Diretor',
    2: 'Ator'
};

const columnsDefinitions: TableColumn[] = [
    {
        name: "id",
        label: "ID",
        width: "30%",
        options: {
            sort: false
        }
    },
    {
        name: "name",
        label: "Nome",
        width: "43%"
    },
    {
        name: "type",
        label: "Tipo",
        width: "4%",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return CastMemberTypeMap[value];
            }
        }
    },
    {
        name: "created_at",
        label: "Criado em",
        width: "10%",
        options: {
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
type Props = {};
const Table = (props: Props) => {
    const [data, setData] = useState<CastMember[]>([]);
    useEffect(() => {
        httpVideo.get('cast_members').then(
            response => setData(response.data.data)
        )
    }, []);

    return (
            <MuiThemeProvider theme={makeActionStyles(columnsDefinitions.length - 1)}>
                <MUIDataTable
                    title="Listagem de membros de elenco"
                    columns={columnsDefinitions}
                    data={data}
                    options={{
                        onRowsDelete: (rowsDeleted) => {
                            const idsToDelete = rowsDeleted.data.map(d => data[d.dataIndex].id);
                            castMemberHttp.delete(idsToDelete);
                        }
                    }}
                />
            </MuiThemeProvider>
    );
};

export default Table;