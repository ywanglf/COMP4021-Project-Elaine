// This function defines the Ghost fire module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the gem
// - `y` - The initial y position of the gem
// - `color` - The colour of the gem
const Fire = function(ctx, x, y, colour) {

    // This is the sprite sequences of the ghost fire of two colours
    // `green` and `white`
    let sheet;

    if(colour == "white"){
        sheet = "static/ghost_fire_sprite/png/purple/loops/burning_loop_1.png"
    }else if(colour == "green"){
        sheet = "static/ghost_fire_sprite/png/blue/loops/burning_loop_1.png"
    }

    const sequence = {x: 0, y: 8, width: 24, height: 24, count: 8, timing: 200, loop: true};

    // This is the sprite object of the gem created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the gem sprite here.
    sprite.setSequence(sequence)
          .setScale(1.5)
          .setShadowScale({ x: 0, y: 0 })
          .useSheet(sheet);


    // This is the birth time of the gem for finding its age.
    let birthTime = performance.now();

    // This function gets the age (in millisecond) of the gem.
    // - `now` - The current timestamp
    const getAge = function(now) {
        return now - birthTime;
    };

    const changeLocation = function(x, y) {
        sprite.setXY(x, y);
    }


    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update,
        getAge: getAge,
        changeLocation: changeLocation
    };
};