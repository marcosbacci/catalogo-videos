import * as React from 'react';
import {Page} from "../../components/Page";
import { useParams } from 'react-router';
import { Form } from './Form';

const PageForm = () => {
    const {id} = useParams();
    return (
        <Page title={!id ? "Criar vídeo" : "Editar vídeo"}>
            <Form/>
        </Page>
    )
}

export default PageForm;