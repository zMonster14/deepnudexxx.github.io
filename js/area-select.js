window.onload = function() {

    new Vue({
        el: '#area-select',
        template: `
        <div>
            <div class="file-upload-form">
                Upload an image file:
                <input type="file" @change="previewImage" accept="image/*">
            </div>
            <div class="image-preview">
                <!-- img class="preview" v-if="imageData.length > 0" :src="imageData" -->
                <canvas id="canvas" width="400" height="400"></canvas>
            </div>
        </div>
    `,
        data: {
            imageData: ""  // we will store base64 format of image in this string
        },
        methods: {
            previewImage: function(event) {
                // Reference to the DOM input element
                var input = event.target;
                // Ensure that you have a file before attempting to read it
                if (input.files && input.files[0]) {
                    // create a new FileReader to read this image and convert to base64 format
                    var reader = new FileReader();
                    // Define a callback function to run, when FileReader finishes its job
                    reader.onload = (e) => {
                        // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                        // Read image as base64 and set to imageData
                        //this.imageData = e.target.result;

                        var img = new Image();
                        img.onload = function() {
                            var bmp = new createjs.Bitmap(img);
                            stage.addChild(bmp);

                            var scale, x = 0, y = 0;
                            if(bmp.image.height > bmp.image.width) {
                                scale = stage.canvas.height / bmp.image.height;
                                x = (stage.canvas.width - bmp.image.width * scale) /2;
                            } else {
                                scale = stage.canvas.width / bmp.image.width;
                                y = (stage.canvas.height - bmp.image.height * scale) /2;
                            }

                            bmp.x = x;
                            bmp.y = y;
                            bmp.scaleX = scale;
                            bmp.scaleY = scale;
                            stage.update();
                        }
                        img.src = e.target.result;
                    }
                    // Start the reader job - read file as a data url (base64 format)
                    reader.readAsDataURL(input.files[0]);
                }
            }
        }
    });

    var stage = new createjs.Stage("canvas");
    createjs.Ticker.on("tick", tick);

    var selection = new createjs.Shape(),
        g = selection.graphics.setStrokeStyle(1).beginStroke("#000").beginFill("rgba(0,0,0,0.2)"),
        sd = g.setStrokeDash([10,5], 0).command,
        r = g.drawRect(0,0,100,100).command,
        moveListener;


    stage.on("stagemousedown", dragStart);
    stage.on("stagemouseup", dragEnd);

    function dragStart(event) {
        stage.addChild(selection).set({x:event.stageX, y:event.stageY});
        r.w = 0; r.h = 0;
        moveListener = stage.on("stagemousemove", drag);
    }

    function drag(event) {
        r.w = event.stageX - selection.x;
        r.h = event.stageY - selection.y;
    }

    function dragEnd(event) {
        stage.off("stagemousemove", moveListener);
    }

    function tick(event) {
        stage.update(event);
        sd.offset--;
    }

}


