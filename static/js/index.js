/* eslint-disable no-undef */

// eslint-disable-next-line no-unused-vars
function toggleView(id) {
    const elem = $('#' + id)
    const type = elem.attr('type')

    if(type === 'password') {
        elem.attr('type','text')
        return
    }

    elem.attr('type','password')
}

// eslint-disable-next-line no-unused-vars
function toggleVisibility(id) {
    const elem = $('#' + id)

    if(elem.is(':visible')) {
        elem.hide()
        return
    }

    elem.show()
}

// eslint-disable-next-line no-unused-vars
function copy(id) {
    navigator.clipboard.writeText($('#' + id).val())
}

// eslint-disable-next-line no-unused-vars
async function remove(id) {
    try {
        const res = await fetch('/remove/' + id,{method:'POST'})

        if(res.status !== 200) {
            throw 'Failed to remove login ' + id
        }

        $('#logins').DataTable().destroy()
        $('#row-' + id).remove()
        $('#logins').DataTable().draw()
    } catch(err) {
        console.log(err)
        alert('Failed to remove login ' + id)
    }
}