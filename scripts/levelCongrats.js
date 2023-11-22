Swal.fire({
    title: "Amazing!\nYou've done enough to reach the next rank!",
    width: 600,
    padding: "3em",
    color: "#716add",
    background: "#fff url(https://i.pinimg.com/1200x/7a/0a/e6/7a0ae642e99a24a0142e59d7f2c3c04f.jpg)",
    backdrop: `rgba(0,0,0,0.6)
        url("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3Nsa3hiNmNmbzhtdGxra2ZieWY1OWw2bmUyY3JiN3h6cGpqejMzNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/fU4rqm0AHZtqGED9m4/giphy.gif")
        top
        no-repeat`,
    confirmButtonText: "Great!"}).then((ok) => {
        if (ok.isConfirmed) {
            window.location.href = "activities.html"}})

