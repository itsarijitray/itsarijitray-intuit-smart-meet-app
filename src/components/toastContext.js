import { createContext, useContext, useState } from "react";
import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Snackbar } from "@mui/material";

const TOAST_STATUS = {
    INFO: "info",
    ERROR: "error",
    SUCCESS: "success"
}

export const toastContext = createContext({
    handleError: () => {},
    handleSuccess: () => {},
    handleInfo: () => {}
});

export function ToastContextProvider({children}) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState(TOAST_STATUS.INFO);
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };

    function openToast(messageText) {
        setMessage(messageText)
        setOpen(true)
    }

    function handleSuccess(messageText) {
        setSeverity(TOAST_STATUS.SUCCESS)
        openToast(messageText)
    }
    function handleError(messageText) {
        setSeverity(TOAST_STATUS.ERROR)
        openToast(messageText)
    }
    function handleInfo(messageText) {
        setSeverity(TOAST_STATUS.INFO)
        openToast(messageText)
    }
    return (
        <toastContext.Provider value={{handleSuccess, handleError, handleInfo}}>
            {children}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </toastContext.Provider>
    )
}

ToastContextProvider.propTypes = {
    children: PropTypes.any
}

export function useToastContext() {
    const {handleError, handleSuccess, handleInfo} = useContext(toastContext);
    return {handleError, handleSuccess, handleInfo}
}