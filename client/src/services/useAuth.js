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
        const timeout = setTimeout(() => {
            refresh()
        }, ((expiresIn - 60) * 1000))
        return () => clearTimeout(timeout)
    }, [refreshToken, expiresIn])

    async function login() {
        await axios.post('http://localhost:3000/spotify', { code })
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
        await axios.post('http://localhost:3000/spotify/refresh', { refreshToken })
            .then(res => {
                console.log('refresh function response data', res.data)
                setAccessToken(res.data.accessToken)
                setExpiresIn(res.data.expiresIn)
            })
            .catch(() => {
                window.location = "/"
            })
    }
    return accessToken
}
