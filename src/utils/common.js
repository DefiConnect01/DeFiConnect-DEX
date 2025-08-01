import { Bounce } from 'react-toastify'

export const shortenAddress = (address, chars = 4) => {
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}

export const parseFloat = (value, defaultValue = 0) => {
    const parsed = Number.parseFloat(value)
    return Number.isNaN(parsed) ? defaultValue : parsed
}

export const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'

    const date = new Date(timestamp * 1000)
    return date.toLocaleString()
}

export const ONE_DAY = 24 * 60 * 60

export function getTimeLeft(timestamp) {
    const now = Math.floor(Date.now() / 1000)
    const diff = Number(timestamp) - now

    if (diff <= 0) return '0'

    const days = Math.floor(diff / 86400).toString()
    const hours = Math.floor((diff % 86400) / 3600).toString()
    const minutes = Math.floor((diff % 3600) / 60).toString()
    const seconds = (diff % 60).toString()

    return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

export const toastProps = {
    position: 'bottom-left',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
    className: 'rounded-2xl bg-orange p-2 text-white drop-shadow',
}

export function addCommas(value) {
    const num = parseFloat(value.toString())
    if (isNaN(num)) throw new Error('Invalid number')
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
    })
}