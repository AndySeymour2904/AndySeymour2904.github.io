import React from "react"
import { makeStyles } from '@material-ui/core/styles'

import { useSnackbar } from 'notistack'

import {v4 as uuid} from 'uuid'

import { TextField, Button, CircularProgress, IconButton, Typography } from '@material-ui/core'

import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        margin: '10px 0',
    },
    spinnerContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    formspreeSuccess: {
        margin: '10px 0',
        textAlign: 'center',
    },
    formspreeError: {
        margin: '10px 0',
        textAlign: 'center',
    },
 })

export default function ContactForm() {

    const [status, setStatus] = React.useState('')

    const [values, setValues] = React.useState({email: '', message: ''})
    const [errors, setErrors] = React.useState({})
    const [touched, setTouched] = React.useState({})

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const classes = useStyles() 

    const submitForm = (ev) => {
        ev.preventDefault()

        const form = ev.target

        if (errors.email || errors.message) {
            return
        }

        let formData = new FormData()
        formData.append('email', values.email)
        formData.append('message', values.message)

        const xhr = new XMLHttpRequest()

        xhr.open(form.method, form.action)
        xhr.setRequestHeader("Accept", "application/json")

        xhr.onreadystatechange = () => {

            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return
            }

            const snackbarAction = (key) => (
                <IconButton  onClick={() => {
                  closeSnackbar(key)
                }}>
                  <CloseIcon data-testid='snackbars-close' />
                </IconButton>
              )
            

            if (xhr.status === 200) {
                form.reset()
                enqueueSnackbar("Message sent!", {
                    variant: 'success',
                    key: uuid(),
                    action: snackbarAction,
                    autoHideDuration: 3000
                })
                setStatus("SUCCESS")
            } else {
                enqueueSnackbar("Message sent!", {
                    variant: 'error',
                    key: uuid(),
                    action: snackbarAction,
                    autoHideDuration: 5000
                })
                setStatus("ERROR")
            }

        }

        xhr.send(formData)
        setStatus('PENDING')
    }

    const onChange = (event) => {
        setValues({...values, [event.target.id]: event.target.value})

        validate(event)
    }

    const onBlur = (event) => {
        setTouched({...touched, [event.target.id]: true})

        validate(event)
    }

    const validate = (event) => {
        if (event.target.type === 'email') {
            const regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g

            const match = event.target.value.match(regex)

            setErrors({...errors, [event.target.id]: !match})
        } else {
            setErrors({...errors, [event.target.id]: !(event.target.value)})
        }
    }

    return (
        <form className={classes.root} onSubmit={submitForm} action="https://formspree.io/mdowkvqq" method="POST">
            <TextField 
                classes={{root: classes.input}}
                autoComplete='off'
                id="email" 
                label="Email" 
                type="email"
                variant="outlined" 
                value={values.email} 
                required 
                onChange={onChange} 
                disabled={status === "PENDING" || status === "SUCCESS"}
                error={touched.email && errors.email}
                onBlur={onBlur}
                helperText={touched.email && errors.email && "Enter a valid email"}
            />
            <TextField 
                classes={{root: classes.input}}
                autoComplete='off'
                id="message" 
                label="Message" 
                variant="outlined" 
                multiline 
                rows={10} 
                value={values.message} 
                required 
                onChange={onChange} 
                disabled={status === "PENDING" || status === "SUCCESS"}
                error={touched.message && errors.message}
                onBlur={onBlur}
                helperText={touched.message && errors.message && "A message is required"}
            />
            {status !== "SUCCESS" && status !== "PENDING" && (<Button type="submit">Send</Button>)}
            {status === "PENDING" && (<div className={classes.spinnerContainer}><CircularProgress /></div>)}
            {status === "SUCCESS" && <Typography classes={{root: classes.formspreeSuccess}}>Your message was sent successfully! I will get back to you soon</Typography>}
            {status === "ERROR" && <Typography classes={{root: classes.formspreeError}}>There is a problem with formspree.io, please use the mail icon below instead</Typography>}
        </form>
    )
  
}