/* eslint-disable no-undef */

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = UPPERCASE.toLowerCase()
const SPECIAL = '!@#$%^&*'
const NUMBERS = '0123456789'

function randomChoice(iter) {
    return iter[Math.floor(Math.random() * iter.length)]
}

function generatePassword(length) {
    let include = []
    let password = ''

    if($('#uppercase').prop('checked')) include = include.concat(UPPERCASE.split(''))
    if($('#lowercase').prop('checked')) include = include.concat(LOWERCASE.split(''))
    if($('#special').prop('checked')) include = include.concat(SPECIAL.split(''))
    if($('#numbers').prop('checked')) include = include.concat(NUMBERS.split(''))

    for(let i=0; i<length; ++i) {
        password += randomChoice(include)
    }

    $('#password').val(password)
}

$(document).ready(() => {
    $('#length').on('input change',e => {
        const length = parseInt(e.target.value)

        generatePassword(length)
        $('#activeLength').text('Length: ' + length)
    })
})
