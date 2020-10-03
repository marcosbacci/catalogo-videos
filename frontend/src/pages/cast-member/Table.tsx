import * as React from 'react';
import {useEffect, useState} from 'react';
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import {httpVideo} from "../../util/http";
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

const CastMemberTypeMap = {
    1: 'Diretor',
    2: 'Ator'
};

const columnsDefinitions: MUIDataTableColumn[] = [
    {
        name: "name",
        label: "Nome"
    },
    {
        name: "type",
        label: "Tipo",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return CastMemberTypeMap[value];
            }
        }
    },
    {
        name: "created_at",
        label: "Criado em",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
            return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
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
    const [data, setData] = useState([]);
    useEffect(() => {
        httpVideo.get('cast_members').then(
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