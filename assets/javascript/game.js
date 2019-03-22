$(document).ready(function() {
var playerSelected = false;
var usedChars = [];

// audio for events
var fightMusic = new Audio('assets/sounds/fightmusic.mp3')
var blaster = new Audio('assets/sounds/blaster.mp3')
var yoda = new Audio('assets/sounds/yodanotry.mp3')
var cantina = new Audio('assets/sounds/cantina.mp3')

// Character template object
var chars = [
    {
        name: "Han Solo", id:"han", hp: 5, attack: 3, counterAttack: 2
    },
    {
        name: "JarJar Binks", id:"jarJar", hp: 2, attack: 1, counterAttack: 1
    },
    {
        name: "Boba Fett", id:"boba", hp: 5, attack: 3, counterAttack: 2
    },
    {
        name: "Princess Leia", id:"leia", hp: 5, attack: 3, counterAttack: 2
    },
];

$('#title').fadeOut(1750)

// function to generate character select panel
function makeCharSelect() {
    $('#charSelect').html('')
    $('#charSelect').css({'display': 'flex'})
    $.each(chars, function(i){
        // checks if character has been used (chosen or slain)
        // if (!usedChars.includes(i)) {
            var template =
            "<div class='charCard'" +
            "id='" + chars[i].id + "'>" +
            "<h3>Health: " + chars[i].hp + "</h3>" +
            "<h2>" + chars[i].name + "</h2>" +
            "</div>";
            $('#charSelect').append(template)
            // Adds attributes from char object to cards
            $('#' + chars[i].id).attr({index: i, hp: chars[i].hp, attack: chars[i].attack, counterAttack: chars[i].counterAttack})
        // }
    })
}
makeCharSelect()

// Checks if player has chosen a card, all subsequent cards are enemies
$('body').on('click', '#charSelect > .charCard', function () {
    switch (playerSelected) {
        case false:
            fightMusic.currentTime = 0
            fightMusic.play()
            usedChars.push(parseInt($(this).attr('index')))
            $(this).addClass('player')
            $(this).remove();
            $('#attacker').html('')
            $('#attacker').append(this);
            $('#defender').append('<h1>SELECT AN ENEMY</h1>');
            playerSelected = true
            break
        case true:
            $(this).addClass('enemy')
            $(this).remove();
            $('#defender').html('')
            $('#defender').append(this);
            $('#charSelect').css({'display': 'none'})
            $('#vs').css({'display': 'inline'})
            break
        
    }
})

$('body').on('click', '#attackButton', function (){
  // Player can attack if hp > 0
  blaster.currentTime = 0
  blaster.play()
    if (parseInt($('.player').attr('hp')) > 0) {
            var attack = parseInt($('.enemy').attr('hp')) - parseInt($('.player').attr('attack'))
            $('.enemy').attr('hp', attack)
            // Updates health display on card
            $('.enemy > h3').text('Health: ' + $('.enemy').attr('hp'))
            // Checks if enemy is still alive for counterAttack
            if (parseInt($('.enemy').attr('hp')) > 0) {
                var counterAttack = parseInt($('.player').attr('hp')) - parseInt($('.enemy').attr('counterAttack'))
                $('.player').attr('hp', counterAttack)
                // Updates health display on card
                $('.player > h3').text('Health: ' + $('.player').attr('hp'))
                // If player hp falls to 0 or below after counterAttack, game over
                if (parseInt($('.player').attr('hp')) <= 0) {
                    yoda.currentTime = 0
                    fightMusic.pause()
                    yoda.play()
                    blaster.pause()
                    $('.resetButton').css({'display': 'block'})
                    $('#title').fadeIn()
                    $('#title').append('<button class="resetButton">DO! - OR DO NOT, THERE IS NO TRY! (CLICK TO DO AGAIN)</button>')
                    $('#attackButton').css({'display': 'none'})
                } 
            } 
                // Enemy is defeated
                else {
                usedChars.push(parseInt($('.enemy').attr('index')))
                $('#defender').append('<h1>SELECT AN ENEMY</h1>');
                $('.enemy').remove();
                $('#charSelect').css({'display': 'flex'})
                $('#vs').css({'display': 'none'})
            }
        }   

    // If all chars have been used displays victory message and restart button
    if (usedChars.length === chars.length) {
        fightMusic.pause()
        cantina.currentTime = 0
        cantina.play()
        $('#defender').html('')
        $('.resetButton').css({'display': 'block'})
        $('#title').fadeIn()
        $('#title').append('<button class="resetButton">YOU WIN! PLAY AGAIN?</button>')
        $('#title').css({'grid-area': 'charSelect'})
    }
})

// reset button
$('body').on('click', '.resetButton', function () {
    cantina.pause()
    $('#title').fadeOut(400)
    $('#title > button').remove()
    $('#vs').css({'display': 'none'})
    $('#attackButton').css({'display': 'block'})
    $('#attacker').html('')
    $('#attacker').html('<h1>SELECT A CHARACTER</h1>')
    $('#defender').html('')
    usedChars = [];
    playerSelected = false;
    makeCharSelect()
})
})