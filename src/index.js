import React from 'react'
import ReactDOM from 'react-dom'

import { SnackbarProvider } from 'notistack'

import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'

import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';

import './index.scss'
import App from './components/App'

const snackbarProviderProps = {
    maxSnack: 3,
    anchorOrigin: {
        vertical: 'top',
        horizontal: 'center'
    },
    iconVariant: {
        error: (<ErrorIcon className='Snackbar__icon' />),
        success: (<CheckCircleIcon className='Snackbar__icon' />),
    }
}

let theme = createMuiTheme({
    gutter: '32px',
    padding: {
        titleTop: '30px',
        titleBottom: '50px',
        containerBottom: '30px',
    }
})

theme = responsiveFontSizes(theme)

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <SnackbarProvider {...snackbarProviderProps}>
            <App />
        </SnackbarProvider>
    </ThemeProvider>, 
document.getElementById('root'))