const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

ctx.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5



const background = new Sprite({
    position: {
    x: 0,
    y: 0
   
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
    x: 600,
    y: 128
   
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter ({
    position:{
    x: 0,
    y: 0
},
velocity: {
    x: 0,
    y: 0
},
offset: {
    x: 0,
    y: 0
},
imageSrc: './img/Idle.png',
framesMax: 8,
scale: 2.5,
offset: {
    x: 215,
    y: 152
},
sprites: {
    idle: {
        imageSrc: './img/Idle.png',
        framesMax: 8
    },
    run: {
        imageSrc: './img/Run.png',
        framesMax: 8
    },
    jump: {
        imageSrc: './img/Jump.png',
        framesMax: 2
    },
    fall: {
        imageSrc: './img/Fall.png',
        framesMax: 2
    },
    attack1: {
        imageSrc: './img/Attack1.png',
        framesMax: 6
    },
    takeHit: {
        imageSrc: './img/Take Hit - white silhouette (1).png',
        framesMax: 4
    },
    death: {
        imageSrc: './img/Deathplayer.png',
        framesMax: 6
    }
},
attackBox: {
    offset: {
        x: 100,
        y: 50
    },
    width: 156,
    height: 50
}
})


const enemy = new Fighter ({
    position:{
    x: 400,
    y: 100
},
velocity: {
    x: 0,
    y: 0
},
color: 'blue',
offset: {
    x: -50,
    y: 0
},
imageSrc: './img/Idle1.png',
framesMax: 4,
scale: 2.5,
offset: {
    x: 215,
    y: 168
},
sprites: {
    idle: {
        imageSrc: './img/Idle1.png',
        framesMax: 4
    },
    run: {
        imageSrc: './img/Run1.png',
        framesMax: 8
    },
    jump: {
        imageSrc: './img/Jump1.png',
        framesMax: 2
    },
    fall: {
        imageSrc: './img/Fall1.png',
        framesMax: 2
    },
    attack1: {
        imageSrc: './img/Attack11.png',
        framesMax: 4
    },
    takeHit: {
        imageSrc: './img/Takehitenemy.png',
        framesMax: 3
    },
    death: {
        imageSrc: './img/Deathenemy.png',
        framesMax: 7
    }
},
attackBox: {
    offset: {
        x: -171,
        y: 50
    },
    width: 150,
    height: 50
}
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
     w: {
        pressed: false
    },
     ArrowLeft: {
        pressed: false
    },
     ArrowRight: {
        pressed: false
    }

}


decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    console.log('go')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
   background.update()
   shop.update()
   ctx.fillStyle = 'rgba(255, 255, 255, 0.14)'
   ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
   enemy.update()

   player.velocity.x = 0
   enemy.velocity.x = 0

    // player movement
    
    if (keys.a.pressed && player.lastKey === 'a'
    && player.position.x > 10){
        player.velocity.x = -5
    player.switchSprite('run')

    
    } else if (keys.d.pressed && player.lastKey === 'd'
    && player.position.x < 200){
        player.velocity.x = 5
        player.switchSprite('run')  

        
    }


    if (keys.a.pressed ) {
        background.position.x += 5
        shop.position.x += 5
        player.switchSprite('run')

    } 

    else if (keys.d.pressed) {
        background.position.x -= 5
        shop.position.x -= 5
        player.switchSprite('run')

    }
    else  {
        player.switchSprite('idle') 
    }
    
   
    //jumping
    if (player.velocity.y < 0 && !player.lastKey === 'w') {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0 ) {
        player.switchSprite('fall')

    }


     // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')    
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }
    // detect for collision, 
    //frames attack depends on image always check image
    // enemy gets hit
    if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: enemy
        })
        && player.isAttacking && player.framesCurrent === 4  

        ) {
            enemy.takeHit()
            player.isAttacking = false
            
            gsap.to('#enemyHealth',{
             width: enemy.health + '%'
            })
        }
         // if player misses
         if (player.isAttacking && player.framesCurrent === 4) {
            player.isAttacking = false
         }

         // this is where player gets hit

        if (
            rectangularCollision({
              rectangle1: enemy,
              rectangle2: player
            })
            && enemy.isAttacking && enemy.framesCurrent === 2
            ) {
                player.takeHit()
                enemy.isAttacking = false
                gsap.to('#playerHealth',{
                    width: player.health + '%'
                   })
            }

                  // if player misses
         if (enemy.isAttacking && enemy.framesCurrent === 2) {
            enemy.isAttacking = false
         }

            // end game based on health
            if (enemy.health <= 0 || player.health <= 0) {
               determineWinner({ player, enemy, timerId })
            }

       
}


animate()

window.addEventListener('keydown', (event) => {
if (!player.dead){


    switch (event.key){
        case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break

        case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
        
        case 'w':
       player.stop()
        
        break
        case ' ':
            player.attack()
        break
        
     
    
    }
}
 if (!enemy.dead) {
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            
            break
    
            case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
            
            case 'ArrowUp':
            enemy.velocity.y = -20
            break
    
            case 'ArrowDown':
            enemy.attack()
            break
    }
}

})
window.addEventListener('keyup', (event) => {
    switch (event.key){
        case 'd': 
        keys.d.pressed = false
        break
        case 'a': 
        keys.a.pressed = false
        break
        case 'w': 
        keys.w.pressed = false
        break
    }

    //enemy keys
      switch (event.key){
        case 'ArrowRight': 
        keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft': 
        keys.ArrowLeft.pressed = false
        break
        case 'ArrowUp': 
        keys.ArrowUp.pressed = false
        break
    }
})
