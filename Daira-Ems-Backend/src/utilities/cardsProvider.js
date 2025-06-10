const createCardsString = async (data) => {
  const Stringdata = JSON.stringify(data, (key, value) => {
    if (key === '_id') {
      return undefined;
    }
    return value;
  });

  const script = '`<div class="card-header"> <img src="https://res.cloudinary.com/ddxgntu3g/image/upload/v1743177316/daira_logo_kkhvww.jpg" alt="Daira Logo" style="width: 60px" /><h4 class="title">Participant Card</h4></div> <canvas id="qr-code-${index}" class="qr-code"></canvas><div class="participant-info"> <div class="name">${participant.participantName}</div> <div class="institution">${participant.institute}</div> <div class="cnic">${participant.participantCnic}</div> <div class="event">${participant.eventName}</div> <div class="id">${participant.id}</div> </div>`';
  const script2 = '`qr-code-${index}`';

  const string = String.raw`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Participant Card</title>
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.4.4/build/qrcode.min.js"></script>
    <style>
      @page {
        size: A4;
        margin: 8mm;
      }
      body {
        margin: 0;
        padding: 0;
      }
      .card-wrapper {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 5px;
        width: 210mm;
        margin: 0 auto;
      }
      .card-container {
        font-family: 'Arial', sans-serif;
        border: 1px solid #000;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 85mm;
        page-break-inside: avoid; /* Critical: Prevents cards from breaking across pages */
        break-inside: avoid; /* For modern browsers */
      }
      .card-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 5px;
        padding: 5px;
      }
      .title {
        font-weight: bold;
        text-transform: uppercase;
        margin-top: 5px;
        margin-bottom: 5px;
      }
      .qr-code {
        width: 70px !important;
        height: 70px !important;
        margin-bottom: 5px;
      }
      .participant-info {
        text-align: center;
        padding: 5px;
      }
      .name,
      .event,
      .id {
        margin-bottom: 3px;
        margin-top: 3px;
        font-size: 12px;
        font-weight: bold;
      }
      .institution,
      .cnic {
        margin-bottom: 3px;
        margin-top: 3px;
        font-size: 12px;
      }
      /* Force page break after every 9 cards (3 rows of 3) */
      .page-break {
        page-break-after: always;
        break-after: page; /* For modern browsers */
        height: 0;
        margin: 0;
        padding: 0;
      }
      @media print {
        .card-container {
          page-break-inside: avoid;
          break-inside: avoid;
        }
      }
    </style>
  </head>
  <body>
    <div class="card-wrapper" id="card-wrapper">
      <script>
        document.addEventListener('DOMContentLoaded', function () {
          const participants = ${Stringdata};
          const cardWrapper = document.getElementById('card-wrapper');
          
          participants.forEach((participant, index) => {
            // Create card container
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';
            cardContainer.innerHTML = String.raw ${script}
            cardWrapper.appendChild(cardContainer);
            
            // Add page break after every 9 cards
            if ((index + 1) % 9 === 0 && index < participants.length - 1) {
              const pageBreak = document.createElement('div');
              pageBreak.className = 'page-break';
              cardWrapper.appendChild(pageBreak);
            }
            
            // Generate QR code
            setTimeout(() => {
              const qrCanvas = document.getElementById(${script2});
              QRCode.toCanvas(
                qrCanvas,
                JSON.stringify(participant),
                {
                  width: 200,
                  height: 200,
                },
                function (error) {
                  if (error) console.error('Error generating QR code:', error);
                }
              );
            }, 0);
          });
        });
      </script>
    </div>
  </body>
</html>`;

  return string;
};
async function generateRandomString(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
async function generateRandomStringA(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const generateSId = async (participant) => {
  const accommodationStatus = participant.accommodation_status
    ? 'T'
    : participant.cnic[participant.cnic.length - 1];
  const randomString = await generateRandomString(10);
  const randomStringA = await generateRandomStringA(1);

  const id = `F${randomString}${accommodationStatus}${randomStringA}0`;

  return id;
};
const isIdPresent = async (id, dataToPrint) => {
  return dataToPrint.some((item) => item._id === id);
};

// Function to update eventName if _id exists
const updateEventName = async (id, eventName, dataToPrint) => {
  dataToPrint.forEach((item) => {
    if (item._id === id) {
      item.eventName = item.eventName + ', ' + eventName;
    }
  });
};
export { createCardsString, generateSId, isIdPresent, updateEventName };
