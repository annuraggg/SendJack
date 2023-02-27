const resetButton = document.getElementById('submit')

resetButton.addEventListener("click", function (event) {
    const email = document.getElementById('email').value
    const info = document.getElementById('info')

    $.post(
        "reset",
        {
            email: email
        },
        function (data) {
            if (data.success) {
                info.style.color = 'green'
                info.innerHTML = data.message
            } else {
                info.style.color = 'red'
                info.innerHTML = data.message
            }
        })
})