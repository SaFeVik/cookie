let handsEl = document.querySelector("#hands")
let titleEl = document.querySelector("#title")
let cpsItemsEl = document.querySelector("#cpsItems")
let cookieEl = document.querySelector("#cookie")
let cookieCounterEl = document.querySelector("#cookieCounter")
let cpsCounterEl = document.querySelector("#cpsCounter")
let upgradeItemEl = document.querySelector(".upgradeItem")
let priceUEl = document.querySelector(".priceU")
let levelNrUEl = document.querySelector(".levelNrU")
let shopTitleEl = document.querySelector("#shopTitle")
let shopEl = document.querySelector("#shop")
let mainEl = document.querySelector("main")
let bodyEl = document.querySelector("body")
console.log(mainEl)

shopTitleEl.onclick = function(){
    shopEl.classList.toggle('show')
    mainEl.classList.toggle('show')
    bodyEl.classList.toggle('show')
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

titleEl.onclick = function(){
    localStorage.removeItem('hender')
    localStorage.removeItem('cps')
    localStorage.removeItem('lvlArr')
    localStorage.removeItem('priceArr')
    localStorage.removeItem('cookieCounter')
    localStorage.removeItem('priceU')
    localStorage.removeItem('lvlU')
    localStorage.removeItem('tap')
}
cookieEl.onclick = addCookie

// Localstorage henting
let hender = []
if(localStorage.hender){
    hender = JSON.parse(localStorage.hender)
}
let cps = 0
if(localStorage.cps){
    cps = JSON.parse(localStorage.cps)
}
let priceU = 5000
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

cpsCounterEl.innerHTML = `Cps: ${cps.toFixed(1)}`
let cookieCounter = 0
if(localStorage.cookieCounter){
    cookieCounter = JSON.parse(localStorage.cookieCounter)
}
cookieCounterEl.innerHTML = `${Math.floor(cookieCounter)} Cookies!`

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

// Hender rundt cookien
function newHand(){
    if(antallHender < 81){
        let handEls = document.querySelectorAll('.hand')
        for(let i = 0; i < handEls.length; i++){
            handEls[i].classList.remove('trykkes')
        }
        antallHender += 1
        console.log(antallHender)
        let imgEl = document.createElement('img')
        imgEl.src = "./bilder/arm.png"
        imgEl.classList.add('hand')
        if(antallHender <= 36){
            imgEl.classList.add('hand1')
            imgEl.style.transform = `rotate(${antallHender*10}deg)`
        }else if(antallHender > 36){
            imgEl.classList.add('hand2')
            imgEl.style.transform = `rotate(${antallHender*8}deg)`
        }

        handsEl.innerHTML += imgEl.outerHTML
        hender.push(imgEl.outerHTML)
        localStorage.hender = JSON.stringify(hender)
    }
}

setInterval(trykk, 300)
let trykkes = 0
async function trykk(){
    if(hender.length > 0){
        let handEls = document.querySelectorAll('.hand')
        if(handEls[trykkes]){
            handEls[trykkes].classList.add('trykkes')
            await sleep(150)
            handEls[trykkes].classList.remove('trykkes')
        }
        trykkes = (trykkes + 1) % hender.length
    }
}

// Lager shop items

fetch("cpsItems.json")
    .then(res => res.json())
    .then(cpsItems => {
        makeItems(cpsItems)
    })

function makeItems(cpsItems){
    for(let i=0; i<cpsItems.length; i++){
        priceLvlMaker()
        priceArr.push(cpsItems[i].price)
        lvlArr.push(0)
        let item = cpsItems[i]
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
        console.log(lvlArr[i])
    }

    // Endrer cps, lvl og pris på itemet du kjøper
    for(let i=0; i<cpsItems.length; i++){
        let item = cpsItems[i]
        let itemEl = document.querySelectorAll('.cpsItem')[i]
        let lvlNrEl = document.querySelectorAll('.levelNr')[i]
        let priceEl = document.querySelectorAll('.price')[i]
        itemEl.onclick = function(){
            if(cookieCounter >= priceArr[i]){
                console.log(priceArr[i])
                cookieCounter -= priceArr[i]
                cps += item.cps
                lvlArr[i] += 1
                priceArr[i] = Math.round(priceArr[i] * 1.15)
                lvlNrEl.innerHTML = lvlArr[i]
                priceEl.innerHTML = priceArr[i]
                cpsCounterEl.innerHTML = `Cps: ${cps.toFixed(1)}`
                
                localStorage.priceArr = JSON.stringify(priceArr)
                localStorage.lvlArr = JSON.stringify(lvlArr)
                localStorage.cps = JSON.stringify(cps)
                if(itemEl == document.querySelectorAll('.cpsItem')[0]){
                    newHand()
                }
            }
        }
    }
        
}

function addCookie(){
    cookieCounter += tap
    cookieCounterEl.innerHTML = `${Math.floor(cookieCounter)} Cookies!`
    localStorage.cookieCounter = JSON.stringify(cookieCounter)
}

setInterval(addCps, 100)
function addCps(){
    cookieCounter += cps/10
    cookieCounterEl.innerHTML = `${Math.floor(cookieCounter)} Cookies!`
    localStorage.cookieCounter = JSON.stringify(cookieCounter)
}

upgradeItemEl.onclick = function(){
    if(cookieCounter >= priceU){
        console.log("kjøpt")
        cookieCounter -= priceU
        tap *= 2
        lvlU += 1
        priceU = Math.round(priceU * 2.5)
        levelNrUEl.innerHTML = lvlU
        priceUEl.innerHTML = priceU
        localStorage.lvlU = JSON.stringify(lvlU)
        localStorage.priceU = JSON.stringify(priceU)
        localStorage.tap = JSON.stringify(tap)
    }
}