import * as React from 'react';
import { Card, CardActions, Collapse, IconButton, List, makeStyles, Theme, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        width: 450
    },
    cardActionRoot: {
        padding: '8px 8px 8px 16px',
        backgroundColor: theme.palette.primary.main
    },
    title: {
        fontWeight: 'bold',
        color: theme.palette.primary.contrastText
    },
    icons: {
        marginLeft: 'auto !important',
        color: theme.palette.primary.contrastText
    }
}));

interface SnackbarUploadProps {
    id: string | number;
}

const SnackbarUpload = React.forwardRef<any, SnackbarUploadProps>((props, ref) => {

    const {id} = props;
    const {closeSnackbar} = useSnackbar();
    const classes = useStyles();
    const [expanded, setExpanded] = useState(true);

    return (
        <Card ref={ref} className={classes.card}>
            <CardActions classes={{ root: classes.cardActionRoot }}>
                <Typography variant="subtitle2" className={classes.title}>
                    Fazendo upload de 10 vídeo(s)
                </Typography>
                <div className={classes.icons}>
                    <IconButton color={'inherit'} onClick={() => setExpanded(!expanded)} >
                        <ExpandMoreIcon />
                    </IconButton>
                    <IconButton color={'inherit'} onClick={() => closeSnackbar(id)}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </CardActions>
            <Collapse in={expanded}>
                <List>
                    Items
                </List>
            </Collapse>
        </Card>
    );
});

export default SnackbarUpload;