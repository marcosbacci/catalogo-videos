import { Button, FormControl, FormControlProps, FormHelperText } from '@material-ui/core';
import * as React from 'react';
import InputFile, { InputFileComponent } from '../../../components/InputFile';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { MutableRefObject, useRef } from 'react';

interface UploadFieldProps {
    accept: string;
    label: string;
    setValue: (value) => void;
    error?: any;
    disabled?: boolean;
    FormControlProps?: FormControlProps
}

export const UploadField: React.FC<UploadFieldProps> = (props) => {
    const fileRef = useRef() as MutableRefObject<InputFileComponent>;
    const { accept, label, setValue, disabled, error } = props;
    return (
        <FormControl
            disabled={disabled === true}
            error={error !== undefined}
            fullWidth
            margin={'normal'}
            {...props.FormControlProps}
        >
            <InputFile
                ref={fileRef}
                TextFieldProps={{
                    label,
                    InputLabelProps: {shrink: true},
                    style: {backgroundColor: "#ffffff"}
                }}
                InputFileProps={{
                    accept,
                    onChange(event) {
                        event.target.files?.length &&
                            setValue(event.target.files[0])
                    }
                }}
                ButtonFile={
                    <Button
                        endIcon={<CloudUploadIcon/>}
                        variant={'contained'}
                        color={'primary'}
                        onClick={() => fileRef.current.openWindow()}
                    >
                        Adicionar
                    </Button>
                }
            />
            {
                error && <FormHelperText>{error.message}</FormHelperText>
            }
        </FormControl>
    );
};