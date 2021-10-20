/*
 * Copyright (c) 2016 [SCLeo (SCLeoX)]
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/* jslint node: true */

'use strict';

var findAll = function(str, target) {
  var pos = -1;
  var result = [];
  while ((pos = str.indexOf(target, pos)) !== -1) {
    result.push(pos);
    pos += target.length;
  }
  return result;
};
var ColorWorksObj = function() {
  this.active = true;
  this.tag1 = '𓄵';
  this.tag2 = '|';
  this.tag3 = '𓄳';
  this.codes = {
    black: ['textColor', '\u001b[30m', '\u001b[39m'],
    red: ['textColor', '\u001b[91m', '\u001b[39m'],
    darkRed: ['textColor', '\u001b[31m', '\u001b[39m'],
    green: ['textColor', '\u001b[92m', '\u001b[39m'],
    darkGreen: ['textColor', '\u001b[32m', '\u001b[39m'],
    yellow: ['textColor', '\u001b[93m', '\u001b[39m'],
    darkYellow: ['textColor', '\u001b[33m', '\u001b[39m'],
    blue: ['textColor', '\u001b[94m', '\u001b[39m'],
    darkBlue: ['textColor', '\u001b[34m', '\u001b[39m'],
    purple: ['textColor', '\u001b[95m', '\u001b[39m'],
    darkPurple: ['textColor', '\u001b[35m', '\u001b[39m'],
    cyan: ['textColor', '\u001b[96m', '\u001b[39m'],
    darkCyan: ['textColor', '\u001b[36m', '\u001b[39m'],
    white: ['textColor', '\u001b[97m', '\u001b[39m'],
    normal: ['textColor', '\u001b[37m', '\u001b[39m'],
    gray: ['textColor', '\u001b[90m', '\u001b[39m'],
    bgBlack: ['bgColor', '\u001b[40m', '\u001b[49m'],
    bgRed: ['bgColor', '\u001b[101m', '\u001b[49m'],
    bgDarkRed: ['bgColor', '\u001b[41m', '\u001b[49m'],
    bgGreen: ['bgColor', '\u001b[102m', '\u001b[49m'],
    bgDarkGreen: ['bgColor', '\u001b[42m', '\u001b[49m'],
    bgYellow: ['bgColor', '\u001b[103m', '\u001b[49m'],
    bgDarkYellow: ['bgColor', '\u001b[43m', '\u001b[49m'],
    bgBlue: ['bgColor', '\u001b[104m', '\u001b[49m'],
    bgDarkBlue: ['bgColor', '\u001b[44m', '\u001b[49m'],
    bgPurple: ['bgColor', '\u001b[105m', '\u001b[49m'],
    bgDarkPurple: ['bgColor', '\u001b[45m', '\u001b[49m'],
    bgCyan: ['bgColor', '\u001b[106m', '\u001b[49m'],
    bgDarkCyan: ['bgColor', '\u001b[46m', '\u001b[49m'],
    bgWhite: ['bgColor', '\u001b[47m', '\u001b[49m'],
    bgGray: ['bgColor', '\u001b[100m', '\u001b[49m'],
  };
};
ColorWorksObj.prototype.setStartTag = function(tag) {
  this.tag1 = tag;
};
ColorWorksObj.prototype.setMiddleTag = function(tag) {
  this.tag2 = tag;
};
ColorWorksObj.prototype.setEndTag = function(tag) {
  this.tag3 = tag;
};
ColorWorksObj.prototype.enable = function() {
  this.active = true;
};
ColorWorksObj.prototype.disable = function() {
  this.active = false;
};
ColorWorksObj.prototype.toggle = function() {
  this.active = !this.active;
};
ColorWorksObj.prototype.isActive = function() {
  return this.active;
};
ColorWorksObj.prototype.pack = function(codeName, str) {
  return this.tag1 + codeName + this.tag2 + str + this.tag3;
};
ColorWorksObj.prototype.compile = function(str) {
  if (!this.active) {
    return str;
  }
  var startTagPosList = findAll(str, this.tag1);
  var endTagPosList = findAll(str, this.tag3);
  if (startTagPosList.length !== endTagPosList.length) {
    return 'Compile failed: Different # of start tag and end tag.';
  }
  var stack = [];
  var nestStacks = {};
  var startTagPointer = 0;
  var endTagPointer = 0;
  var pos1;
  var pos2;
  var pos3;
  var scanPos = 0;
  var resultArr = [];
  var nestStack;
  var lastSameNestStack;
  var code;
  while (endTagPointer < endTagPosList.length) {
    if (startTagPosList[startTagPointer] < endTagPosList[endTagPointer]) {
      pos1 = startTagPosList[startTagPointer];
      pos2 = str.indexOf(this.tag2, pos1);
      resultArr.push(str.substring(scanPos, pos1));
      scanPos = pos2 + this.tag2.length;
      if (pos2 === -1) {
        return 'Compile failed: Mismatching of start tag and middle tag.';
      }
      code = this.codes[str.substring(pos1 + this.tag1.length, pos2)];
      if (code === undefined) {
        return 'Compile failed: Unknown code: ' + str.substring(pos1 + this.tag1.length, pos2) + '.';
      }
      nestStack = nestStacks[code[0]];
      if (!nestStack) {
        nestStacks[code[0]] = [];
        nestStack = nestStacks[code[0]];
      }
      lastSameNestStack = nestStack[nestStack.length - 1];
      if (lastSameNestStack !== undefined) {
        resultArr.push(lastSameNestStack[2]);
      }
      resultArr.push(code[1]);
      nestStack.push(code);
      stack.push(code);
      startTagPointer++;
    } else {
      pos3 = endTagPosList[endTagPointer];
      resultArr.push(str.substring(scanPos, pos3));
      scanPos = pos3 + this.tag3.length;
      code = stack.pop();
      if (code === undefined) {
        return 'Compile failed: Mismatching of start tag and end tag.';
      }
      resultArr.push(code[2]);
      nestStack = nestStacks[code[0]];
      nestStack.pop();
      lastSameNestStack = nestStack[nestStack.length - 1];
      if (lastSameNestStack !== undefined) {
        resultArr.push(lastSameNestStack[1]);
      }
      endTagPointer++;
    }
  }
  resultArr.push(str.substring(scanPos));
  return resultArr.join('');
};
const print = (text) => {
	var col = new ColorWorksObj();
	console.log(col.compile(text))
}
var shared;
module.exports = {
  create: function() {
    return new ColorWorksObj();
  },
  getShared: function() {
    if (!shared) {
      shared = new ColorWorksObj();
    }
    return shared;
  },
  print
};
