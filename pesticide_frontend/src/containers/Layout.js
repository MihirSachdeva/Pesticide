import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from "../components/Header";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
}));

export default function Layout(props) {
    const classes = useStyles();

    return (
    <>
        <div className={classes.root}>
        <CssBaseline />

            <Header />

            <main className={classes.content}>

                <div className={classes.appBarSpacer} />
                    {props.children}

            </main>

        </div>

    </>
  );
}

// const mapStateToProps = state => {
//     return {
//         isAuthenticated: state.token !== null,
//     }
// } 
  
// export default connect(mapStateToProps, null)(Layout);
  