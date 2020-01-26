// Author: Martin Vadlejch
// CSC 385 Computer Graphics
// Version: Winter 2020

import {debugWrite} from './DebugConsole.js';
import { Vector2, Vector3 } from '../extern/three.module.js';

// All points are integer pixel coordinates
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
let log = new writeLog();
// Takes a point given as vec2 in pixel coordinates and a color given
// as vec3.  Changes the pixel that the point lies in to the color.
export function rasterizePoint(board, point, color){

    board.writePixel(point[0], point[1], color);
    debugWrite("writePixel(" + point[0].toString() + ", " + point[1].toString() + ")");
    log.add(point);
    
}

//cross(A, B) = [
//    *      a2 * b3 - a3 * b2,
//    *      a3 * b1 - a1 * b3,
//    *      a1 * b2 - a2 * b1
//    *    ]
export function cross(A, B){
    let res = [ 0, 0, A[0]*B[1]-A[1]*B[0] ];
    return res;
}
export function dot(A, B){
    let res = A[0]*B[0] + A[1]*B[1] + A[2]*B[2] ;
    return res;
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
        debugWrite("writePixel(" + x0.toString() + ", " + y0.toString() + ")");
        log.add(new Vector2(x0,y0));
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

function isOnTheSameSide(point0, point1, boundary0, boundary1){
    let cross1 = cross([ boundary1.x - boundary0.x,  boundary1.y - boundary0.y],
                        [ point0.x    - boundary0.x,     point0.y - boundary0.y] )  ;  //cp1 = CrossProduct(b-a, p1-a)

    let cross2 = cross([ boundary1.x - boundary0.x,  boundary1.y - boundary0.y],
                        [ point1.x    - boundary0.x,     point1.y - boundary0.y] )  ;  //cp2 = CrossProduct(b-a, p2-a)

    let res = dot(cross1, cross2);
    if(res >= 0){
        return true;
    }
    else{
        return false;
    }

}

function isInTriangle(point, boundary0, boundary1, boundary2){
    if( isOnTheSameSide(point, boundary0, boundary1, boundary2) &
        isOnTheSameSide(point, boundary1, boundary2, boundary0) &
        isOnTheSameSide(point, boundary2, boundary0, boundary1)
    ){
        return true;
    }
    else{
        return false;
    }
}

function floodFill(board, point, bound0, bound1, bound2, color){
    //[x0,y0] = point;
    let x0 = point.x;
    let y0 = point.y;

    
    if( x0 > 0 ){ // give it 4 vectors instead, not the first vector2
        if( isInTriangle(new Vector2(x0-1, y0), bound0, bound1, bound2) ){
            rasterizePoint(board, new Vector2(x0-1, y0), color);
        }
    }

    if ( y0 > 0){    
        if( isInTriangle(new Vector2(x0, y0-1), bound0, bound1, bound2) ){
            rasterizePoint(board, new Vector2(x0, y0-1), color);
        }
        
    }
    if( x0 < 14 ){
        if( isInTriangle(new Vector2(x0+1, y0), bound0, bound1, bound2) ){
            rasterizePoint(board, new Vector2(x0+1, y0), color);
        }
    }

    if ( y0 < 14 ){    
        if( isInTriangle(new Vector2(x0, y0+1), bound0, bound1, bound2) ){
            rasterizePoint(board, new Vector2(x0, y0+1), color);
        }
        
    }
}

// Takes three points given as vec2 in pixel coordinates and a color
// as a vec3.  Draws a filled triangle between the points of the
// color. Implemented using flood fill.
export function rasterizeFilledTriangle(board, point1, point2, point3, color){
    
    log.clear();
    rasterizeLine(board, point1, point2, color);
    rasterizeLine(board, point2, point3, color);
    rasterizeLine(board, point1, point3, color);
    for( let i = 0; i < log.get().length; i++){
        floodFill(board, log.get()[i], point1, point2, point3, color);
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
