// Calls to handle all browser implementations
GetUserMedia();
GetRTCPeerConnection();
GetRTCSessionDescription();
GetRTCIceCandidate();

// Initialize peer connection
const caller = new window.RTCPeerConnection();

// Listen for ICE Candidates and send them to remote peers
caller.onicecandidate = function(evt) {
    if(!evt.candidate) return;
    console.log('onicecandidate called');
    onIceCandidate(caller, evt);
}

// Handler to receive remote feed and show in remoteview video
caller.onaddstream = function(evt) {
    console.log("onaddstream called");
    if (window.URL) {
        document.getElementById('remoteview').src = window.URL.createObjectURL(evt.stream);
    } else {
        document.getElementById('remoteview').src = stream;
    }
    caller.addStream(stream);
}

// Get local feed and show in selfview
navigator.getUserMedia({video: true, audio: true}, function(stream) {
    if (window.URL) {
        document.getElementById('selfview').src = window.URL.createObjectURL(evt.stream);
    } else {
        document.getElementById('selfview').src = stream;
    }
    caller.addStream(stream);
}, function(evt) {
    console.log("Error occurred");
});

function GetRTCIceCandidate(){
    window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate
                || window.mozRTCIceCandidate || window.msRTCIceCandidate;
    return window.RTCIceCandidate;
}
function GetUserMedia(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                    || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    return navigator.getUserMedia;
}
function GetRTCPeerConnection(){
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection
                        || window.mozRTCPeerConnection || window.msRTCPeerConnection;
    return window.RTCPeerConnection;
}
function GetRTCSessionDescription(){
    window.RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription
                    ||  window.mozRTCSessionDescription || window.msRTCSessionDescription;
    return window.RTCSessionDescription;
}

// Create and send offer to remote peer on button click
document.getElementById("makeCall").addEventListener("click", function() {
    caller.createOffer().then(function(desc) {
        caller.setLocalDescription(new RTCSessionDescription(desc));
        socket.emit("sdp", JSON.stringify({"sdp": desc}));
    });
});

// Send the ICE Candidate to remote peer
function onIceCandidate(peer, evt) {
    if (evt.candidate) {
        socket.emit("candidate", JSON.stringify({"candidate": evt.candidate}));
    }
}

// Communications with remote peer through signaling server
socket.on("connect", function(client) {
    console.log("connected");

    // Listen for candidate message from peer
    socket.on("candidate", function(msg) {
        console.log("candidate received");
        caller.addIceCandidate(new RTCIceCandidate(JSON.parse(msg).candidate));
    });

    /// Listen for session description protocal message with session details
    socket.on("sdp", function(msg) {
        console.log("sdp received");
        var sessionDesc = new RTCSessionDescription(JSON.parse(msg).sdp);
        caller.setRemoteDescription(sessionDesc);
        caller.createAnswer().then(function(sdp) {
            caller.setLocationDescription(new RTCSessionDescription(sdp));
            socket.emit("answer", JSON.stringify({"sdp": sdp}));
        });
    });

    // Listen for answer to offer
    socket.on("answer", function(answer) {
        console.log("answer received");
        caller.setRemoteDescription(new RTCSessionDescription(JSON.parse(answer).sdp));
    });
});