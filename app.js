// Reference to the port and reader
let port;
let reader;

async function connectToSerialPort() {
    try {
        // Request a port and open a connection
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 }); // Adjust baud rate as needed

        // Start reading data
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        reader = textDecoder.readable.getReader();

        document.getElementById("data-display").textContent = "Connected! Reading data...";
        readData();
    } catch (error) {
        console.error("Error connecting to the serial port:", error);
    }
}

async function readData() {
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                console.log("Reader has been closed.");
                break;
            }
            // Display received data
            document.getElementById("data-display").textContent += `\n${value}`;
        }
    } catch (error) {
        console.error("Error reading data:", error);
    } finally {
        // Clean up the reader when done
        reader.releaseLock();
    }
}


async function disconnectSerialPort() {
    if (reader) {
        await reader.cancel();
        reader.releaseLock();
    }
    if (port) {
        await port.close();
        port = null;
    }
    document.getElementById("data-display").textContent = "Disconnected.";
}

document.getElementById("disconnect-button").addEventListener("click", disconnectSerialPort);

document.getElementById("connect-button").addEventListener("click", connectToSerialPort);

