// Author: Martin Vadlejch
// CSC 385 Computer Graphics
// Version: Winter 2020

import {debugWrite} from './DebugConsole.js';

// All points are integer pixel coordinates

// Takes a point given as vec2 in pixel coordinates and a color given
// as vec3.  Changes the pixel that the point lies in to the color.
export function rasterizePoint(board, point, color){

    board.writePixel(point[0], point[1], color);
    debugWrite("writePixel(" + point[0].toString() + ", " + point[1].toString() + ")");
    
}

class writeLog {
    constructor() {
      this.log = [];
    }
    add(item) {
      this.log.push(item);
    }
    clear(){
        this.log = [];
    }
    get(){
        return this.log;
    }
  }

// Takes two points given as vec2 in pixel coordinates and a color
// given as vec3.  Draws line between the points of the color.
// Implemented using Bresenham's Algorithm.
export function rasterizeLine(board, point1, point2, color){

    var x0 = point1[0];
    var y0 = point1[1];
    var x1 = point2[0];
    var y1 = point2[1];
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;
    while(true) {
        board.writePixel(x0, y0, color);
        debugWrite("writePixel(" + x0.toString() + ", " + y0.toString() + ")")
        if ((x0 === x1) && (y0 === y1)) break;
        var e2 = 2*err;
        if (e2 > -dy) { err -= dy; x0  += sx; }
        if (e2 < dx) { err += dx; y0  += sy; }
    }

}



// Takes three points given as vec2 in pixel coordinates and a color
// given as vec3.  Draws triangle between the points of the color.
export function rasterizeTriangle(board, point1, point2, point3, color){

    rasterizeLine(board, point1, point2, color);
    rasterizeLine(board, point2, point3, color);
    rasterizeLine(board, point1, point3, color);

}

// Takes three points given as vec2 in pixel coordinates and a color
// as a vec3.  Draws a filled triangle between the points of the
// color. Implemented using flood fill.
export function rasterizeFilledTriangle(board, point1, point2, point3, color){

    //rasterizeTriangle(board, point1, point2, point3, color);
    var x0 = point1[0];
    var y0 = point1[1];
    var x1 = point2[0];
    var y1 = point2[1];
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;
    while(true) {
        board.writePixel(x0, y0, color);
        debugWrite("writePixel(" + x0.toString() + ", " + y0.toString() + ")")
        if ((x0 === x1) && (y0 === y1)) break;
        var e2 = 2*err;
        if (e2 > -dy) { err -= dy; x0  += sx; }
        if (e2 < dx) { err += dx; y0  += sy; }
    }

    var x2 = point1[0];
    var y2 = point1[1];
    var x3 = point3[0];
    var y3 = point3[1];
    dx = Math.abs(x3 - x2);
    dy = Math.abs(y3 - y2);
    sx = (x2 < x3) ? 1 : -1;
    sy = (y2 < y3) ? 1 : -1;
    err = dx - dy;
    while(true) {
        board.writePixel(x2, y2, color);
        debugWrite("writePixel(" + x2.toString() + ", " + y2.toString() + ")")
        if ((x2 === x3) && (y2 === y3)) break;
        var e2 = 2*err;
        if (e2 > -dy) { err -= dy; x2  += sx; }
        if (e2 < dx) { err += dx; y2  += sy; }
    }

    var x4 = point2[0];
    var y4 = point2[1];
    var x5 = point3[0];
    var y5 = point3[1];
    dx = Math.abs(x5 - x4);
    dy = Math.abs(y5 - y4);
    sx = (x4 < x5) ? 1 : -1;
    sy = (y4 < y5) ? 1 : -1;
    err = dx - dy;
    while(true) {
        board.writePixel(x4, y4, color);
        debugWrite("writePixel(" + x4.toString() + ", " + y4.toString() + ")")
        if ((x4 === x5) && (y4 === y5)) break;
        var e2 = 2*err;
        if (e2 > -dy) { err -= dy; x4  += sx; }
        if (e2 < dx) { err += dx; y4  += sy; }
    }

    

}

// Takes an array of seven points given as vec2 in pixel coordinates
// and a color given as a vec3.  Draws a filled 7-gon between from the
// point of the color.  Implemented using inside-outside test.
export function rasterizeFilledSevengon(board, points, color){

    // Extra Credit: Implement me!

}


// Takes two points given as vec2 in pixel coordinates and a color
// given as vec3.  Draws an antialiased line between them of the
// color.
export function rasterizeAntialiasLine(board, point1, point2, color){

    // Extra Credit: Implement me!
    // Remember to cite any sources you reference.

}
