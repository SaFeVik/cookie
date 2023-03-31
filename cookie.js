// Henter alle stasjonære objekter fra DOM
let handsEl = document.querySelector("#hands")
let titleEl = document.querySelector("#title")
let cpsItemsEl = document.querySelector("#cpsItems")
let cookieEl = document.querySelector("#cookie")
let cookieCounterEl = document.querySelector("#cookieCounter")
let cookieDivEl = document.querySelector("#cookieDiv")
let cpsCounterEl = document.querySelector("#cpsCounter")
let upgradeItemEl = document.querySelector(".upgradeItem")
let priceUEl = document.querySelector(".priceU")
let levelNrUEl = document.querySelector(".levelNrU")
let shopTitleEl = document.querySelector("#shopTitle")
let shopEl = document.querySelector("#shop")
let mainEl = document.querySelector("main")
let klikkAu = document.querySelector("#klikk")

// Legger til klassen "show" hos #shop og main når man trykker på #shopTitle
shopTitleEl.onclick = function(){
    shopEl.classList.toggle('show')
    mainEl.classList.toggle('show')
}

// Gjør await sleep(ms) funksjonelt
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Resetter localstorage når man trykker på tittelen
/* titleEl.onclick = function(){
    localStorage.removeItem('hender')
    localStorage.removeItem('cps')
    localStorage.removeItem('lvlArr')
    localStorage.removeItem('priceArr')
    localStorage.removeItem('cookieCounter')
    localStorage.removeItem('priceU')
    localStorage.removeItem('lvlU')
    localStorage.removeItem('tap')
} */


// Localstorage henting
let hender = []
if(localStorage.hender){
    hender = JSON.parse(localStorage.hender)
}
let cps = 0
if(localStorage.cps){
    cps = JSON.parse(localStorage.cps)
}
let priceU = 1000
if(localStorage.priceU){
    priceU = JSON.parse(localStorage.priceU)
}
priceUEl.innerHTML = `${priceU}`
let lvlU = 0
if(localStorage.lvlU){
    lvlU = JSON.parse(localStorage.lvlU)
}
levelNrUEl.innerHTML = `${lvlU}`
let tap = 1
if(localStorage.tap){
    tap = JSON.parse(localStorage.tap)
}
let cookieCounter = 0
if(localStorage.cookieCounter){
    cookieCounter = JSON.parse(localStorage.cookieCounter)
}

let priceArr = []
let lvlArr = []
function priceLvlMaker(){
    if(localStorage.lvlArr){
        lvlArr = JSON.parse(localStorage.lvlArr)
    }

    if(localStorage.priceArr){
        priceArr = JSON.parse(localStorage.priceArr)
    }
}

let antallHender = hender.length
for(let i = 0; i < hender.length; i++){
    handsEl.innerHTML += hender[i]
}

// Oppdaterer cps- og cookieCounter
cpsCounterEl.innerHTML = `Cps: ${cps.toFixed(1)}`
cookieCounterEl.innerHTML = `${Math.floor(cookieCounter)} Cookies!`

// Hender rundt cookien
function newHand(){
    // Passer på at det ikke blir mer enn 81 hender
    if(antallHender < 81){
        // Lager en ny hånd
        let handEls = document.querySelectorAll('.hand')
        // Tar bort trykkes klassen fra alle hender slik at de ikke setter seg fast i trykket posisjon
        for(let i = 0; i < handEls.length; i++){
            handEls[i].classList.remove('trykkes')
        }
        // Øker antall hender med 1
        antallHender++
        // Lager en ny hånd med klassen "hand"
        let imgEl = document.createElement('img')
        imgEl.src = "./bilder/arm.png"
        imgEl.classList.add('hand')
        // Roterer og legger til klasser avhengig av om de er i første eller andre skall
        if(antallHender <= 36){
            imgEl.classList.add('hand1')
            imgEl.style.transform = `rotate(${antallHender*10}deg)`
        }else if(antallHender > 36){
            imgEl.classList.add('hand2')
            imgEl.style.transform = `rotate(${antallHender*8}deg)`
        }

        // Legger til hånden i handsEl, legger til hånden i hender-arrayen og lagrer de i localstorage
        handsEl.innerHTML += imgEl.outerHTML
        hender.push(imgEl.outerHTML)
        localStorage.hender = JSON.stringify(hender)
    }
}

// Aktiverer trykke animasjon hver 300ms
setInterval(trykk, 300)
// Deklarerer variabelen trykkes
let trykkes = 0
async function trykk(){
    // Sjekker om det er hender rundt cookien
    if(hender.length > 0){
        // Henter alle hender og legger til trykkes klassen på den som skal trykkes
        let handEls = document.querySelectorAll('.hand')
        if(handEls[trykkes]){
            handEls[trykkes].classList.add('trykkes')
            await sleep(150)
            handEls[trykkes].classList.remove('trykkes')
        }
        // Teller fra 0 til antall hender og starter på nytt
        trykkes = (trykkes + 1) % hender.length
    }
}

// Lager shop items

// Henter objekter fra json-fil
fetch("cpsItems.json")
    .then(res => res.json())
    .then(cpsItems => {
        // Kaller på makeItems-funksjonen med cpsItems som parameter
        makeItems(cpsItems)
    })

function makeItems(cpsItems){
    // Itererer gjennom cpsItems-arrayen og legger til html-elementer med informasjon fra objektene
    for(let i=0; i<cpsItems.length; i++){
        // Lager default arrays med pris og level
        priceArr.push(cpsItems[i].price)
        lvlArr.push(0)
        // Henter pris og level fra localstorage hvis det finnes
        priceLvlMaker()
        // item blir det aktelle kjøpeobjektet
        let item = cpsItems[i]
        // Legger til kjøpeobjekter med informasjon fra json-filen og pris og level fra arrays
        cpsItemsEl.innerHTML += `
        <div class="cpsItem">
            <img src="./bilder/${item.image}">
            <div class="titlePrice">
                <h3 class="itemTitle">${item.title}</h3>
                <div class="priceDiv">
                    <img src="./bilder/cookie.png">
                    <h4 class="price">${priceArr[i]}</h4>
                </div>
            </div>
            <div class="levelCps">
                <div class="leftTxt">
                    <h4 class="levelTxt">Level:</h4>
                    <h4 class="cpsTxt">Cps:</h4>
                </div>
                <div class="rightNr">
                    <h4 class="levelNr">${lvlArr[i]}</h4>
                    <h4 class="cpsNr">+${item.cps}</h4>
                </div>
            </div>
        </div>
        `
    }

    // Endrer cps, lvl og pris på itemet du kjøper
    for(let i=0; i<cpsItems.length; i++){
        let item = cpsItems[i]
        // Oppdaterer hentingen av aktuelle html-elementer
        let itemEl = document.querySelectorAll('.cpsItem')[i]
        let lvlNrEl = document.querySelectorAll('.levelNr')[i]
        let priceEl = document.querySelectorAll('.price')[i]
        // Når du trykker på kjøpeobjekt kjøres denne funksjonen
        itemEl.onclick = function(){
            // Sjekker om du har nok cookies
            if(cookieCounter >= priceArr[i]){
                // Trekker fra prisen på cookiecounteren
                cookieCounter -= priceArr[i]
                // Legger til cps som man har kjøpt
                cps += item.cps
                // Øker level og pris
                lvlArr[i] += 1
                priceArr[i] = Math.round(priceArr[i] * 1.15)
                // Oppdaterer html-elementene
                lvlNrEl.innerHTML = lvlArr[i]
                priceEl.innerHTML = priceArr[i]
                cpsCounterEl.innerHTML = `Cps: ${cps.toFixed(1)}`
                
                // Lagrer pris- og levelarrays og cps i localStorage
                localStorage.priceArr = JSON.stringify(priceArr)
                localStorage.lvlArr = JSON.stringify(lvlArr)
                localStorage.cps = JSON.stringify(cps)
                // Hvis det er det første kjøpeobjektet kjøres newHand()
                if(itemEl == document.querySelectorAll('.cpsItem')[0]){
                    newHand()
                }
            }
        }
    }
        
}
// addCookie kjører når man trykker på cookien
cookieEl.onclick = addCookie
async function addCookie(e){
    // Aktiverer tapInfo med hendelsesobjektet
    tapInfo(e)
    // Skalerer cookien ned
    cookieEl.style.scale = "0.97"
    // Legger til så mange cookies som hvert trykk skal gi
    cookieCounter += tap
    // Oppdaterer cookies telleren
    cookieCounterEl.innerHTML = `${Math.floor(cookieCounter)} Cookies!`
    // Lagrer cookies telleren i localStorage
    localStorage.cookieCounter = JSON.stringify(cookieCounter)
    // Venter 50ms før cookien skal skales opp igjen
    await sleep(50)
    cookieEl.style.scale = "1"
}

// Deklarerer variablen som holder styr på manuell clicks per second
let clickCPS = 0

// Skjer når man klikker på cookien
async function tapInfo(e){
    // Legger til i manuell clicks per second
    clickCPS++
    // Oppdaterer cps telleren med alle typer cookies per second
    cpsCounterEl.innerHTML = `Cps: ${(cps+clickCPS*tap).toFixed(1)}`
    // Lager p elementet som sier hvor mye cookies du får per klikk
    let tapInfoEl = document.createElement('p')
    let audioEl = document.createElement('audio')
    // Legger til klassen "tapInfo" hos tapInfoEl
    tapInfoEl.classList.add('tapInfo')
    audioEl.src = "mouseclick.mp3"
    audioEl.play()
    // Legger til teksten som sier hvor mye cookies du får per klikk
    tapInfoEl.innerHTML = `+${tap}`
    // Setter posisjonen til tapInfoEl ved musens posisjon
    tapInfoEl.style.left = `${e.offsetX-10}px`
    tapInfoEl.style.top = `${e.offsetY-25}px`
    // Legger til tapInfoEl i cookieDivEl
    cookieDivEl.appendChild(tapInfoEl)
    cookieDivEl.appendChild(audioEl)
    // Venter 1 sekund før tapInfoEl skal fjernes for å unngå at det blir for mange og holder styr på manuell clicks per second
    await sleep(1000)
    // Fjerner 1 fra manuell clicks per second
    clickCPS--
    // Oppdaterer cps telleren med alle typer cookies per second
    cpsCounterEl.innerHTML = `Cps: ${(cps+clickCPS*tap).toFixed(1)}`
    // Fjerner tapInfoEl fra cookieDivEl
    cookieDivEl.removeChild(tapInfoEl)
    cookieDivEl.removeChild(audioEl)
}

// Aktiverer addCps hvert 100ms
setInterval(addCps, 100)
function addCps(){
    // Legger til så mange cookies som cps skal gi delt på 10 slik at den gir riktig mengde per sekund
    cookieCounter += cps/10
    // Oppdaterer cookies telleren
    cookieCounterEl.innerHTML = `${Math.floor(cookieCounter)} Cookies!`
    // Lagrer cookies telleren i localStorage
    localStorage.cookieCounter = JSON.stringify(cookieCounter)
}

upgradeItemEl.onclick = function(){
    // Hvis du har nok cookies kjøper du upgrade
    if(cookieCounter >= priceU){
        // Fjerner prisen fra cookies telleren
        cookieCounter -= priceU
        // Dobler tap slik at hvert klikk gir dobbelt så mye cookies
        tap *= 2
        // Øker level på upgrade
        lvlU += 1
        // Dobler prisen på upgrade
        priceU = Math.round(priceU * 2)
        // Oppdaterer level og price på upgrade
        levelNrUEl.innerHTML = lvlU
        priceUEl.innerHTML = priceU
        // Lagrer tap, level og price på upgrade i localStorage
        localStorage.lvlU = JSON.stringify(lvlU)
        localStorage.priceU = JSON.stringify(priceU)
        localStorage.tap = JSON.stringify(tap)
    }
}