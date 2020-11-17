import { Divider, Fade, IconButton, makeStyles, Theme } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {Link} from 'react-router-dom';
import * as React from 'react';

const useStyles = makeStyles((theme: Theme) => ({
    successIcon: {
        color: theme.palette.success.main,
        marginLeft: theme.spacing(1)
    },
    erroIcon: {
        color: theme.palette.error.main,
        marginLeft: theme.spacing(1)
    },
    divider: {
        height: '20px',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    }
}));

interface UploadActionProps {
    
}

const UploadAction : React.FC<UploadActionProps> = (props) => {

    const classes = useStyles();

    return (
        <Fade in={true} timeout={{enter: 1000}}>
            <>
                <CheckCircleIcon className={classes.successIcon} />
                <ErrorIcon className={classes.erroIcon} />
                <>
                    <Divider className={classes.divider} orientation="vertical" />
                    <IconButton>
                        <DeleteIcon color={"primary"} />
                    </IconButton>
                    <IconButton
                        component={Link}
                        to="/videos/uuid/edit"
                    >
                        <EditIcon color={"primary"} />
                    </IconButton>
                </>
            </>
        </Fade>
    );
};

export default UploadAction;