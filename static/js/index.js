$(document).ready(() => $('#logins').DataTable())

function toggleView(id) {
    const elem = $('#' + id)
    const type = elem.attr('type')

    if(type === 'password') {
        elem.attr('type','text')
        return
    }

    elem.attr('type','password')
}

function copy(id) {
    navigator.clipboard.writeText($('#' + id).val())
}

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