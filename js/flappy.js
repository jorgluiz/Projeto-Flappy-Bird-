// *** Paradigma OO *** 

//função criar um novo elemento
function novoElemento(tagName, className){ //método fn construtor
    const elem = document.createElement(tagName) //elem = tag 
    elem.className = className //tag = 'div'
   //or .classLinst
//    console.log(elem)
    return elem
}

function barreira(reversa = false){ //método fn construtor (instância)
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda') //div class="borda"
    const corpo = novoElemento('div', 'corpo') //div class="corpo"
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)
    
    //altura da barreira
    this.setAltura = altura => corpo.style.height = `${altura}px`
}

      //testando instancia de barreira(reversa = false) ***

// const b = new barreira(true)
// b.setAltura(300)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)



function parDeBarreiras(altura, abertura, x){ //método fn construtor (instância)
 //atributo /elemento/ que representa DOM (objeto parDeBarreiras)
       this.elemento = novoElemento('div', 'par-de-barreiras') //div class="par-de-barreiras"
                    //instanciando barreira
    this.superior = new barreira(true)
    this.inferior = new barreira(false)
    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)
    
    //sortear localização das barreiras
    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)

    }
    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura() 
    this.setX(x)
}



     //testando instancia parDeBarreiras(altura, abertura, x)
                            
// const b = new parDeBarreiras(         700,      200,   400)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)


//função por controlar multiplas 'barreiras' (reaproveitando)
function Barreiras(altura, largura, abertura, espaco, notificarPonto){ //método fn construtor (instância)
    this.pares = [
        new parDeBarreiras(altura, abertura, largura),
        new parDeBarreiras(altura, abertura, largura + espaco),
        new parDeBarreiras(altura, abertura, largura + espaco * 2),
        new parDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3
    this.animar = () => [
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            //quando o elemento sair da área do jogo
            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio
               && par.getX() < meio
               if(cruzouOMeio) notificarPonto()
        })
    ]
}




function Passaro(alturaJogo){  //método fn construtor (instância)
    let voando = false  //flag
 //atributo /elemento/ que representa DOM (objeto Passaro)
        this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false
    
    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if (novoY <= 0){
            this.setY(0)
        }else if(novoY >= alturaMaxima){
            this.setY(alturaMaxima)
        }else {
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo / 2)
}



function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

// const barreiras = new Barreiras(700, 1200, 200, 400)
// const passaro = new Passaro(700)
// const areaDoJogo = document.querySelector('[wm-flappy]')
// areaDoJogo.appendChild(passaro.elemento)
// areaDoJogo.appendChild(new Progresso().elemento)
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
// setInterval(() => {
//     barreiras.animar()
//     passaro.animar()
// }, 20)

function estaoSobrePosto(elementoA, elementoB){
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const hozontal = a.left + a.width >= b.left
      && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
      && b.top + b.height >= a.top
      return hozontal && vertical
}

function colidiu(passaro, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(parDeBarreiras => {
        if(!colidiu){
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            colidiu = estaoSobrePosto(passaro.elemento, superior) || estaoSobrePosto(passaro.elemento, inferior)
        }
    })
    return colidiu
}

function FlappyBird(){
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]')
    console.log(areaDoJogo)
    const altura = areaDoJogo.clientHeight //obtendo altura do elemento  ( <div wm-flappy )
    const largura = areaDoJogo.clientWidth //obtendo largura do elemento ( <div wm-flappy )

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 200, 400,
         () => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () =>{
        //loop do jogo]
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()

            if(colidiu(passaro, barreiras)){
                clearInterval(temporizador)
            }
        }, 20)
    }
}

new FlappyBird().start()