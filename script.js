const { jsPDF } = window.jspdf;
const video = document.getElementById('camera-feed');
const canvas = document.getElementById('canvas');
const capturedImage = document.getElementById('captured-image');
const startBtn = document.getElementById('start-camera');
const captureBtn = document.getElementById('capture-btn');
const downloadBtn = document.getElementById('download-btn');
let stream = null;

startBtn.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        video.style.display = 'block';
        capturedImage.style.display = 'none';
        startBtn.disabled = true;
        captureBtn.disabled = false;
        downloadBtn.disabled = true;
    } catch (err) { alert("Please allow camera permission!"); }
});

captureBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    capturedImage.src = canvas.toDataURL('image/jpeg', 0.9);
    capturedImage.style.display = 'block';
    video.style.display = 'none';
    if(stream) stream.getTracks().forEach(track => track.stop());
    captureBtn.disabled = true;
    downloadBtn.disabled = false;
    startBtn.disabled = false;
    startBtn.innerText = "🔄 Re-Scan";
});

downloadBtn.addEventListener('click', () => {
    const doc = new jsPDF({ orientation: canvas.width > canvas.height ? 'l' : 'p', unit: 'px', format: [canvas.width, canvas.height] });
    doc.addImage(capturedImage.src, 'JPEG', 0, 0, canvas.width, canvas.height);
    doc.save('My-Scanned-PDF.pdf');
    alert("PDF Downloaded Successfully!");
});
