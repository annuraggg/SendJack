const submit = document.getElementById('submit')
const errbox = document.getElementById('errbox')

submit.addEventListener('click', (event) => {
    event.preventDefault()
    const phone = document.getElementById('phone').value

    if (phone) {
        $.post("/signup/google/data", { phone: phone }, (data) => { 
            if(data.success) {
                window.location.href = '/login'
            } else {
                errbox.innerHTML = data.message
            }
        })
    }

})