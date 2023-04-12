const socket = new WebSocket('wss://localhost:8080');

class Credentials {
    constructor(organization, username, mission) {
        this.organization = organization;
        this.username = username;
        this.mission = mission;
    }
}

var test_credentials = new Credentials(
    "test_organization",
    "test_username",
    "test_mission"
);

socket.onopen = function (event) {
    console.log("[open] Connected to server");
    socket.send(JSON.stringify(test));
}

socket.onclose = function (event) {
    if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        console.log('[close] Connection died');
    }
}

// Wait for the connection to become established.
while (socket.CONNECTING);

const pickerOpts = {
    types: [
      {
        description: "Images",
        accept: {
          "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp", ".svg", ".bmp"],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
};
 
async function getTheFile() {
    // Open file picker and destructure the result the first handle
    const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
 
    // get file contents
    return fileHandle.getFile();
}

while (true) {
    if (socket.CLOSED) {
        break;
    }
    try {
        const file = await getTheFile();
        socket.send(file);
    } catch (err) {
        break;
    }
}
