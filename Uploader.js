const socket = new WebSocket('ws://localhost:8080');

class Credentials {
    constructor(organization, username, mission) {
        this.organization = organization;
        this.username = username;
        this.mission = mission;
    }
}

const test_credentials = new Credentials(
    "test_organization",
    "test_username",
    "test_mission"
);

socket.onopen = function (event) {
    console.log("[open] Connected to server");
    socket.send(JSON.stringify(test_credentials));
}

socket.onclose = function (event) {
    if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        console.log('[close] Connection died');
    }
}

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
    multiple: true,
};
 
async function sendFile() {
    try {
        const files = await window.showOpenFilePicker(pickerOpts);
        files.forEach(async fileHandle => {
            const file = await fileHandle.getFile();
            const fileReader = new FileReader();
            fileReader.onload = function(event) {
                socket.send(event.target.result);
            };
            fileReader.readAsArrayBuffer(file);
        })
        
    } catch (err) {
        console.error(err);
    }
}

socket.onerror = function(event) {
    console.log(`[error] ${event.message}`);
}

socket.onmessage = function(event) {
    console.log(`[message] Received data: ${event.data}`);
}

const button = document.querySelector('.test');
if (button) {
    button.addEventListener('click', async function() {
        sendFile();
    });
}