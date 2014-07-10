"use strict";

	/**
	 * Public instruction set
	 * @type {Array<{name:String, category:String, [parameters]:Array<{name:String, [type]:String, [default]:String, [tip]:String, minValue:Number, maxValue:Number, stepValue:Number, [validate]:function(String):Boolean, [noBrackets]:Boolean}>, [tip]:String, show:Array<String>, [return]:String, [block]:Array<String>, [nameRewrite]:Array<{String, String}>, [dummy]:Boolean, [code]:Array<[unindent]:Boolean, [prefix]:String, [noName]:Boolean, [space]:Boolean, [noBrackets]:Boolean, [suffix]:String>}>}
	 * @example { name: "forward", category: "cursor", parameters: [{name: "pixels", type: "number", default: 100, tip: "How many pixels do you want to move forward?"}], tip: "Moves forward", show: ["level2","level3","level4"] }
	 */
	$_eseecode.instructions.set = [
		{ name: "null", category: "internal", parameters: [{name: "text", type: "text", noBrackets: true}], show: [], code: { noName: true, noBrackets: true } },
		{ name: "nullChild", category: "internal", parameters: [{name: "text", type: "text", noBrackets: true}], show: [], dummy: true, code: { noName: true, noBrackets: true, unindent: true } },
		{ name: "unknownFunction", category: "internal", parameters: [{name: "parameters...", type: "text"}], show: [], code: { noName: true } },
		{ name: "object", category: "other", parameters: null, return: "object", show: [], block: ["endObject"], nameRewrite: { level3: "", level4: "" }, code: { prefix: "{ " } },
		{ name: "comment", category: "other", parameters: [{name: "comment", type: "text", noBrackets: true}], tip: "Comment text, ignored during execution", show: ["level3","level4"], nameRewrite: { level1: "Comment:", level2: "Comment:", level3: "//", level4: "//" }, code: { space: true, noBrackets: true } },
		{ name: "commentmultiline", category: "other", parameters: [{name: "comment", type: "text", noBrackets: true}], tip: "Comment text, ignored during execution", show: [], block: ["endComment"], nameRewrite: { level1: "Comment:", level2: "Comment:", level3: "/*", level4: "/*" }, code: { space: true, noBrackets: true } },
		{ name: "commentmultilinesingle", category: "other", parameters: [{name: "comment", type: "text", noBrackets: true}], tip: "Comment text, ignored during execution", show: [], nameRewrite: { level1: "Comment:", level2: "Comment:", level3: "/*", level4: "/*" }, code: { space: true, noBrackets: true, suffix: " */" } },
		{ name: "beginShape", category: "cursor", parameters: [], tip: "Begins a shape definition", show: ["level2","level3","level4"] },
		{ name: "endShape", category: "cursor", parameters: [], tip: "Ends a shape definition", show: ["level2","level3","level4"] },
		{ name: "clean", category: "canvas", parameters: [{ name: "id", type: "number" }], tip: "Wipes the canvas", show: ["level3", "level4"] },
		{ name: "flipHorizontally", category: "canvas", parameters: [], tip: "Flips the canvas horizontally", show: ["level2","level3","level4"] },
		{ name: "flipVertically", category: "canvas", parameters: [], tip: "Flips the canvas vertically", show: ["level2","level3","level4"] },
		{ name: "blank", category: "cursor", show: ["level1","level2"] },
		{ name: "forward", category: "cursor", parameters: [{name: "pixels",default: 100, type: "number", tip: "How many pixels do you want to move forward?"}], tip: "Moves forward", show: ["level2","level3","level4"] },
		{ name: "forward", category: "cursor", parameters: [{name: "pixels",default: 100, type: "number", tip: "How many pixels do you want to move forward?"}], tip: "Moves 100 steps forward", show: ["level1"] },
		{ name: "forward", category: "cursor", parameters: [{name: "pixels", default: 50, type: "number"}], tip: "Moves 50 steps forward", show: ["level1"] },
		{ name: "forward", category: "cursor", parameters: [{name: "pixels", default: 25, type: "number"}], tip: "Moves 25 step forward", show: ["level1"] },
		{ name: "arc", category: "cursor", parameters: [{name: "radius", default: 50, type: "number" }, { name: "degrees", default: 15 }, { name: "axis", default: 0 }, { name: "counterclockwise", default: false }], tip: "Draws an arc", show: ["level3","level4"] },
		{ name: "blank", category: "cursor", show: ["level1"] },
		{ name: "turnLeft", category: "cursor", parameters: [{name: "degrees", default: 90, type: "number", minValue: -360, maxValue: 360, tip: "How many degrees do you want to turn?"}], tip: "Turns left", show: ["level2","level3","level4"] },
		{ name: "turnLeft", category: "cursor", parameters: [{name: "degrees", default: 90, type: "number", tip: "How many degrees do you want to turn?"}], tip: "Turns 90 degrees left", show: ["level1"] },
		{ name: "turnLeft", category: "cursor", parameters: [{name: "degrees", default: 45, type: "number"}], tip: "Turns 45 degrees left", show: ["level1"] },
		{ name: "turnLeft", category: "cursor", parameters: [{name: "degrees", default: 15, type: "number"}], tip: "Turns 15 degrees left", show: ["level1"] },
		{ name: "blank", category: "cursor", show: ["level1"] },
		{ name: "turnRight", category: "cursor", parameters: [{name: "degrees", default: 90, type: "number", tip: "How many degrees do you want to turn?", minValue: -360, maxValue: 360}], tip: "Turns right", show: ["level2","level3","level4"] },
		{ name: "turnRight", category: "cursor", parameters: [{name: "degrees", default: 90, type: "number", tip: "How many degrees do you want to turn?"}], tip: "Turns 90 degrees right", show: ["level1"] },
		{ name: "turnRight", category: "cursor", parameters: [{name: "degrees", default: 45, type: "number"}], tip: "Turns 45 degrees right", show: ["level1"] },
		{ name: "turnRight", category: "cursor", parameters: [{name: "degrees", default: 15, type: "number"}], tip: "Turns 15 degrees right", show: ["level1"] },
		{ name: "turnReset", category: "cursor", parameters: [], tip: "Resets the angle to initial rotation", show: ["level3","level4"] },
		{ name: "blank", category: "cursor", show: ["level1","level2"] },
		{ name: "=", category: "value", parameters: [{name: "variable", type: "var", validate: function(variable){ return (variable.match(/^[A-Za-z][A-Za-z_0-9]*$/)); }, noBrackets: true},{name: "value", default: undefined, type: "var", noBrackets: true}], return: "var", tip: "Assigns a value to a variable", show: ["level3","level4"], inorder: true, code: { space: true, noBrackets: true } },
		{ name: "getArccosine", category: "value", parameters: [{name: "degrees", default: 90, type: "number"}], return: "number", tip: "Returns the arccosine", show: ["level3","level4"] },
		{ name: "getArcsine", category: "value", parameters: [{name: "degrees", default: 90, type: "number"}], return: "number", tip: "Returns the arcsine", show: ["level3","level4"] },
		{ name: "getArctangent", category: "value", parameters: [{name: "degrees", default: 90, type: "number"}], return: "number", tip: "Returns the arctangent", show: ["level3","level4"] },
		{ name: "getLayerHeight", category: "value", parameters: [], return: "number", tip: "Returns the canvas height", show: ["level3","level4"] },
		{ name: "getLayerWidth", category: "value", parameters: [], return: "number", tip: "Returns the canvas width", show: ["level3","level4"] },
		{ name: "getLayerName", category: "value", parameters: [], return: "text", tip: "Returns the current canvas' name", show: ["level3","level4"] },
		{ name: "getLayerVisibility", category: "value", parameters: [{name: "canvasId", default: undefined, type: "number"}], return: "bool", tip: "Returns if the layer is visible", show: ["level3","level4"] },
		{ name: "getCosine", category: "value", parameters: [{name: "degrees", default: 90, type: "number"}], return: "number", tip: "Returns the cosine", show: ["level3","level4"] },
		{ name: "getRandomColor", category: "value", parameters: [], return: "color", tip: "Returns a random color", show: ["level3","level4"] },
		{ name: "getRandomNumber", category: "value", parameters: [{name: "number", default: 100, type: "number"}], return: "number", tip: "Returns a random number", show: ["level3","level4"] },
		{ name: "getRGB", category: "value", parameters: [{name: "red", default: 0},{name: "green", default: 0, type: "number"},{name: "blue", default: 0}], return: "number", tip: "Returns a color from and RGB definition", show: ["level3","level4"] },
		{ name: "getSine", category: "value", parameters: [{name: "degrees", default: 90, type: "number"}], return: "number", tip: "Returns the sine", show: ["level3","level4"] },
		{ name: "getTangent", category: "value", parameters: [{name: "degrees", default: 90, type: "number"}], return: "number", tip: "Returns the tangent", show: ["level3","level4"] },
		{ name: "getSquareRoot", category: "value", parameters: [{name: "number", default: 0, type: "number"}], return: "number", tip: "Returns the square root of the number", show: ["level3","level4"] },
		{ name: "getAngle", category: "value", parameters: [{name: "id", type: "number"}], return: "number", tip: "Returns the current angle", show: ["level3","level4"] },
		{ name: "getX", category: "value", parameters: [{name: "id", type: "number"}], return: "number", tip: "Returns the X coordinate", show: ["level3","level4"] },
		{ name: "getY", category: "value", parameters: [{name: "id", type: "number"}], return: "number", tip: "Returns the Y coordinate", show: ["level3","level4"] },
		{ name: "getLayerImage", category: "value", parameters: [{name: "id", type: "number"}], return: "text", tip: "Returns the image in the canvas", show: ["level4"] },
		{ name: "setColor", category: "cursor", parameters: [{name: "color", default: "\"#FF0000\"", type: "color", tip: "Which color do you want to use?"}], tip: "Sets the drawing color", show: ["level2","level3","level4"] },
		{ name: "unsetColor", category: "cursor", parameters: [], tip: "Resets the drawing color", show: ["level1","level2","level3","level4"] },
		{ name: "unsetSize", category: "cursor", parameters: [], tip: "Unsets the drawing size", show: ["level1"] },
		{ name: "blank", category: "cursor", show: ["level1","level2"] },
		{ name: "goToUpLeft", category: "cursor", parameters: [], tip: "Moves to the upper left of the canvas", show: ["level1","level2","level3","level4"] },
		{ name: "goToUpRight", category: "cursor", parameters: [], tip: "Moves to the upper right of the canvas", show: ["level1","level2","level3","level4"] },
		{ name: "goToCenter", category: "cursor", parameters: [], tip: "Moves to the center of the canvas", show: ["level1","level2","level3","level4"] },
		{ name: "goToLowLeft", category: "cursor", parameters: [], tip: "Moves to the lower left of the canvas", show: ["level1","level2","level3","level4"] },
		{ name: "goToLowRight", category: "cursor", parameters: [], tip: "Moves to the lower right of the canvas", show: ["level1","level2","level3","level4"] },
		{ name: "goTo", category: "cursor", parameters: [{name: "posx", default: 0, type: "number", minValue: 0, maxValue: 400, tip: "Set X coordinate to go to"},{name: "posy", default: 0, type: "number", minValue: 0, maxValue: 400, tip: "Set Y coordinate to go to"}], tip: "Moves to the specified coordinates in the canvas", show: ["level2","level3","level4"] },
		{ name: "blank", category: "cursor", show: ["level1","level2"] },
		{ name: "setSize", category: "cursor", parameters: [{name: "size", default: 16, type: "number"}], tip: "Sets the drawing size to very thick", show: ["level1"] },
		{ name: "setSize", category: "cursor", parameters: [{name: "size", default: 9, type: "number"}], tip: "Sets the drawing size to thicker", show: ["level1"]},
		{ name: "setSize", category: "cursor", parameters: [{name: "size", default: 4, type: "number"}], tip: "Sets the drawing size to thick", show: ["level1"]},
		{ name: "blank", category: "cursor", show: ["level1"] },
		{ name: "unsetSize", category: "cursor", parameters: [], tip: "Unsets the drawing size", show: ["level3","level4"] },
		{ name: "hide", category: "canvas", parameters: [{name: "canvasId",default: undefined, type: "number"}], tip: "Hides the canvas", show: ["level3","level4"] },
		{ name: "image", category: "draw", parameters: [{name: "src", default: "\"\"", type: "text", tip: "URL of an image"},{name: "posx", default: 0, type: "number", minValue: 0, maxValue: 400, tip: "X coordinate where the image will be painted"},{name: "posy", default: 0, type: "number", minValue: 0, maxValue: 400, tip: "Y coordinate where the image will be painted"},{name: "width", type: "number", minValue: 0},{name: "height", type: "number", minValue: 0}], tip: "Sticks an external image", show: ["level2","level3","level4"] },
		{ name: "lineAt", category: "draw", parameters: [{name: "originx", default: 0, type: "number", minValue: 0, maxValue: 400, tip: "Where should the line begin? Set the X coordinate"},{name: "originy", default: 0, type: "number", minValue: 0, maxValue: 400, tip: "Where should the line begin? Set the Y coordinate"},{name: "destinationx", default: 100, type: "number", minValue: 0, maxValue: 400, tip: "Where should the line end? Set the X coordinate"},{name: "destinationy", default: 100, type: "number", minValue: 0, maxValue: 400, tip: "Where should the line end? Set the Y coordinate"}], tip: "Draws a line from coordinate position to coordinate position", show: ["level2","level3","level4"] },
		{ name: "move", category: "canvas", parameters: [{name: "right", default: 50, type: "number"},{name: "down", default: 50, type: "number"}], tip: "Moves the canvas (offset canvas parts will be lost)", show: ["level3","level4"] },
		{ name: "moveDown", category: "canvas", parameters: [{name: "pixels", default: 50, type: "number"}], tip: "Moves the canvas down (offset canvas parts will be lost)", show: ["level3","level4"] },
		{ name: "moveLeft", category: "canvas", parameters: [{name: "pixels", default: 50, type: "number"}], tip: "Moves the canvas left (offset canvas parts will be lost)", show: ["level3","level4"] },
		{ name: "moveRight", category: "canvas", parameters: [{name: "pixels", default: 50, type: "number"}], tip: "Moves the canvas right (offset canvas parts will be lost)", show: ["level3","level4"] },
		{ name: "moveUp", category: "canvas", parameters: [{name: "pixels", default: 50, type: "number"}], tip: "Moves the canvas up (offset canvas parts will be lost)", show: ["level3","level4"] },
		{ name: "pull", category: "canvas", parameters: [{name: "levels", default: 1, type: "number"}], tip: "Pulls up a canvas layer", show: ["level3","level4"] },
		{ name: "push", category: "canvas", parameters: [{name: "levels", default: 1, type: "number"}], tip: "Pushes down a canvas layer", show: ["level3","level4"] },
		{ name: "rotateLeft", category: "canvas", parameters: [{name: "degrees", default: 90, type: "number"},{name: "axis", type: "number"}], tip: "Rotates the canvas left (offset canvas parts will be lost)", show: ["level3","level4"] },
		{ name: "rotateRight", category: "canvas", parameters: [{name: "degrees", default: 90, type: "number"},{name: "axis", type: "number"}], tip: "Rotates the canvas right (offset canvas parts will be lost)", show: ["level3","level4"] },
		{ name: "scale", category: "canvas", parameters: [{name: "horizontal", default: 0.5, type: "number"},{name: "vertical", default: 0.5, type: "number"},{name: "axis", type: "number"}], tip: "Scales the canvas (offset canvas parts will be lost)", show: ["level3","level4"] },
		{ name: "setSize", category: "cursor", parameters: [{name: "size", default: 16, type: "number", tip: "Which size in pixels do you want to set?"}], tip: "Sets the drawing size", show: ["level2","level3","level4"] },
		{ name: "blank", category: "cursor", show: ["level2"] },
		{ name: "setInvisible", category: "cursor", parameters: [{name: "index", type: "number", default: 0.5, setValue: 0.1, minValue: 0, maxValue: 1, tip: "From 0 (invisible] to 1 (opaque), how invisible do you want to draw?"}], tip: "Sets the drawing transparency value", show: ["level2","level3","level4"] },
		{ name: "unsetInvisible", category: "cursor", parameters: [], top: "Sets the drawing transparency to opaque", show: ["level2","level3","level4"] },
		{ name: "blank", category: "cursor", show: ["level1","level2"] },
		{ name: "setColor", category: "cursor", parameters: [{name: "color", default: "\"#FF0000\"", type: "color"}], tip: "Sets the drawing color to red", show: ["level1"] },
		{ name: "setColor", category: "cursor", parameters: [{name: "color", default: "\"#00FF00\"", type: "color"}], tip: "Sets the drawing color to green", show: ["level1"] },
		{ name: "setColor", category: "cursor", parameters: [{name: "color", default: "\"#0000FF\"", type: "color"}], tip: "Sets the drawing color to blue", show: ["level1"] },
		{ name: "setColor", category: "cursor", parameters: [{name: "color", default: "\"#FFFF00\"", type: "color"}], tip: "Sets the drawing color to yellow", show: ["level1"] },
		{ name: "setColor", category: "cursor", parameters: [{name: "color", default: "\"#00FFFF\"", type: "color"}], tip: "Sets the drawing color to light blue", show: ["level1"] },
		{ name: "setColor", category: "cursor", parameters: [{name: "color", default: "\"#FFFFFF\"", type: "color"}], tip: "Sets the drawing color to white", show: ["level1"] },
		{ name: "setColor", category: "cursor", parameters: [{name: "color", default: "\"#000000\"", type: "color"}], tip: "Sets the drawing color to black", show: ["level1"] },
		{ name: "setColor", category: "cursor", parameters: [{name: "color", default: "\"#555555\"", type: "color"}], tip: "Sets the drawing color to grey", show: ["level1"] },
		{ name: "setColor", category: "cursor", parameters: [{name: "color", default: "\"#AAAAAA\"", type: "color"}], tip: "Sets the drawing color to light grey", show: ["level1"] },
		{ name: "blank", category: "cursor", show: ["level1"] },
		{ name: "setBold", category: "cursor", parameters: [{name: "bool", default: true, type: "bool"}], tip: "Sets the bold property for future text", show: ["level2","level3","level4"] },
		{ name: "unsetBold", category: "cursor", parameters: [], tip: "Unsets the bold property for future text", show: ["level2","level3","level4"] },
		{ name: "line", category: "cursor", parameters: [{name: "destinationx", default: 0, type: "number", tip: "Set X coordinate to go to"},{name: "destinationy", default: 0, tip: "Set Y coordinate to go to"}], tip: "Draws a line from current position to specified coordinates", show: ["level2","level3","level4"] },
		{ name: "blank", category: "cursor", show: ["level2"] },
		{ name: "setFont", category: "cursor", parameters: [{name: "font", default: "\"Comic Sans MS\"", type: "text"}], tip: "Sets the font for future text", show: ["level2","level3","level4"] },
		{ name: "unsetFont", category: "cursor", parameters: [], tip: "Resets the font for future text", show: ["level2","level3","level4"] },
		{ name: "write", category: "cursor", parameters: [{name: "text", default: "\"Hello!\"", type: "text", tip: "Which text do you want to write?"}], tip: "Draws text", show: ["level2","level3","level4"] },
		{ name: "blank", category: "cursor", show: ["level2"] },
		{ name: "setItalic", category: "cursor", parameters: [{name: "bool", default: true, type: "bool"}], tip: "Sets the italic property for future text", show: ["level2","level3","level4"] },
		{ name: "unsetItalic", category: "cursor", parameters: [], tip: "Resets the italic property for future text", show: ["level2","level3","level4"] },
		{ name: "show", category: "canvas", parameters: [{name: "canvasId",default: undefined, type: "number"}], tip: "Shows the canvas", show: ["level3","level4"] },
		{ name: "blank", category: "cursor", show: ["level1"] },
		{ name: "use", category: "canvas", parameters: [{name: "id", default: 1, type: "number"}], return: "text", tip: "Switches the active canvas, returns the name of the new current canvas", show: ["level3","level4"] },
		{ name: "animate", category: "canvas", parameters: [{name: "action", default: "", type: "text"},{name: "seconds", default: 1, type: "number"},{name: "maxTimes", default: 1, type: "number"}], tip: "Runs the action every seconds seconds up to maxTimes", show: ["level3","level4"] },
		{ name: "unanimate", category: "canvas", parameters: [{name: "handlerId", default: 0, type: "number"}], tip: "Stops an animation", show: ["level3","level4"] },
		{ name: "if", category: "flow", parameters: [{name: "condition", default: true, type: "bool", tip: "When should the code be triggered?"}], tip: "Conditional execution", show: ["level2","level3","level4"], block: ["end"], code: { space: true, suffix: " {" } },
		{ name: "ifelse", category: "flow", parameters: [{name: "condition", default: true, type: "bool"}], tip: "Conditional execution", show: ["level3"], block: ["else","end"], nameRewrite: { level1: "if", level2: "if", level3: "if", level4: "if" }, code: { space: true, suffix: " {" } },
		{ name: "switch", category: "flow", parameters: [{name: "identifier", default: true, type: "bool"}], tip: "Value based execution", show: [], block: ["end"], code: { space: true, suffix: " {" } },
		{ name: "case", category: "flow", parameters: [{name: "value", default: false, type: "bool"}], show: [], block: [], dummy: true, code: { space: true, noBrackets: true, suffix: " :" } },
		{ name: "default", category: "flow", parameters: null, show: [], dummy: true, code: { suffix: " :" } },
		{ name: "try", category: "flow", parameters: null, show: [], block: ["end"], code: { suffix: " {" } },
		{ name: "with", category: "flow", parameters: [{name: "object", default: [], type: "object"}], show: [], block: ["end"], code: { space: true, suffix: " {" } },
		{ name: "do", category: "flow", parameters: null, show: [], block: ["endDo"], code: { suffix: " {" } },
		{ name: "endDo", category: "flow", parameters: [{name: "condition", default: false, type: "bool"}], show: [], nameRewrite: { level1: "while", level2: "while", level3: "while", level4: "while" }, block: ["end"], dummy: true, code: { prefix: "} ", unindent: true } },
		{ name: "while", category: "flow", parameters: [{name: "condition", default: true, type: "bool", tip: "The code will be triggered as long as the following condition remains true"}], tip: "Conditional loop", show: ["level2","level3","level4"], block: ["end"], code: { space: true, suffix: " {" } },
		{ name: "repeat", category: "flow", parameters: [{name: "number", default: 1, type: "number", minValue: 0, tip: "The code will be run the amount of times defined"}], tip: "Repeating loop", show: ["level2","level3","level4"], block: ["end"], code: { space: true, suffix: " {" } },
		{ name: "for", category: "flow", parameters: [{name: "initialization;condition;update", default: ";false;", type: "text"}], show: [], block: ["end"], code: { space: true, suffix: " {" } },
		{ name: "forIn", category: "flow", parameters: [{name: "iteration", default: "x in []", type: "text"}], show: [], block: ["end"], nameRewrite: { level1: "for", level2: "for", level3: "for", level4: "for" }, code: { space: true, suffix: " {" } },
		{ name: "elseIf", category: "flow", parameters: [{name: "condition", default: false, type: "bool"}], tip: "Alternative branch to conditional execution", show: ["level4"], dummy: true, nameRewrite: { level1: "else if", level2: "else if", level3: "else if", level4: "else if" }, code: { prefix: "} ", space: true, suffix: " {", unindent: true } },
		{ name: "catch", category: "flow", parameters: [{name: "identifier", default: "e", type: "text"}], show: [], dummy: true, code: { space: true, prefix: "} ", suffix: " {", unindent: true } },
		{ name: "finally", category: "flow", parameters: null, show: [], dummy: true, code: { space: true, prefix: "} ", suffix: " {", unindent: true } },
		{ name: "else", category: "flow", parameters: null, tip: "Alternative branch to conditional execution", show: ["level4"], dummy: true, code: { space: true, prefix: "} ", suffix: " {", unindent: true } },
		{ name: "end", category: "internal", parameters: null, tip: "End flow break", show: [], dummy: true, nameRewrite: { level1: "", level2: "", level3: "}", level4: "}" }, code: { unindent: true } },
		{ name: "endObject", category: "internal", parameters: null, tip: "End object definition", show: [], dummy: true, nameRewrite: { level1: "", level2: "", level3: "}", level4: "}" }, code: { unindent: true } },
		{ name: "endComment", category: "internal", parameters: null, tip: "End flow break", show: [], dummy: true, nameRewrite: { level1: "", level2: "", level3: "*/", level4: "*/" }, code: { unindent: true } },
		{ name: "wait", category: "flow", parameters: [{name: "milliseconds", default: 1000, type: "number"}], tip: "Stops execution for the specified time (in milliseconds)", show: [] },
		{ name: "stop", category: "flow", parameters: [], tip: "Stop the execution", show: ["level2","level3","level4"] },
		{ name: "label", category: "flow", parameters: [{name: "identifier", type: "text", validate: function(variable){ return (variable.match(/^[A-Za-z][A-Za-z_0-9]*$/)); }, noBrackets: true}], tip: "Label a spot in the code", show: [], code: { noName: true, suffix: ":" } },
		{ name: "return", category: "flow", parameters: [{name: "value", type: "text"}], tip: "Return to calling function", show: ["level3","level4"], code: { space: true, noBrackets: true } },
		{ name: "call", category: "flow", parameters: [{name: "identifier", type: "text", validate: function(variable){ return (variable.match(/^[A-Za-z][A-Za-z_0-9]*$/)); }, noBrackets: true},{name: "parameters...", type: "text"}], tip: "Call a custom function", show: ["level3"], nameRewrite: { level1: "", level2: "Comment:", level3: "", level4: "" } },
		{ name: "break", category: "flow", parameters: [{name: "value", type: "text"}], tip: "End loop execution", show: [], code: { space: true, noBrackets: true } },
		{ name: "continue", category: "flow", parameters: [{name: "value", type: "text"}], tip: "Skip to next loop iteration", show: [], code: { space: true, noBrackets: true } },
		{ name: "var", category: "objects", parameters: [{name: "identifier", type: "text", validate: function(variable){ return (variable.match(/^[A-Za-z][A-Za-z_0-9]*$/)); }, noBrackets: true}], tip: "Declare a new variable", show: ["level3","level4"], code: { space: true, noBrackets: true } },
		{ name: "array", category: "objects", parameters: [{name: "identifier", type: "text", validate: function(variable){ return (variable.match(/^[A-Za-z][A-Za-z_0-9]*$/)); }, noBrackets: true}], tip: "Declare a new array", show: ["level3","level4"], code: { space: true, noBrackets: true } },
		{ name: "function", category: "objects", parameters: [{name: "identifier", type: "text", validate: function(variable){ return (variable.match(/^[A-Za-z][A-Za-z_0-9]*$/)); }, noBrackets: true},{name: "parameters...", type: "text"}], tip: "Declares a new function", show: ["level3","level4"], block: ["end"], code: { space: true, suffix: " {" } },
		{ name: "windowButtonCreate", category: "window", parameters: [{name: "window",default: 1, type: "number"},{name: "id",default: 1, type: "number"},{name: "text",default: "\"Click me!\"", type: "text"},{name: "posx",default: 0, type: "number"},{name: "posy",default: 0, type: "number"},{name: "action", type: "text"}], tip: "Creates a button in a window", show: ["level3","level4"] },
		{ name: "windowButtonEdit", category: "window", parameters: [{name: "id",default: 1, type: "number"},{name: "text",default: "Click me!", type: "text"},{name: "posx",default: 0, type: "number"},{name: "posy",default: 0, type: "number"},{name: "action", type: "text"}], tip: "Modifies a button in a window", show: ["level3","level4"] },
		{ name: "windowButtonHide", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Hides a button in a window", show: ["level3","level4"] },
		{ name: "windowButtonRemove", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Deletes a button in a window", show: ["level3","level4"] },
		{ name: "windowButtonShow", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Shows a button in a window", show: ["level3","level4"] },
		{ name: "windowHide", category: "window", parameters: [], tip: "Hides a window", show: ["level3","level4"] },
		{ name: "windowImageCreate", category: "window", parameters: [{name: "window",default: 1, type: "number"},{name: "id",default: 1, type: "number"},{name: "canvasId",default: 1, type: "number"},{name: "posx",default: 0, type: "number"},{name: "posy",default: 0, type: "number"},{name: "width",default: 50, type: "number"},{name: "height",default: 50, type: "number"},{name:"onclick", type: "text"},{name:"onmouseover", type: "text"},{name:"onmouseout", type: "text"}], tip: "Creates an image in a window", show: ["level3","level4"] },
		{ name: "windowImageEdit", category: "window", parameters: [{name: "id",default: 1, type: "number"},{name: "canvasId",default: 1, type: "number"},{name: "posx",default: 0, type: "number"},{name: "posy",default: 0, type: "number"},{name: "width",default: 50, type: "number"},{name: "height",default: 50, type: "number"},{name:"onclick", type: "text"},{name:"onmouseover", type: "text"},{name:"onmouseout", type: "text"}], tip: "Modifies a button in a window", show: ["level3","level4"] },
		{ name: "windowImageHide", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Hides an image in a window", show: ["level3","level4"] },
		{ name: "windowImageRemove", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Deletes an image in a window", show: ["level3","level4"] },
		{ name: "windowImageShow", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Shows an image in a window", show: ["level3","level4"] },
		{ name: "windowInputCreate", category: "window", parameters: [{name: "window",default: 1, type: "number"},{name: "id",default: 1, type: "number"},{name: "posx",default: 0, type: "number"},{name: "posy",default: 0, type: "number"},{name: "width",default:50, type: "number"},{name: "height",default: 12, type: "number"},{name:"type", type: "text"}], tip: "Creates an input box in a window", show: ["level3","level4"] },
		{ name: "windowInputEdit", category: "window", parameters: [{name: "id",default: 1, type: "number"},{name: "posx",default: 0, type: "number"},{name: "posy",default: 0, type: "number"},{name: "width",default: 50, type: "number"},{name: "height",default: 12, type: "number"},{name:"type", type: "text"}], tip: "Modifies an input box in a window", show: ["level3","level4"] },
		{ name: "windowInputGet", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Gets the value in an input box in a window", show: ["level3","level4"] },
		{ name: "windowInputHide", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Hides an input box in a window", show: ["level3","level4"] },
		{ name: "windowInputRemove", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Deletes an input box in a window", show: ["level3","level4"] },
		{ name: "windowInputSet", category: "window", parameters: [{name: "id",default: 1, type: "number"},{name: "text",default: "0", type: "text"}], tip: "Sets the value in the input box", show: ["level3","level4"] },
		{ name: "windowInputShow", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Shows an input box in a window", show: ["level3","level4"] },
		{ name: "windowRemove", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Deletes a window", show: ["level3","level4"] },
		{ name: "windowShow", category: "window", parameters: [], tip: "Shows a window", show: ["level3","level4"] },
		{ name: "windowTextCreate", category: "window", parameters: [{name: "window",default: 1, type: "number"},{name: "id",default: 1, type: "number"},{name: "text",default: "\"Hello!\"", type: "text"},{name: "posx",default: 0, type: "number"},{name: "posy",default: 0, type: "number"},{name: "width", type: "number"},{name: "bold", type: "bool"},{name:"italic", type: "bool"},{name:"size", type: "number"},{name:"color", type: "color"},{name:"family", type: "text"}], tip: "Creates text in a window", show: ["level3","level4"] },
		{ name: "windowTextEdit", category: "window", parameters: [{name: "id",default: 1, type: "number"},{name: "text",default: "\"Hello!\"", type: "text"},{name: "posx", type: "number"},{name: "posy", type: "number"},{name: "width", type: "number"},{name: "bold", type: "bool"},{name:"italic", type: "bool"},{name:"size", type: "number"},{name:"color", type: "color"},{name:"family", type: "text"}], tip: "Modifies text in a window", show: ["level3","level4"] },
		{ name: "windowTextGet", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Gets the value in a text box in a window", show: ["level3","level4"] },
		{ name: "windowTextHide", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Hides text in a window", show: ["level3","level4"] },
		{ name: "windowTextRemove", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Deletes text in a window", show: ["level3","level4"] },
		{ name: "windowTextShow", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Shows text in a window", show: ["level3","level4"] },
		{ name: "windowUse", category: "window", parameters: [{name: "id",default: 1, type: "number"}], tip: "Switches the active window", show: ["level3","level4"] },
		{ name: "writeAt", category: "draw", parameters: [{name: "text",default: "\"Hello!\"", type: "text", tip: "Which text would you like to show?"},{name: "posx",default: 0, type: "number", minValue: 0, maxValue: 400, tip: "Where do you want to show it? X coordinate"},{name: "posy",default: 0, type: "number", minValue: 0, maxValue: 400, tip: "Where do you want to show it? Y coordinate"},{name: "angle",default: 0, type: "number", minValue: -360, maxValue: 360, tip: "In which angle to write the text?"}], tip: "Draws text at specified coodinates", show: ["level2","level3","level4"] }
	];
