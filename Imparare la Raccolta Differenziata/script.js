const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const initialBasketWidth = 60;  
const initialBasketHeight = 100;  
const basketXOffset = 40;         
const numberOfBaskets = 5;       

let basketWidth ;
    let basketHeight;

const maxBasketWidth = 100; 
const maxBasketHeight = 170; 


const basketItemImage1 = new Image();
const basketItemImage2 = new Image();
const basketItemImage3 = new Image();
const basketItemImage4 = new Image();
const basketItemImage5 = new Image();
basketItemImage1.src = 'imgs_bidoni/carta.webp';
basketItemImage2.src = 'imgs_bidoni/vetro.webp';
basketItemImage3.src = 'imgs_bidoni/plastica.png';
basketItemImage4.src = 'imgs_bidoni/secco.png';
basketItemImage5.src = 'imgs_bidoni/mela.webp';




const basketItemImages = [
    basketItemImage1, 
    basketItemImage2, 
    basketItemImage3,
    basketItemImage4,
    basketItemImage5,
];


const centralImage = new Image();

let centralImageX = 0;
let centralImageY = 0;

let centralImageWidth;
let centralImageHeight;

let offsetX = 0;
let offsetY = 0;

const basketTexts = ["Carta", "Vetro", "Plastica", "Secco", "Umido"];
const textColor = "#FFFFFF"; 
const fontSize = 20; 

// Array di colori per i cestini
const basketColors = ["#0000ff", "#008000", "#FFD633", "#c0c0c0", "#808000"];

let isDragging = false;
let openedBasketIndex = null; 
let rotationAngle = 0;

let score = 0;



const images = [
    { type: "Carta", src: ["imgs_rifiuti/carta.png", "imgs_rifiuti/cartone.png", "imgs_rifiuti/riviste.png"] },
    { type: "Vetro", src: ["imgs_rifiuti/coca.webp", "imgs_rifiuti/cont_alluminio.png", "imgs_rifiuti/vetro.png"] },
    { type: "Plastica", src: ["imgs_rifiuti/bottiglia.webp", "imgs_rifiuti/piatti.png", "imgs_rifiuti/borse.png"] },
    { type: "Secco", src: ["imgs_rifiuti/tappo_sughero.png", "imgs_rifiuti/lampadina.jpg", "imgs_rifiuti/cd.webp"] },
    { type: "Umido", src: ["imgs_rifiuti/banana.png", "imgs_rifiuti/mela.webp", "imgs_rifiuti/cialda.png"] }
];

const topLeftImage = new Image();
topLeftImage.src = "Riciclaggio2.png";

let scaleFactor1 = null;
let image_left_Width = null;
let image_left_Height = null;
const topLeftImageX = 20;
const topLeftImageY = 20;

const topLeftImage2 = new Image();
topLeftImage2.src = "spazzatura1.png";
let image_left_Width2 = null;
let image_left_Height2 = null;
const topLeftImageX2 = 30;
const topLeftImageY2 = 120;

const icon = new Image();
icon.src = "lampada.svg";
let lampd_x;
let lampd_y;
let lampd_Width;
let lampd_Height;




const scale_cerchio = 0.4;
let icon_cerchioX = canvas.width - 100;
let icon_cerchioY = 35;
let icon_raggio = 40 * scale_cerchio;

function loadImages() {
    const imageLoadPromises = images.flatMap(group =>
        group.src.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = reject;
            });
        })
    );
    return Promise.all(imageLoadPromises);
}

loadImages().then(() => {
    changeCentralImage(getRandomImage());
}).catch(error => {
    console.error("Errore nel caricamento delle immagini:", error);
});



function getRandomImage() {
    if (images.length === 0) {
        return null; 
    }

    
    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomIndex];

   
    const imageSrcIndex = Math.floor(Math.random() * selectedImage.src.length);
    const selectedSrc = selectedImage.src[imageSrcIndex];

    
    selectedImage.src.splice(imageSrcIndex, 1);

    if (selectedImage.src.length === 0) {
        images.splice(randomIndex, 1);
    }
    return { type: selectedImage.type, src: selectedSrc };
}

function changeCentralImage(newImage) {
    if (newImage) {
        centralImage.src = newImage.src;
        currentImage = newImage; 
        } else {
        drawAlert("Punteggio ottenuto: " + score + " / 15");
    }
}



function getCorrectBasketIndex(imageType) {
    return basketTexts.findIndex(basketType => basketType === imageType);
}




function drawBaskets() {
    
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 

    ctx.clearRect(0, 0, canvas.width, canvas.height);


    if(animationStartTime && state){ 
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "rgba(255, 0, 0, 0.3)");
        gradient.addColorStop(0.4, "rgba(255, 0, 0, 0)"); 
        gradient.addColorStop(0.8, "rgba(255, 0, 0, 0)"); 
        gradient.addColorStop(1, "rgba(255, 0, 0, 0.3)"); 
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }else if(animationStartTime){
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "rgba(0, 255, 0, 0.3)");
        gradient.addColorStop(0.4, "rgba(0, 255, 0, 0)"); 
        gradient.addColorStop(0.8, "rgba(0, 255, 0, 0)"); 
        gradient.addColorStop(1, "rgba(0, 255, 0, 0.3)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const scaleFactor = Math.min(
        canvas.width / (initialBasketWidth * numberOfBaskets + (numberOfBaskets - 1) * basketXOffset),
        canvas.height / initialBasketHeight
    );

    scaleFactor1 = Math.min(window.innerWidth / 9000, window.innerHeight / 5000);

    image_left_Width = topLeftImage.naturalWidth * scaleFactor1;
    image_left_Height = topLeftImage.naturalHeight * scaleFactor1;

    ctx.drawImage(topLeftImage, topLeftImageX, topLeftImageY, image_left_Width, image_left_Height);

    image_left_Width2 = topLeftImage2.naturalWidth * (scaleFactor1)- 25;
    image_left_Height2 = topLeftImage2.naturalHeight * (scaleFactor1) - 35;

    ctx.drawImage(topLeftImage2, topLeftImageX2, topLeftImageY2, image_left_Width2, image_left_Height2);

    
    lampd_x = canvas.width - (canvas.width/9);
    lampd_y = 20;
    lampd_Width = 30;
    lampd_Height = 30;
    
    if(lampdf && !lampd)
        icon.src = "lampada_chiara.svg";

    ctx.drawImage(icon, lampd_x, lampd_y, lampd_Width, lampd_Height);
    
    


    
    //Punto interrogativo
     icon_cerchioX = canvas.width - (canvas.width/15);
     icon_cerchioY = 35;
     icon_raggio = 40 * scale_cerchio;
    
    ctx.beginPath();
    ctx.arc(icon_cerchioX, icon_cerchioY, icon_raggio, 0, Math.PI * 2);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3 * scale_cerchio;
    ctx.stroke();
    ctx.closePath();

    ctx.font = "28px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("?", icon_cerchioX, 45);




    
    basketWidth = Math.min(initialBasketWidth * scaleFactor, maxBasketWidth + 20);
    basketHeight = Math.min(initialBasketHeight * scaleFactor, maxBasketHeight + 20); 

    const totalWidth = numberOfBaskets * basketWidth + (numberOfBaskets - 1) * basketXOffset;
    const startX = (canvas.width - totalWidth) / 2;
    const startY = canvas.height - basketHeight - 20; 

    

    for (let i = 0; i < numberOfBaskets; i++) {
        const x = startX + i * (basketWidth + basketXOffset); 

        if (i === openedBasketIndex && animationStartTime) {
            if(state){
            ctx.fillStyle = "red";
            ctx.font = "20px Arial";
            ctx.textAlign = "right";
            ctx.fillText('-1', canvas.width - 180, 150);
            ctx.save(); 

            ctx.translate(x + basketWidth / 2, startY + basketHeight / 2);
            ctx.rotate(Math.sin(oscillationAngle) * 0.05);
            ctx.translate(-x - basketWidth / 2, -startY - basketHeight / 2);

            ctx.strokeStyle = "red";
            ctx.lineWidth = 6;

            //maniglie
            ctx.strokeRect(x - 5 * (basketWidth / initialBasketWidth), startY + 10 * (basketHeight / initialBasketHeight), 5 * (basketWidth / initialBasketWidth), 30 * (basketHeight / initialBasketHeight));
            ctx.strokeRect(x + basketWidth, startY + 10 * (basketHeight / initialBasketHeight), 5 * (basketWidth / initialBasketWidth), 30 * (basketHeight / initialBasketHeight));
            
            
            ctx.strokeRect(x, startY, basketWidth, basketHeight);

            
            ctx.strokeRect(x - 5 * (basketWidth / initialBasketWidth), startY - 10 * (basketHeight / initialBasketHeight), basketWidth + 10 * (basketWidth / initialBasketWidth), 10 * (basketHeight / initialBasketHeight));
            
            ctx.beginPath();
            ctx.moveTo(x - 5 * (basketWidth / initialBasketWidth), startY - 10 * (basketHeight / initialBasketHeight));
            ctx.lineTo(x + basketWidth + 5 * (basketWidth / initialBasketWidth), startY - 10 * (basketHeight / initialBasketHeight));
            ctx.lineTo(x + basketWidth, startY - 20 * (basketHeight / initialBasketHeight));
            ctx.lineTo(x, startY - 20 * (basketHeight / initialBasketHeight));
            ctx.closePath();
            ctx.stroke();

            ctx.lineWidth = 1;

            ctx.shadowColor = "red";     
            ctx.shadowBlur = 0;         
            }else if(state == false){
                ctx.fillStyle = "green";
            ctx.font = "20px Arial";
            ctx.textAlign = "right";
            ctx.fillText('+1', canvas.width - 170, 150);
            ctx.save();
            }
            
        }
        
        
        // Corpo del cestino
        ctx.fillStyle = basketColors[i % basketColors.length];
        ctx.fillRect(x, startY, basketWidth, basketHeight); 
        
        // Bordo superiore del cestino

        ctx.fillStyle = "#606060"; 
        ctx.fillRect(x - 5 * (basketWidth / initialBasketWidth), startY - 10 * (basketHeight / initialBasketHeight), basketWidth + 10 * (basketWidth / initialBasketWidth), 10 * (basketHeight / initialBasketHeight));
       
        // Maniglie del cestino
        ctx.fillStyle = "#404040";
        ctx.fillRect(x - 5 * (basketWidth / initialBasketWidth), startY + 10 * (basketHeight / initialBasketHeight), 5 * (basketWidth / initialBasketWidth), 30 * (basketHeight / initialBasketHeight));
        ctx.fillRect(x + basketWidth, startY + 10 * (basketHeight / initialBasketHeight), 5 * (basketWidth / initialBasketWidth), 30 * (basketHeight / initialBasketHeight));
        
        // Coperchio del cestino
        ctx.beginPath();
        ctx.moveTo(x - 5 * (basketWidth / initialBasketWidth), startY - 10 * (basketHeight / initialBasketHeight));
        ctx.lineTo(x + basketWidth + 5 * (basketWidth / initialBasketWidth), startY - 10 * (basketHeight / initialBasketHeight));
        ctx.lineTo(x + basketWidth, startY - 20 * (basketHeight / initialBasketHeight));
        ctx.lineTo(x, startY - 20 * (basketHeight / initialBasketHeight));
        ctx.closePath();
        ctx.fillStyle = "#707070";
        ctx.fill();
        

if (i === openedBasketIndex && animationStartTime) {
            ctx.restore();
        }
        // Linee decorative sul corpo del cestino
        ctx.strokeStyle = "#505050";
        ctx.beginPath();
        ctx.moveTo(x, startY + 20 * (basketHeight / initialBasketHeight));
        ctx.lineTo(x + basketWidth, startY + 20 * (basketHeight / initialBasketHeight));
        ctx.moveTo(x, startY + 40 * (basketHeight / initialBasketHeight));
        ctx.lineTo(x + basketWidth, startY + 40 * (basketHeight / initialBasketHeight));
        ctx.moveTo(x, startY + 60 * (basketHeight / initialBasketHeight));
        ctx.lineTo(x + basketWidth, startY + 60 * (basketHeight / initialBasketHeight));
        ctx.stroke();

        

        // Iimmagine al centro del cestino
        const maxImageWidth = basketWidth * 0.8; 
        const maxImageHeight = basketHeight * 0.5;

        
        const aspectRatio = basketItemImages[i].naturalWidth / basketItemImages[i].naturalHeight;

        let imageWidth = maxImageWidth;
        let imageHeight = maxImageWidth / aspectRatio;

        if (imageHeight > maxImageHeight) {
            imageHeight = maxImageHeight;
            imageWidth = maxImageHeight * aspectRatio;
        }


        const imageX = x + (basketWidth - imageWidth) / 2;
        const imageY = startY + (basketHeight - imageHeight) / 2;
        
        ctx.drawImage(basketItemImages[i], imageX, imageY, imageWidth, imageHeight);


        // Disegna la scritta sotto l'immagine
        ctx.fillStyle = textColor; 
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = "center"; 
        const textY = imageY + imageHeight + 25;
        ctx.fillText(basketTexts[i], x + basketWidth / 2, textY);

    if (openedBasketIndex !== null && !animationStartTime && rotationAngle !== 0) {
        const x = startX + openedBasketIndex * (basketWidth + basketXOffset);
        ctx.save();
        ctx.translate(x + basketWidth / 2, startY - 20 * (basketHeight / initialBasketHeight));
        ctx.rotate(rotationAngle);
        ctx.beginPath();
        ctx.moveTo(-basketWidth / 2 - 5, 0);
        ctx.lineTo(basketWidth / 2 + 5, 0);
        ctx.lineTo(basketWidth / 2, -10);
        ctx.lineTo(-basketWidth / 2, -10);
        ctx.closePath();
        ctx.fillStyle = "#707070";
        ctx.fill();
        ctx.restore();
    }
    

    const correctBasketIndex = getCorrectBasketIndex(currentImage.type);
    if (correctBasketIndex == i && lampd) {
        const arrowStartX = canvas.width / 2;
        const arrowStartY = 100;
        const arrowEndX = x + basketWidth / 2;
        const arrowEndY = startY;
        drawArrow(ctx, arrowStartX, arrowStartY, arrowEndX, arrowEndY);
        lampdf = true;
    }

   

    
    }
    console.log('CIAO');
    

    console.log('Nuove coordinate:', centralImageX, centralImageY);

    //punteggio
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "right";
    ctx.fillText(score, canvas.width - 200, 150);
}

function draw_title(){
    ctx.fillStyle = "white";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Impara la Raccolta Differenziata", canvas.width / 2, 50);
}

function draw_image(){
    if(!isAlertVisible){
        drawBaskets();
        draw_title();
        if(currentImage){
            ctx.drawImage(centralImage, centralImageX, centralImageY, centralImageWidth, centralImageHeight);
        }
    }

    if(info)
        draw_information();
    else if(isAlertVisible)
        drawAlert("Punteggio ottenuto: " + score + " / 15");
}


centralImage.onload = () => {
    console.log('Immagine caricata');
    
    drawBaskets();

    
    size_image();
    draw_image();
};

function size_image(){
const originalWidth = centralImage.naturalWidth;
const originalHeight = centralImage.naturalHeight;

const maxWidth = canvas.width / 2 - 300; 
const maxHeight = canvas.height / 2 - 150;


const widthScaleFactor = maxWidth / originalWidth;
const heightScaleFactor = maxHeight / originalHeight;
const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor);

centralImageWidth = originalWidth * scaleFactor;
centralImageHeight = originalHeight * scaleFactor;

centralImageX = (canvas.width - centralImageWidth) / 2;
centralImageY = (canvas.height - centralImageHeight) / 2 - 100; 
}

//Animazione cestini
let highlightBasketIndex = 1;  
let oscillationAngle = 0;      
let oscillationSpeed = 1.05;

let oscillationDuration = 100;
let animationStartTime = null;
let state = null;
function animateBasket(timestamp) {
    if (!animationStartTime){ 
            size_image();
            animationStartTime = timestamp;
        } 
        const elapsed = timestamp - animationStartTime; 
    if(state == true){
        if (elapsed < oscillationDuration) {
            oscillationAngle += oscillationSpeed;
            draw_image();
            requestAnimationFrame(animateBasket); 
        } else {
            oscillationAngle = 0;
            draw_image();
            animationStartTime = null;
            
            
        }
    }else if(state != null){
        draw_image();
        requestAnimationFrame(animateBasket);
        if (elapsed < oscillationDuration) {
            draw_image();
            requestAnimationFrame(animateBasket);
        } else {
            draw_image();
            animationStartTime = null;
            state = null;
        }
    } else if(state == null){
        animationStartTime = null;
    }
}



let isAlertVisible = false;
let buttonWidth;
let buttonHeight;

let buttonX;
let buttonY;

function drawAlert(message) {
    console.log("ALERT");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rectWidth = 700;
    const rectHeight = 450;

    const x = (canvas.width - rectWidth) / 2;
    const y = (canvas.height - rectHeight) / 2;

    ctx.fillStyle = 'grey';
    ctx.fillRect(x, y, rectWidth, rectHeight);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(x, y, rectWidth, rectHeight);

    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 100);

    const quote = "“La spazzatura è una grande risorsa nel posto sbagliato a cui manca l'immaginazione di qualcuno perché venga riciclata a beneficio di tutti.”";
    const lineHeight = 30;
    const maxWidth = rectWidth - 40;

    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(" ");
        let line = "";
        let testLine, metrics;

        for (let i = 0; i < words.length; i++) {
            testLine = line + words[i] + " ";
            metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, x, y);
                line = words[i] + " ";
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
        return y;
    }

    ctx.font = '20px Arial';
    const quoteEndY = wrapText(ctx, quote, canvas.width / 2, canvas.height / 2 - 30, maxWidth, lineHeight);

    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    ctx.fillText("Mark Victor Hansen", (canvas.width + rectWidth) / 2 - 20, quoteEndY + 20);

 buttonWidth = 160;
 buttonHeight = 60;
 buttonX = (canvas.width - buttonWidth) / 2;
 buttonY = (canvas.height - buttonHeight) / 2 + 80;

ctx.fillStyle = 'blue';
ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

ctx.fillStyle = 'white';
ctx.font = '30px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText("OK", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);


    isAlertVisible = true;
}


let lampd = false;
let lampdf = false;
canvas.addEventListener('click', function(event) {
    if (isAlertVisible) {        
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;

        if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
            mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
            isAlertVisible = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            location.reload(true);
        }
    }
});

canvas.addEventListener('mousedown', (event) => {
    if(!isAlertVisible && !cestino && !diff && !info){
        if (event.clientX >= centralImageX && event.clientX <= centralImageX + centralImageWidth &&
            event.clientY >= centralImageY && event.clientY <= centralImageY + centralImageHeight) {
            isDragging = true;
            offsetX = event.clientX - centralImageX;
            offsetY = event.clientY - centralImageY;
            draw_image();
            canvas.style.cursor = 'grabbing';
        }
    }
   
});

let cestino = false;
let diff = false;
let lampd_text = false;
let info_text = false;
canvas.addEventListener('mousemove', (event) => {
    if (isDragging && !isAlertVisible && !cestino && !diff && !info) {
        centralImageX = event.clientX - offsetX;
        centralImageY = event.clientY - offsetY;
        for (let i = 0; i < numberOfBaskets; i++) {
            const basketX = (canvas.width - (basketWidth * numberOfBaskets + (numberOfBaskets - 1) * basketXOffset)) / 2 + i * (basketWidth + basketXOffset);
            const basketY = canvas.height - basketHeight - 20;

            if (centralImageX + centralImageWidth >= basketX &&
                centralImageX <= basketX + basketWidth &&
                centralImageY + centralImageHeight >= basketY &&
                centralImageY <= basketY + basketHeight) {
                
                openedBasketIndex = i;
                rotationAngle = Math.PI / 8;
                break;
            } else {
                openedBasketIndex = null;
                rotationAngle = 0;
            }
            
        }
        draw_image();
    }else if(!isDragging && !isAlertVisible && !cestino && !diff && !info){
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
        if (Math.sqrt((mouseX - icon_cerchioX) ** 2 + (mouseY - icon_cerchioY) ** 2) <= icon_raggio
           ) {
            canvas.style.cursor = 'pointer';
            draw_info();
            info_text = true;
        }else if(mouseX >= lampd_x && mouseX <= lampd_x + lampd_Width &&
            mouseY >= lampd_y && mouseY <= lampd_y + lampd_Height && !lampdf){
                canvas.style.cursor = 'pointer';
                draw_lampd();
                lampd_text = true;
            }
        else if(mouseX >= topLeftImageX && mouseX <= topLeftImageX + image_left_Width &&
            mouseY >= topLeftImageY && mouseY <= topLeftImageY + image_left_Height){
                draw_differenziata();
        }
         else if(mouseX >= topLeftImageX2 && mouseX <= topLeftImageX2 + image_left_Width2 &&
            mouseY >= topLeftImageY2 && mouseY <= topLeftImageY2 + image_left_Height2){
                
            draw_Cestino();
        }
        else if(event.clientX >= centralImageX && event.clientX <= centralImageX + centralImageWidth &&
            event.clientY >= centralImageY && event.clientY <= centralImageY + centralImageHeight){
            canvas.style.cursor = 'grab';
            }else if(!lampdf && lampd_text == true){canvas.style.cursor = 'default';
                draw_image();
                lampd_text = false;
            } else if( info_text == true){
                canvas.style.cursor = 'default';
                draw_image();
                info_text = false;
            } else canvas.style.cursor = 'default';
    }else if(isAlertVisible && !cestino && !diff && !info){
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
        if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
            mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {

            isMouseOverButton = true;
            canvas.style.cursor = 'pointer';
        } else {
            isMouseOverButton = false;
            canvas.style.cursor = 'default';
        }
    }else if(cestino && !diff && !info){
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    
        if ((mouseX <= cestino_x || mouseX >= cestino_x + cestino_width ||
            mouseY <= cestino_y || mouseY >= cestino_y + cestino_height) &&(
            mouseX < topLeftImageX2 || mouseX > topLeftImageX2 + image_left_Width2 + 30 ||
            mouseY < topLeftImageY2 || mouseY > topLeftImageY2 + image_left_Height2)) {
            
            cestino = false;
            draw_image();
        }
    }else if(diff & !info){
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    
        if ((mouseX <= diff_x || mouseX >= diff_x + diff_width ||
            mouseY <= diff_y || mouseY >= diff_y + diff_height) &&(
            mouseX < topLeftImageX|| mouseX > topLeftImageX + image_left_Width ||
            mouseY < topLeftImageY || mouseY > topLeftImageY + image_left_Height)) {
            diff = false;
            draw_image();
        }
    }else if(info){ 
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
        if(mouseX >= ret_x + ret_width - 40 && mouseX <= ret_x + ret_width - 10 &&
        mouseY >= ret_y + 10 && mouseY <= ret_y + 50){
        canvas.style.cursor = 'pointer';
        }
    }
});


let cestino_width;
let cestino_height;
let cestino_x;
let cestino_y;

function draw_Cestino(){
    
        if(cestino == false ){
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        cestino = true;
        }

    cestino_width = canvas.width - (canvas.width*20/100);
    cestino_height = canvas.height - (canvas.height*20/100);

     cestino_x = (canvas.width - cestino_width) / 2;
     cestino_y = (canvas.height - cestino_height) / 2;

    ctx.fillStyle = 'rgba(20,67,0,1)';
    ctx.fillRect(cestino_x, cestino_y, cestino_width, cestino_height);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(cestino_x, cestino_y, cestino_width, cestino_height);


let title = "Fare la raccolta differenziata è importante!";
let elenco = "Meno rifiuti\n" + 
             "Riciclo \n" +
             "Proteggere il mondo\n" +
             "Risparmiare Materiali\n";

ctx.fillStyle = 'white'; 
ctx.font = '30px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

let titleY = cestino_y + 40;
let titleLine = '';
let titleLines = title.split(' ');

titleLines.forEach(word => {
    const testTitleLine = titleLine + word + ' ';
    const titleWidth = ctx.measureText(testTitleLine).width;

    if (titleWidth > cestino_width && titleLine !== '') {
        ctx.fillText(titleLine, canvas.width / 2, titleY);
        titleLine = word + ' ';
        titleY += 40;
    } else {
        titleLine = testTitleLine;
    }
});
ctx.fillText(titleLine, canvas.width / 2, titleY);

ctx.font = '25px Arial';
ctx.fillStyle = 'white';
let elencoY = titleY + 50;


elencoY += 50;
let elencoLines = elenco.split('\n');
elencoLines.forEach(line => {
    let elencoLine = '';
    let elencoWords = line.split(' ');

    elencoWords.forEach(word => {
        const testElencoLine = elencoLine + word + ' ';
        const elencoWidth = ctx.measureText(testElencoLine).width;

        if (elencoWidth > cestino_width && elencoLine !== '') {
            ctx.fillText(elencoLine, canvas.width / 2, elencoY); 
            elencoLine = word + ' ';
            elencoY += 25;
        } else {
            elencoLine = testElencoLine;
        }
    });
    ctx.fillText(elencoLine, canvas.width / 2, elencoY);
    elencoY += 30;

    

});
ctx.drawImage(topLeftImage2, topLeftImageX2, topLeftImageY2, image_left_Width2, image_left_Height2);

elencoY += 20;
}


let diff_width;
let diff_height;
let diff_x;
let diff_y;
function draw_differenziata() {
    if (diff == false) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        diff = true;
    }


    const image1 = new Image();
    image1.src = 'diff/ric.png';


    image1.onload = function() {
         diff_width = canvas.width - (canvas.width * 20 / 100);
         diff_height = canvas.height - (canvas.height * 20 / 100);
         diff_x = (canvas.width - diff_width) / 2;
         diff_y = (canvas.height - diff_height) / 2;
        ctx.fillStyle = 'rgb(6, 67, 67)';
        ctx.fillRect(diff_x, diff_y, diff_width, diff_height);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(diff_x, diff_y, diff_width, diff_height);

        const imgWidth = diff_width / 5 * 0.8;
        const imgHeight = (image1.height / image1.width) * imgWidth;

        const margin = 10;
        const totalWidth = imgWidth * 5 + margin * 4;

        const startX = diff_x + (diff_width - totalWidth) / 2;

        ctx.fillStyle = 'white';
        ctx.font = '44px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Raccolta differenziata', canvas.width / 2, diff_y + 80);

        const captions = ['Carta', 'Vetro', 'Plastica', 'Secco', 'Umido'];
        const examples = [
            ['Giornali', 'Scatole di cartone', 'Libri...'],
            ['Bottiglie', 'Vasi', 'Barattoli...'],
            ['Buste', 'Contenitori', 'Imballaggi...'],
            ['Rifiuti non riciclabili', 'Cibo avariato', 'Pannolini...'],
            ['Fiori', 'Scarti di frutta', 'Avanzi di cibo...']
        ];

        for (let i = 0; i < 5; i++) {
            const imgX = startX + (imgWidth + margin) * i;

            if (i == 0) ctx.fillStyle = 'rgba(0, 0, 255, 1)'; 
            else if (i == 1) ctx.fillStyle = 'rgba(0, 255, 0, 1)';
            else if (i == 2) ctx.fillStyle = 'rgba(255, 255, 0, 1)';
            else if (i == 3) ctx.fillStyle = 'rgba(128, 128, 128, 1)';
            else if (i == 4) ctx.fillStyle = 'rgba(165, 42, 42, 1)';

            ctx.fillRect(imgX, diff_y + 145, imgWidth, imgHeight + 10); 

            ctx.drawImage(image1, imgX, diff_y + 150, imgWidth, imgHeight);

            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(captions[i], imgX + imgWidth / 2, diff_y + 150 + imgHeight + 30);

            ctx.font = '16px Arial';
            const exampleY = diff_y + 150 + imgHeight + 50;

            function drawMultilineText(text, x, y, maxWidth) {
                const words = text.split(', ');
                let line = '';

                for (let n = 0; n < words.length; n++) {
                    const testLine = line + (line ? ', ' : '') + words[n];
                    const metrics = ctx.measureText(testLine);
                    const testWidth = metrics.width;

                    if (testWidth > maxWidth && n > 0) {
                        ctx.fillText(line, x, y);
                        line = words[n];
                        y += 20;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, x, y);
            }
            drawMultilineText(examples[i].join(', '), imgX + imgWidth / 2, exampleY, imgWidth);
        }
        ctx.drawImage(topLeftImage, topLeftImageX, topLeftImageY, image_left_Width, image_left_Height);

    };
    image1.onerror = function() {
        console.error("Impossibile caricare l'immagine:", image1.src);
    };
}

function drawArrow(ctx, startX, startY, endX, endY) {
    
    const headlen = 10;
    const offset = 200;
    const angle = Math.atan2(endY - startY, endX - startX);

    const newStartX = startX + offset * Math.cos(angle);
    const newStartY = startY + offset * Math.sin(angle);

    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";

    ctx.beginPath();
    ctx.moveTo(newStartX, newStartY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
        endX - headlen * Math.cos(angle - Math.PI / 6),
        endY - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(endX, endY);
    ctx.lineTo(
        endX - headlen * Math.cos(angle + Math.PI / 6),
        endY - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
}

function draw_lampd(){
let rect_x = lampd_x;
let rect_y = lampd_y + lampd_Height + 5;
let rect_Width = lampd_Width;
let rect_Height = 10;

ctx.fillStyle = "white";
ctx.font = "13px Verdana";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("Aiuto", rect_x + rect_Width / 2, rect_y + rect_Height / 2);
}

let info = false;
let ret_x, ret_y, ret_width, ret_height;
function draw_information(){
   console.log("FATTO");

        if(info == false ){
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            info = true;
        }
    
        ret_width = canvas.width - (canvas.width*20/100);
        ret_height = canvas.height - (canvas.height*20/100);
    
         ret_x = (canvas.width - ret_width) / 2;
         ret_y = (canvas.height - ret_height) / 2;
    
        ctx.fillStyle = 'rgb(6, 67, 107)';
        ctx.fillRect(ret_x, ret_y, ret_width, ret_height);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(ret_x, ret_y, ret_width, ret_height);

ctx.fillStyle = 'white';
ctx.font = '30px Arial'; 
ctx.fillText("X", ret_x + ret_width - 40, ret_y + 35);


ctx.fillStyle = 'white';

ctx.font = '35px Arial';
ctx.textAlign = 'center';
ctx.fillText("Regole del gioco", canvas.width / 2, ret_y + 50);

ctx.font = '25px Arial'; 
ctx.fillStyle = 'green';
ctx.fillText("Trascina il rifiuto nel cestino corretto!", canvas.width / 2, ret_y + 90);
ctx.fillStyle = 'white';

ctx.font = '18px Arial'; 
const scoringLines = [
    "Punteggio in alto a destra verrà calcolato nel seguente modo:",
    "- Scelta cestino corretta: +1;",
    "- Scelta cestino sbagliata: -1;"
];

for (let i = 0; i < scoringLines.length; i++) {
    ctx.fillText(scoringLines[i], canvas.width / 2, ret_y + 110 + (i * 30)+20);
}

ctx.font = '22px Arial';
const additionalInfo = "Trascina il cursore nelle icone e impara nuove funzionalità!";
ctx.fillText(additionalInfo, canvas.width / 2, ret_y + 210 + (scoringLines.length * 30) +20);

ctx.fillText("L'icona💡 ti darà un suggerimento", canvas.width / 2, ret_y + 210 + (scoringLines.length * 30) +60);
}

function draw_info(){
let rect_x = icon_cerchioX - (icon_raggio * 2);
let rect_y = icon_cerchioY + icon_raggio + 5;
let rect_width = icon_raggio * 4;
let rect_height = 20;

ctx.fillStyle = "white";
ctx.font = "13px Verdana";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("Info", rect_x + rect_width / 2, rect_y + rect_height / 2);
}



canvas.addEventListener('mouseup', (event) => {
    if(!isAlertVisible && !cestino && !diff){
        isDragging = false;
        canvas.style.cursor = 'default';
        if(rotationAngle !== 0){
            const basketIndex = openedBasketIndex;
            console.log("OPEN: " + rotationAngle);
            if (basketIndex !== null) {
                const basketType = basketTexts[basketIndex];
                if (currentImage && basketType === currentImage.type) {
                    lampd = false;
                    score ++;
                    changeCentralImage(getRandomImage());
                    state = false;
                    requestAnimationFrame(animateBasket);
                }else if(currentImage){
                    state = true;
                    requestAnimationFrame(animateBasket);
                    score --;
                }
            }
        }

        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
        if (mouseX >= lampd_x && mouseX <= lampd_x + lampd_Width &&
            mouseY >= lampd_y && mouseY <= lampd_y + lampd_Height){
                if(!lampdf){
                    lampd = true;
                    draw_image();
                }
             console.log(lampd);
        }
        
        if(Math.sqrt((mouseX - icon_cerchioX) ** 2 + (mouseY - icon_cerchioY) ** 2) <= icon_raggio){
            console.log("CLICK");
                draw_information();
            }



        rotationAngle = 0;
    }

    if(info){
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
        if(mouseX >= ret_x + ret_width - 40 && mouseX <= ret_x + ret_width - 10 &&
        mouseY >= ret_y + 10 && mouseY <= ret_y + 50){
        info = false;
        draw_image();
        }
    }else if(!cestino && !diff) draw_image();

});

canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();

    const touch = event.changedTouches[0];

    if (!isAlertVisible && !cestino && !diff && !info) {
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        if (touchX >= centralImageX && touchX <= centralImageX + centralImageWidth &&
            touchY >= centralImageY && touchY <= centralImageY + centralImageHeight) {
            isDragging = true;
            offsetX = touchX - centralImageX;
            offsetY = touchY - centralImageY;
            draw_image();
            canvas.style.cursor = 'grabbing';
        }
    }

    if (isAlertVisible) {        
        if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
            mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
            isAlertVisible = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            console.log("Execution continued after clicking OK");
            location.reload(true);
        }
    }
});


canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();

    const touch = event.changedTouches[0];
    const mouseX = touch.clientX - canvas.getBoundingClientRect().left;
    const mouseY = touch.clientY - canvas.getBoundingClientRect().top;

    if (isDragging && !isAlertVisible && !cestino && !diff && !info) {
        centralImageX = mouseX - offsetX;
        centralImageY = mouseY - offsetY;

        for (let i = 0; i < numberOfBaskets; i++) {
            const basketX = (canvas.width - (basketWidth * numberOfBaskets + (numberOfBaskets - 1) * basketXOffset)) / 2 + i * (basketWidth + basketXOffset);
            const basketY = canvas.height - basketHeight - 20;

            if (centralImageX + centralImageWidth >= basketX &&
                centralImageX <= basketX + basketWidth &&
                centralImageY + centralImageHeight >= basketY &&
                centralImageY <= basketY + basketHeight) {
                
                openedBasketIndex = i;
                rotationAngle = Math.PI / 8;
                break;
            } else {
                openedBasketIndex = null;
                rotationAngle = 0;
            }
        }

        console.log('Nuove coordinate:', centralImageX, centralImageY);
        draw_image();
    } else if (!isDragging && !isAlertVisible && !cestino && !diff && !info) {
        console.log("ENTRATO");
        if (Math.sqrt((mouseX - icon_cerchioX) ** 2 + (mouseY - icon_cerchioY) ** 2) <= icon_raggio) {
            canvas.style.cursor = 'pointer';
            draw_info();
            info_text = true;
        } else if (mouseX >= lampd_x && mouseX <= lampd_x + lampd_Width &&
            mouseY >= lampd_y && mouseY <= lampd_y + lampd_Height && !lampdf) {
            canvas.style.cursor = 'pointer';
            draw_lampd();
            lampd_text = true;
        } else if (mouseX >= topLeftImageX && mouseX <= topLeftImageX + image_left_Width &&
            mouseY >= topLeftImageY && mouseY <= topLeftImageY + image_left_Height) {
            draw_differenziata();
        } else if (mouseX >= topLeftImageX2 && mouseX <= topLeftImageX2 + image_left_Width2 &&
            mouseY >= topLeftImageY2 && mouseY <= topLeftImageY2 + image_left_Height2) {
            draw_Cestino();
        } else if (mouseX >= centralImageX && mouseX <= centralImageX + centralImageWidth &&
            mouseY >= centralImageY && mouseY <= centralImageY + centralImageHeight) {
            canvas.style.cursor = 'grab';
        } else if (!lampdf && lampd_text == true) {
            canvas.style.cursor = 'default';
            draw_image();
            lampd_text = false;
        } else if (info_text == true) {
            canvas.style.cursor = 'default';
            draw_image();
            info_text = false;
        } else {
            canvas.style.cursor = 'default';
        }
    } else if (isAlertVisible && !cestino && !diff && !info) {
        if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
            mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
            console.log("Arrivato");
            isMouseOverButton = true;
            canvas.style.cursor = 'pointer';
        } else {
            console.log("NON Arrivato");
            isMouseOverButton = false;
            canvas.style.cursor = 'default';
        }
    } else if (cestino && !diff && !info) {
        if ((mouseX <= cestino_x || mouseX >= cestino_x + cestino_width ||
            mouseY <= cestino_y || mouseY >= cestino_y + cestino_height) && (
            mouseX < topLeftImageX2 || mouseX > topLeftImageX2 + image_left_Width2 + 30 ||
            mouseY < topLeftImageY2 || mouseY > topLeftImageY2 + image_left_Height2)) {
            
            cestino = false;
            draw_image();
        }
    } else if (diff && !info) {
        if ((mouseX <= diff_x || mouseX >= diff_x + diff_width ||
            mouseY <= diff_y || mouseY >= diff_y + diff_height) && (
            mouseX < topLeftImageX || mouseX > topLeftImageX + image_left_Width ||
            mouseY < topLeftImageY || mouseY > topLeftImageY + image_left_Height)) {
            
            diff = false;
            draw_image();
        }
    } else if (info) { 
        if (mouseX >= ret_x + ret_width - 40 && mouseX <= ret_x + ret_width - 10 &&
            mouseY >= ret_y + 10 && mouseY <= ret_y + 50) {
            canvas.style.cursor = 'pointer';
        }
    }
});


canvas.addEventListener('touchend', (event) => {
    event.preventDefault();

    if (!isAlertVisible && !cestino && !diff) {
        isDragging = false;
        canvas.style.cursor = 'default';
        if (rotationAngle !== 0) {
            const basketIndex = openedBasketIndex;
            console.log("OPEN: " + rotationAngle);
            if (basketIndex !== null) {
                const basketType = basketTexts[basketIndex];
                const touch = event.changedTouches[0];
                const mouseX = touch.clientX - canvas.getBoundingClientRect().left;
                const mouseY = touch.clientY - canvas.getBoundingClientRect().top;

                if (currentImage && basketType === currentImage.type) {
                    lampd = false;
                    score++;
                    changeCentralImage(getRandomImage());
                    state = false;
                    requestAnimationFrame(animateBasket);
                } else if (currentImage) {
                    state = true;
                    requestAnimationFrame(animateBasket);
                    score--;
                }
            }
        }

        const touch = event.changedTouches[0];
        const mouseX = touch.clientX - canvas.getBoundingClientRect().left;
        const mouseY = touch.clientY - canvas.getBoundingClientRect().top;

        if (mouseX >= lampd_x && mouseX <= lampd_x + lampd_Width &&
            mouseY >= lampd_y && mouseY <= lampd_y + lampd_Height) {
            if (!lampdf) {
                lampd = true;
                draw_image();
            }
            console.log(lampd);
        }

        if (Math.sqrt((mouseX - icon_cerchioX) ** 2 + (mouseY - icon_cerchioY) ** 2) <= icon_raggio) {
            console.log("CLICK");
            draw_information();
        }

        rotationAngle = 0;
    }

    if (info) {
        const touch = event.changedTouches[0];
        const mouseX = touch.clientX - canvas.getBoundingClientRect().left;
        const mouseY = touch.clientY - canvas.getBoundingClientRect().top;

        if (mouseX >= ret_x + ret_width - 40 && mouseX <= ret_x + ret_width - 10 &&
            mouseY >= ret_y + 10 && mouseY <= ret_y + 50) {
            info = false;
            draw_image();
        }
    } else if (!cestino && !diff) draw_image();
});


window.addEventListener('resize', () => {
    drawBaskets();
    size_image();
    draw_image();
});


