import { Fade, IconButton, ListItemSecondaryAction, makeStyles, Theme } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import DeleteIcon from '@material-ui/icons/Delete';
import * as React from 'react';

const useStyles = makeStyles((theme: Theme) => ({
    successIcon: {
        color: theme.palette.success.main
    },
    erroIcon: {
        color: theme.palette.error.main
    },
    deleteIcon: {
        color: theme.palette.primary.main
    }
}));

interface UploadActionProps {
    
}

const UploadAction : React.FC<UploadActionProps> = (props) => {

    const classes = useStyles();

    return (
        <Fade in={true} timeout={{enter: 1000}}>
            <ListItemSecondaryAction>
                <span>
                    {
                        <IconButton className={classes.successIcon} edge={'end'}>
                            <CheckCircleIcon />
                        </IconButton>
                    }
                    {
                        <IconButton className={classes.erroIcon} edge={'end'}>
                            <ErrorIcon />
                        </IconButton>
                    }
                </span>
                <span>
                    <IconButton className={classes.deleteIcon} edge={'end'}>
                        <DeleteIcon />
                    </IconButton>
                </span>
            </ListItemSecondaryAction>            
        </Fade>
    );
};

export default UploadAction;