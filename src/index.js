import React from 'react'
import ReactDOM from 'react-dom'

import { SnackbarProvider } from 'notistack'

import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'


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


ReactDOM.render(
    <SnackbarProvider {...snackbarProviderProps}>
        <App />
    </SnackbarProvider>, 
document.getElementById('root'))