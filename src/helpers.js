export const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'
export const DECIMALS = (10 ** 18)

export const ether = (wei) => {
    if (wei) {
        return (wei / DECIMALS) // 18 decimal places
    }
}

// Tokens and ether have same decimal resolution
export const tokens = ether

export const WHITE = '#E5F0FF'
export const GREEN = '#00B38B'
export const RED = '#B01010'