import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()
    useEffect(() => {
        if (code) {
            login()
        }
    }, [code])

    useEffect(() => {
        if (!refreshToken || !expiresIn) return
        const interval = setInterval(() => {
            refresh()
            return () => clearInterval(interval)
        }, ((expiresIn - 60) * 1000))
    }, [refreshToken, expiresIn])

    async function login() {
        await axios.post('http://localhost:3000/login', { code })
            .then(res => {
                console.log(res.data)
                setAccessToken(res.data.accessToken)
                setRefreshToken(res.data.refreshToken)
                setExpiresIn(res.data.expiresIn)
                localStorage.setItem("accessToken", res.data.accessToken)
                window.history.pushState({}, null, '/')
            })
            .catch(() => {
                window.location = "/"
            })
    }

    async function refresh() {
        await axios.post('http://localhost:3000/login/refresh', { refreshToken })
            .then(res => {
                console.log(res.data)
                setAccessToken(res.data.accessToken)
                setExpiresIn(res.data.expiresIn)
            })
            .catch(() => {
                window.location = "/"
            })
    }
    return accessToken
}
