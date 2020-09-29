import * as React from 'react';
import {useEffect, useState} from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import {httpVideo} from "../../util/http";
import { Chip } from '@material-ui/core';

const columnsDefinitions: MUIDataTableColumn[] = [
    {
        name: "name",
        label: "Nome"
    },
    {
        name: "is_active",
        label: "Ativo?",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <Chip label="Sim" color="primary"/> : <Chip label="Não" color="secondary"/>;
            }
        }
    },
    {
        name: "created_at",
        label: "Criado em"
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
    const [data, setData] = useState([]);
    useEffect(() => {
        httpVideo.get('categories').then(
            response => setData(response.data.data)
        )
    }, []);

    return (
        <div>
            <MUIDataTable
                title="Listagem de categorias"
                columns={columnsDefinitions}
                data={data}
            />
        </div>
    );
};

export default Table;