function getUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    return navigator.getUserMedia;
}

function showWebcam() {
    const userMedia = getUserMedia();
    if (userMedia) {
        navigator.getUserMedia({video: true, audio: true}, function(stream) {
            document.getElementsByTagName("video")[0].src = window.URL.createObjectURL(stream);
        }, function (error) {
            console.log("There was an error getting user's media");
        });
    }
}
document.getElementById("showCamera").addEventListener("click", showWebcam);