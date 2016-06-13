"use strict";

	/**
	 * Gets the execution step value from the setup and updates in the $_eseecode class
	 * @private
	 * @example $e_updateExecutionStep()
	 */
	function $e_updateExecutionStep() {
		$_eseecode.execution.step = parseInt(document.getElementById("dialog-debug-execute-step").value);
	}

	/**
	 * Gets the execution stepped value from the setup and updates in the $_eseecode class
	 * @private
	 * @example $e_updateExecutionStepped()
	 */
	function $e_updateExecutionStepped() {
		$_eseecode.execution.stepped = document.getElementById("dialog-debug-execute-stepped").checked;
	}

	/**
	 * Gets the execution time limit value from the setup and updates in the $_eseecode class
	 * @private
	 * @example $e_updateExecutionTime()
	 */
	function $e_updateExecutionTime() {
		$_eseecode.execution.timeLimit = parseInt(document.getElementById("setup-execute-time").value);
	}

	/**
	 * Function to trace breakpoints during execution, injected in the runtime code
	 * @private
	 * @param {Number} lineNumber Code line number currently running
	 * @param {Object} variables This parameter is ignored but is necessary to be able to run an inline function uppon call to obtain the watchpoint variable values
	 * @param {Boolean} [inline] Set to true if it is being called inline (as part of the parameters of a call or inside a condition)
	 * @throws executionWatchpointed | executionBreakpointed | executionTimeout | executionStepped
	 * @example $e_eseeCodeInjection(123)
	 */
	function $e_eseeCodeInjection(lineNumber, variables, inline) {
		$e_checkExecutionLimits(lineNumber, inline);
		// The only case in which we need to return something is for return, since it could be with no parameters leave undefined
		return undefined;
	}

	/**
	 * Check the execution control limits
	 * @private
	 * @param {Number} lineNumber Code line number currently running
	 * @param {Boolean} [inline=false] Set to true if it is being called inline (as part of the parameters of a call or inside a condition)
	 * @throws executionWatchpointed | executionBreakpointed | executionTimeout | executionStepped
	 * @example $e_checkExecutionLimits(31)
	 */
	function $e_checkExecutionLimits(lineNumber, inline) {
		if ($_eseecode.execution.precode.running) { // We do checkLimits with postcoding because if this code calls a user-defined function we must count statistics and check limits
			// Precode/Postcode is run as is with no checks and without altering $_eseecode.execution variables
			return;
		}
		var executionTime = new Date().getTime();
		$_eseecode.execution.programCounter++;
		$e_setHighlight(lineNumber);
		if ($_eseecode.execution.watchpointsChanged.length > 0) {
			var watchpointTriggered = false;
			for (var i=0; i < $_eseecode.execution.watchpointsChanged.length && !watchpointTriggered; i++) {
				var watch = $_eseecode.execution.watchpointsChanged[i];
				if ($_eseecode.session.watchpoints[watch].status) {
					watchpointTriggered = true;
				}
			}
			if (watchpointTriggered) {
				$_eseecode.execution.breakpointCounter++;
				if ($_eseecode.execution.breakpointCounter >= $_eseecode.execution.breakpointCounterLimit) {
					$_eseecode.execution.breakpointCounterLimit++;
					if (inline !== true) {
						// Variable changes are detected before running the next instruction, except in inline checks
						$e_setHighlight(lineNumber-1);
					}
					throw "executionWatchpointed";
				}
			}
		}
		if ($_eseecode.session.breakpoints[lineNumber]) {
			$_eseecode.session.breakpoints[lineNumber].count++;
			if ($_eseecode.session.breakpoints[lineNumber].status) {
				$_eseecode.execution.breakpointCounter++;
				if ($_eseecode.execution.breakpointCounter >= $_eseecode.execution.breakpointCounterLimit) {
					$_eseecode.execution.breakpointCounterLimit++;
					throw "executionBreakpointed";
				}
			}
		}
		if ($_eseecode.execution.endLimit !== undefined && executionTime > $_eseecode.execution.endLimit) {
			throw "executionTimeout";
		}
		if ($_eseecode.execution.stepped && $_eseecode.execution.programCounter >= $_eseecode.execution.programCounterLimit) {
			if ($_eseecode.execution.programCounter == 1) {
				$_eseecode.execution.programCounterLimit++;
				// We ignore the first line, it doesn't make sense to stop here when nothing has been done yet
				return
			}
			throw "executionStepped";
		}
	}

	/**
	 * Resets and sets up internal configuration for a new code execution
	 * @private
	 * @param {Boolean|String} [disableStepping] true = ignore the stepping
	 * @example $e_initProgramCounter()
	 */
	function $e_initProgramCounter(disableStepping) {
		if ($_eseecode.execution.precode.running) { // We do check limits with postcode because if it runs user-defined functions we must count statistics and check limits
			// Precode/Postcode is run as is with no checks and without altering $_eseecode.execution variables
			return;
		}
		var withStep = $_eseecode.execution.stepped;
		if (disableStepping === "disabled") {
			withStep = false;
		}
		$_eseecode.execution.startTime = new Date().getTime();
		var time = $_eseecode.execution.timeLimit;
		if (time <= 0) {
			time = 3;
			$_eseecode.execution.timeLimit = time;
			$e_initSetup();
		}
		$_eseecode.execution.endLimit = $_eseecode.execution.startTime+time*1000;
		if (withStep) {
			if (!disableStepping) {
				var step = $_eseecode.execution.step;
				if (step < 1) {
					step = 1;
					$_eseecode.execution.step = step;
					$e_initSetup();
				}
				$_eseecode.execution.programCounterLimit = $_eseecode.execution.programCounter + step;
			}
		}
		$_eseecode.execution.programCounter = 0;
		$_eseecode.execution.breakpointCounter = 0;
		for (var key in $_eseecode.session.breakpoints) {
			$_eseecode.session.breakpoints[key].count = 0;
		}
		$e_executionTraceReset("randomColor");
		$e_executionTraceReset("randomNumber");
	}

	/**
	 * Displays execution error
	 * @private
	 * @param {!Object} [err] Caught exception
	 * @example $e_printExecutionError(err)
	 */
	function $e_printExecutionError(err) {
		var lineNumber;
		if (err.lineNumber) { // Firefox
			lineNumber = err.lineNumber;
			lineNumber++; // Firefox starts lines at 0
		} else if (err.stack) { // Chrome
			var lines = err.stack.split("\n");
			var i;
			for (i=0;i<lines.length;i++) {
				if (lines[i].indexOf("at <anonymous>:") >= 0) {
					lineNumber = lines[i].split(":")[1];
				}
			}
		}
		var message, action;
		if (lineNumber) {
			var mode = $_eseecode.modes.console[$_eseecode.modes.console[0]].div;
			$e_highlight(lineNumber,"error");
			if (mode == "write") {
				ace.edit("console-write").gotoLine(lineNumber,0);
			}
			message = _("Error '%s' in line %s",[err.name,lineNumber])+": "+err.message;
		} else if (err.stack) {
			message = err.name+": "+err.message+"\n"+err.stack;
		} else {
			message = _("Runtime error!");
		}
		$e_msgBox(message);
	}

	/**
	 * Setup execution sandboxing
	 * It deletes or resets variables created in the last execution
	 * @private
	 * @example $e_resetSandbox()
	 */
	function $e_resetSandbox() {
		if (!$_eseecode.execution.sandboxProperties) {
			$_eseecode.execution.sandboxProperties = [];
		}
		for (var i=0; i<$_eseecode.execution.sandboxProperties.length; i++) {
			 window[$_eseecode.execution.sandboxProperties[i]] = undefined;
		}
	}
	
	/**
	 * Reset the instruction limits counters
	 * @private
	 * @example $e_resetInstructionLimits()
	 */
	function $e_resetInstructionLimits() {
		if ($_eseecode.instructions.instructionsLimited) {
			for (var key in $_eseecode.instructions.instructionsLimited) {
				var instructionLimits = $_eseecode.instructions.instructionsLimited[key];
				for (var limitsCount=0; limitsCount < instructionLimits.length; limitsCount++) {
					instructionLimits[limitsCount].countInstances = 0;
				}
			}
		}
	}

	/**
	 * Checks and takes note of which variables where created during the last execution
	 * The list of changes is pushed into $_eseecode.execution.sandboxProperties
	 * @private
	 * @param {Array<String>} oldKeys List of variables existing before the last execution
	 * @param {Array<String>} newKeys List of variables existing after the last execution
	 * @example $e_updateSandboxChanges(oldKeys, newKeys)
	 */
	function $e_updateSandboxChanges(oldKeys, newKeys) {
		for (var i=0; i<newKeys.length; i++) {
			var keyNameNew = newKeys[i];
			var found = false;
			for (var j=0; j<oldKeys.length; j++) {
				var keyNameOld = oldKeys[j];
				if (keyNameOld == keyNameNew) {
					found = true;
					break;
				}
			}
			if (!found) {
				$_eseecode.execution.sandboxProperties.push(keyNameNew);
			}
			found = false;
		}
	}
	
	/**
	 * Stops previous execution animations
	 * @private
	 * @example $e_stopPreviousAnimations()
	 */
	function $e_stopPreviousAnimations() {	
		// Stop previous execution remaining animations
		for (var i=0; i<$_eseecode.execution.timeoutHandlers.length; i++) {
			clearTimeout($_eseecode.execution.timeoutHandlers[i]);
		}
		$_eseecode.execution.timeoutHandlers.length = 0;
	}
	
	/**
	 * Checks if animations are running
	 * @since 3.0
	 * @private
	 * @return {Boolean} Whether or not an animation is running
	 * @example $e_checkAnimationsRunning()
	 */
	function $e_checkAnimationsRunning() {
		return $_eseecode.execution.timeoutHandlers.length > 0;
	}
	
	/*
	 * Runs an animation code, returns an animation handler
	 * Prepares the execution context for the animation and runs the animation
	 * @since 3.0
	 * @private
	 * @param {Function} command Code to run on every 
	 * @param {Number} seconds Seconds between each code run
	 * @param {Number} maxTimes Maximum amount of times to run the animation
	 * @param {Number} timeoutHandlersIndex Animation handler to use
	 * @param {Number} [countTimes=1] Number of iterations the animation has gone through
	 * @return {Number} Animation handler or false if the animation stopped
	 * @throws Code execution exception
	 * @example $e_executeAnimation("stepForward()", 0.25)
	 */
	function $e_executeAnimation(command, seconds, maxTimes, timeoutHandlersIndex, countTimes) {
		if (timeoutHandlersIndex === undefined) {
			timeoutHandlersIndex = $_eseecode.execution.timeoutHandlers.length;
		}
		if (countTimes === undefined) {
			countTimes = 0;
		}
		if ($_eseecode.execution.timeoutHandlers[timeoutHandlersIndex]) {
			clearTimeout($_eseecode.execution.timeoutHandlers[timeoutHandlersIndex]);
		}
		if (maxTimes > countTimes || maxTimes === undefined) {
			if (typeof command === "string") {
				var userCode = command;
				command = function() {
					// If we run user code directly we need to add limit checks sicne this is not going through the jison parser, so lets force checking this limits
					$_eseecode.execution.forceCheckLimits = true;
					eval(userCode);
					$_eseecode.execution.forceCheckLimits = false;
				}
			}
			try {
				command(); // The first iteration of the animation is run immediately as part of the main thread
				// If no exception was thrown, create next setTimeout
				$_eseecode.execution.timeoutHandlers[timeoutHandlersIndex] = setTimeout(function() {
						// Control of the time limit with animations works as follows:
						// JavaScript engines (at least Chrome, Safari, Firefox and IE, Opera might not) will first run the main thread of the user code,
						// then queue the setTimeout calls and run them as a whole one after the other, so we don't have to worry about simultaneous codes
						// So each animation iteration call resets the time endLimit to its own interest to limit its execution time
						$_eseecode.execution.endLimit = (new Date().getTime())+$_eseecode.execution.timeLimit*1000; // We reset the time deadline to allow this animation iteration to run, but startTime is not modified
						$e_executeAnimation(command, seconds, maxTimes, timeoutHandlersIndex, countTimes+1);
					}, seconds*1000);
			} catch(err) {
				$e_showExecutionResults(err); // Subsequent iterations are run as part of a setTimeout so we must catch the exceptions and handle them
			}
		}
		return timeoutHandlersIndex;
	}
	/**
	 * Runs code
	 * @private
	 * @param {Boolean} [forceNoStep] Whether or not to force to ignore the stepping
	 * @param {String} [inCode] Code to run. If unset run the code in the console window
	 * @param {Boolean} [justPrecode] Whether or not to ignore the usercode and just run the precode
	 * @example $e_execute()
	 */
	function $e_execute(forceNoStep, inCode, justPrecode) {
		if (!inCode) {
			$e_resetSandbox();
		}
		var code;
		var withStep;
		if (forceNoStep || inCode) { // Code from events run without stepping
			code = inCode;
			withStep = "disabled";
		}
		$e_unhighlight();
		if (code === undefined) {
			var mode = $_eseecode.modes.console[$_eseecode.modes.console[0]].div;
			if (mode == "blocks") {
				var consoleDiv = document.getElementById("console-blocks");
				code = $e_blocks2code(consoleDiv.firstChild);
			} else if (mode == "write") {
				code = ace.edit("console-write").getValue();
				// Check and clean code before parsing
				if (eseecodeLanguage) {
					try {
						var program = eseecodeLanguage.parse(code);
						var level;
						for (var i=0;i<$_eseecode.modes.console.length;i++) {
							if ($_eseecode.modes.console[i].div == "write") {
								level = $_eseecode.modes.console[i].id;
							}
						}
						code = program.makeWrite(level,"","\t");
					} catch (exception) {
						$e_msgBox(_("Can't parse the code. There is the following problem in your code")+":\n\n"+exception.name + ":  " + exception.message);
						var lineNumber = exception.message.match(/. (i|o)n line ([0-9]+)/);
						if (lineNumber && lineNumber[2]) {
							lineNumber = lineNumber[2];
							$e_highlight(lineNumber,"error");
							ace.edit("console-write").gotoLine(lineNumber,0,true);
						}
						return;
					}
					$e_resetWriteConsole(code, false);
				}
			}
			$e_resetCanvas(true);
			$e_resetIO();
			$e_resetBreakpointWatches();
			$e_resetWatchpoints();
			$e_resetInstructionLimits();
		}
		try {
			var jsCode = "";
			if (!inCode && $_eseecode.execution.precode.code) { // Don't load precode again when running the code of an event
				// We want to run precode inline so it shares the same context, so we don't use $e_executePrecode()
				jsCode += "$_eseecode.execution.precode.running=true;"+$e_code2run($_eseecode.execution.precode.code)+";$_eseecode.execution.precode.running=false;\n";
			}
			if (!justPrecode) {
				jsCode += "$e_initProgramCounter("+(withStep==="disabled"?'true':'false')+");"+$e_code2run(code);
				if (!inCode && $_eseecode.execution.postcode.code) { // Don't load postcode again when running the code of an event
					jsCode += ";$_eseecode.execution.postcode.running=true;"+$e_code2run($_eseecode.execution.postcode.code)+";$_eseecode.execution.postcode.running=false;\n";
				}
			}
		} catch (exception) {
			$e_msgBox(_("Can't parse the code. There is the following problem in your code")+":\n\n"+exception.name + ":  " + exception.message);
			return;
		}
		if (inCode === undefined || inCode === null) {
			$_eseecode.session.lastRun = new Date().getTime();
		}
		var script = document.createElement("script");
		script.id = "executionCode";
		script.type = "text/javascript";
		script.innerHTML = jsCode;
		var oldWindowProperties;
		if (Object.getOwnPropertyNames) {
			oldWindowProperties = Object.getOwnPropertyNames(window);
		}
		document.getElementById("eseecode").appendChild(script);
		var newWindowProperties;
		if (Object.getOwnPropertyNames) {
			newWindowProperties = Object.getOwnPropertyNames(window);
			$e_updateSandboxChanges(oldWindowProperties,newWindowProperties);
		}
		document.getElementById("eseecode").removeChild(script);
		// if debug is open refresh it
		if ($_eseecode.modes.dialog[$_eseecode.modes.dialog[0]].id == "debug") {
			$e_resetDebugLayers();
		}
		$_eseecode.execution.isReset = false;
		$e_toggleConsoleButtons();
	}

	/**
	 * Converts user code to executable code and returns it
	 * @private
	 * @param {String} pseudoCode User code to convert
	 * @return {String} Executable code
	 * @example eval($e_code2run("repeat(4){forward(100)}"))
	 */
	function $e_code2run(pseudoCode) {
		var program = eseecodeLanguage.parse(pseudoCode);
		var level;
		for (var i=0;i<$_eseecode.modes.console.length;i++) {
			if ($_eseecode.modes.console[i].div == "write") {
				level = $_eseecode.modes.console[i].id;
			}
		}
		var userCode = program.makeWrite(level,"","\t",true);
		var code = "\"use strict\";";
		var globalVars = $_eseecode.instructions.variables;
		for (var i=0; i<globalVars.length; i++) {
			code += "var "+globalVars[i].name+"="+globalVars[i].value+";";
		}
		code += "try {"+userCode+";\n\
				$e_showExecutionResults();\n\
			} catch(err) {\n\
				$e_showExecutionResults(err);\n\
			}";
		return code;
	}

	/**
	 * Show execution results
	 * @private
	 * @param {String|Object} [err] Caught exception
	 * @example $e_showExecutionResults()
	 */
	function $e_showExecutionResults(err) {
		if (err === undefined) {
			$e_unhighlight();
		} else if (err === "executionTimeout") {
			$e_highlight($_eseecode.session.highlight.lineNumber,"error");
			$e_msgBox(_("The execution is being aborted because it is taking too long.\nIf you want to allow it to run longer increase the value in 'Stop execution after' in the setup tab"));
		} else if (err === "executionStepped") {
			$e_highlight($_eseecode.session.highlight.lineNumber);
		} else if (err === "executionBreakpointed") {
			$e_highlight($_eseecode.session.highlight.lineNumber);
			$e_switchDialogMode("debug");
		} else if (err == "executionWatchpointed") {
			$e_highlight($_eseecode.session.highlight.lineNumber); // We detect it before running the next instruction, so highlight the previous instruction
			$e_switchDialogMode("debug");
			$e_highlightWatchpoint($_eseecode.execution.watchpointsChanged);
		} else if (err.type == "codeError") {
			var instructionId = err.name;
			var brackets = "";
			if (instructionId >=0) {
				var instruction = $_eseecode.instructions.set[instructionId];
				if (!instruction.code || instruction.code.noBrackets !== true) {
					brackets = "()";
				}
			}
			$e_msgBox(_("Error found during execution at line %s in %s",[err.line, err.name+brackets])+"\n"+err.text)+":";
			$e_highlight(err.line,"error");
		} else {
			// The code didn't finish running and there is no known reason
			$e_printExecutionError(err);
		}
		if (err !== undefined) {
			var executionTime = ((new Date().getTime())-$_eseecode.execution.startTime)/1000;
			document.getElementById("dialog-debug-execute-stats").innerHTML = _("Instructions executed so far")+": "+($_eseecode.execution.programCounter-1)+"<br />"+_("Execution time so far")+": "+executionTime+" "+_("secs");
			$e_stopPreviousAnimations(); // Stop pending animations
		}
	}

	/**
	 * Defines an error to handle during user code execution
	 * @private
	 * @param {String} name Name of the instruction
	 * @param {String} text Text to show the user
	 * @return Returns an exception codeError object
	 * @example new $e_codeError("foward", "Invalid parameter");
	 */
	function $e_codeError(name, text) {
		this.type = "codeError";
		this.name = name;
		this.line = $_eseecode.session.highlight.lineNumber;
		this.text = text;
	}

	/**
	 * Prepares execution environment for the next run
	 * @private
	 * @example $e_endExecution();
	 */
	function $e_endExecution() {
		if ($_eseecode.execution.startTime !== undefined) { // When running precode startTime is not set so use this to detect if it is just precode we're running and in this case act as if nothing happened
			var executionTime = ((new Date().getTime())-$_eseecode.execution.startTime)/1000;
			document.getElementById("dialog-debug-execute-stats").innerHTML = _("Instructions executed")+": "+($_eseecode.execution.programCounter-1)+"<br />"+_("Execution time")+": "+executionTime+" "+_("secs");
		}
		$_eseecode.execution.programCounter = 0;
		$_eseecode.execution.programCounterLimit = 0;
		$_eseecode.execution.breakpointCounterLimit = 1;
		$e_executionTraceReset();
		$e_unhighlight();
	}

	/**
	 * Checks the passed parameters to a given function
	 * @private
	 * @param {String} instructionName Name of the instruction calling it
	 * @throws codeError
	 * @example $e_parseParameterTypes("forward",arguments);
	 */
	function $e_parseParameterTypes(instructionName,params) {
		var instructionId = instructionName;
		var instruction = $_eseecode.instructions.set[instructionId];
		var instructionParams = instruction.parameters;
		var msg = "";
		var invalidCount = 0;
		for (var i=0; i< instructionParams.length; i++) {
			var invalidParameter = false;
			var parameter = instructionParams[i];
			var value = params[i];
			var msgParam = "";
			if (value === undefined || value === null || value === "") {
				if (!parameter.optional) {
					msgParam = _("has no value, but a value is required. The value received is:")+" "+value+" ("+_($e_analyzeVariable(value).type)+")\n";
					invalidParameter = true;
				}
			} else if ((parameter.type == "number" && !$e_isNumber(value)) ||
			 (parameter.type == "bool" && !$e_isBoolean(value)) ||
			 (parameter.type == "color" && !$e_isColor(value)) ||
			 (parameter.type == "layer" && !$e_isLayer(value)) ||
			 (parameter.type == "window" && !$e_isWindow(value))) {
				msgParam = _("should be a %s but instead received this %s:",[_(parameter.type),_($e_analyzeVariable(value).type)])+" "+value+"\n";
				invalidParameter = true;
			} else if (parameter.validate && !parameter.validate(value)) {
				msgParam = _("doesn't have a valid value:")+" "+value+"\n";
				invalidParameter = true;
			}
			if (invalidParameter) {
				msg += _("The %s parameter (%s)",[$e_ordinal(i+1),_(parameter.name)])+" "+msgParam;
				invalidCount++;
			}
		}
		if (invalidCount > 0) {
			var header = "";
			if (invalidCount>1) {
				header += _("Invalid parameters")+":";
			} else {
				header += _("Invalid parameter")+":";
			}
			header += " ";
			if (invalidCount > 1) {
				header += "\n";
			}
			throw new $e_codeError(instructionName,header+msg);
		}
		// Enable this when running user code directly without going through the jison parser
		if ($_eseecode.execution.forceCheckLimits) {
			$e_checkExecutionLimits($_eseecode.session.highlight.lineNumber);
		}
	}
