// Author: Martin Vadlejch
// CSC 385 Computer Graphics
// Version: Winter 2020

import {debugWrite} from './DebugConsole.js';
import { Vector2, Vector3 } from '../extern/three.module.js';

// All points are integer pixel coordinates

//this class stores pixels that were written and 
class writeLog {
    constructor() {
      this.log = [];
      this.colored = new Set();
    }
    add(item) {
      this.log.push(item);
    }
    clear(){
        this.log = [];
        this.colored.clear();
    }
    get(){
        return this.log;
    }
    color(item){
        this.colored.add(item.toString());
    }
    isColored(item){
        return this.colored.has(item.toString());
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
// we ony interpret the 2d vectors as 3d with zero Z coordinate, crossproduct is either negative or positive Z
export function cross(A, B){
    let res = [ 0, 0, A[0]*B[1]-A[1]*B[0] ];
    return res;
}
//dotproduct
export function dot(A, B){
    let res = A[0]*B[0] + A[1]*B[1] + A[2]*B[2] ;
    return res;
}

//courtesy of stack overflow, very helpful
function lineIntersect(x1,y1,x2,y2, x3,y3,x4,y4) {
    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    if (isNaN(x)||isNaN(y)) {
        return false;
    } else {
        if (x1>=x2) {
            if (!(x2<=x&&x<=x1)) {return false;}
        } else {
            if (!(x1<=x&&x<=x2)) {return false;}
        }
        if (y1>=y2) {
            if (!(y2<=y&&y<=y1)) {return false;}
        } else {
            if (!(y1<=y&&y<=y2)) {return false;}
        }
        if (x3>=x4) {
            if (!(x4<=x&&x<=x3)) {return false;}
        } else {
            if (!(x3<=x&&x<=x4)) {return false;}
        }
        if (y3>=y4) {
            if (!(y4<=y&&y<=y3)) {return false;}
        } else {
            if (!(y3<=y&&y<=y4)) {return false;}
        }
    }
    return true;
}

//used for the heptagon
function oddEvenTest(point, boundaries){
    let counter = 0;
    for(let i = 0; i < boundaries.length; i++){
        if(lineIntersect(point[0], point[1],-42, -42, boundaries[i][0], boundaries[i][1], boundaries[(i+1)%7][0], boundaries[(i+1)%7][1] )){
            counter += 1;
        }
    }
    if(counter%2 == 0){
        counter = 0;
        for(let i = 0; i < boundaries.length; i++){
            if(lineIntersect(point[0], point[1], 69, 69, boundaries[i][0], boundaries[i][1], boundaries[(i+1)%7][0], boundaries[(i+1)%7][1] )){
                counter += 1;
            }
        }

    }

    if(counter%2 == 0){
        counter = 0;
        for(let i = 0; i < boundaries.length; i++){
            if(lineIntersect(point[0], point[1], -42, 69, boundaries[i][0], boundaries[i][1], boundaries[(i+1)%7][0], boundaries[(i+1)%7][1] )){
                counter += 1;
            }
        }

    }
    
    return counter%2;
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
    let cross1 = cross([ boundary1[0] - boundary0[0],  boundary1[1] - boundary0[1]],
                        [ point0[0]    - boundary0[0],     point0[1] - boundary0[1]] )  ;  //cp1 = CrossProduct(b-a, p1-a)

    let cross2 = cross([ boundary1[0] - boundary0[0],  boundary1[1] - boundary0[1]],
                        [ point1[0]    - boundary0[0],     point1[1] - boundary0[1]] )  ;  //cp2 = CrossProduct(b-a, p2-a)

    let res = dot(cross1, cross2);
    if(res >= 0){
        return true;
    }
    else{
        return false;
    }

}

//self explanatory, 3 sides, if it is inside of all of them then it's inside triangle
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

//for triangles, with normal vectors for boundary check
function floodFill(board, point, bound0, bound1, bound2, color){
    //[x0,y0] = point;
    let x0 = point.x;
    let y0 = point.y;

    
    if( x0 > 0 ){ // give it 4 vectors instead, not the first vector2
        if( isInTriangle([x0-1, y0], bound0, bound1, bound2) ){
            if(log.isColored([x0-1, y0])){
                
            }
            else{
                log.color([x0-1, y0]);
                rasterizePoint(board, [x0-1, y0], color);
                floodFill(board, new Vector2(x0-1, y0), bound0, bound1, bound2, color);
            }
        }
    }

    if ( y0 > 0){    
        if( isInTriangle([x0, y0-1], bound0, bound1, bound2) ){
            if(log.isColored([x0, y0-1])){
                
            }
            else{
                log.color([x0, y0-1]);
                rasterizePoint(board, [x0, y0-1], color);
                floodFill(board, new Vector2(x0, y0-1), bound0, bound1, bound2, color);
            }
        }
        
    }
    if( x0 < 14 ){
        if( isInTriangle([x0+1, y0], bound0, bound1, bound2) ){
            if(log.isColored([x0+1, y0])){
                
            }
            else{
                log.color([x0+1, y0]);
                rasterizePoint(board, [x0+1, y0], color);
                floodFill(board, new Vector2(x0+1, y0), bound0, bound1, bound2, color);
            }
        }
    }

    if ( y0 < 14 ){    
        if( isInTriangle([x0, y0+1], bound0, bound1, bound2) ){
            if(log.isColored([x0, y0+1])){
                
            }
            else{
                log.color([x0, y0+1]);
                rasterizePoint(board, [x0, y0+1], color);
                floodFill(board, new Vector2(x0, y0+1), bound0, bound1, bound2, color);
            }
        }
        
    }
}

//for polygons with odd even test
function floodFillHeptagon(board, point, boundaries, color){
    let x0 = point.x;
    let y0 = point.y;
    if( x0 > 0 ){ // give it 4 vectors instead, not the first vector2
        if( oddEvenTest([x0-1, y0], boundaries) ){
            if(log.isColored([x0-1, y0])){
                
            }
            else{
                log.color([x0-1, y0]);
                rasterizePoint(board, [x0-1, y0], color);
                floodFillHeptagon(board, new Vector2(x0-1, y0), boundaries, color);
            }
        }
    }

    if ( y0 > 0){    
        if( oddEvenTest([x0, y0-1], boundaries) ){
            if(log.isColored([x0, y0-1])){
                
            }
            else{
                log.color([x0, y0-1]);
                rasterizePoint(board, [x0, y0-1], color);
                floodFillHeptagon(board, new Vector2(x0, y0-1), boundaries, color);
            }
        }
        
    }
    if( x0 < 14 ){
        if( oddEvenTest([x0+1, y0], boundaries) ){
            if(log.isColored([x0+1, y0])){
                
            }
            else{
                log.color([x0+1, y0]);
                rasterizePoint(board, [x0+1, y0], color);
                floodFillHeptagon(board, new Vector2(x0+1, y0), boundaries, color);
            }
        }
    }

    if ( y0 < 14 ){    
        if( oddEvenTest([x0, y0+1], boundaries) ){
            if(log.isColored([x0, y0+1])){
                
            }
            else{
                log.color([x0, y0+1]);
                rasterizePoint(board, [x0, y0+1], color);
                floodFillHeptagon(board, new Vector2(x0, y0+1), boundaries, color);
            }
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

    log.clear();
    rasterizeLine(board, points[0], points[1], color);
    rasterizeLine(board, points[2], points[1], color);
    rasterizeLine(board, points[2], points[3], color);
    rasterizeLine(board, points[4], points[3], color);
    rasterizeLine(board, points[4], points[5], color);
    rasterizeLine(board, points[6], points[5], color);
    rasterizeLine(board, points[6], points[0], color);
    for( let i = 0; i < log.get().length; i++){
        floodFillHeptagon(board, log.get()[i], points, color);
    }

}




// we have no way of controlling the opacity of pixels and we have to do the lines
// in color, which is not going to work because we can't just dim the AA'd pixels
// we can either do a black line and shift them to grayscale accordingly, or
// do a color shift for colors but that's not going to look like anything like antialiased line.


// Takes two points given as vec2 in pixel coordinates and a color
// given as vec3.  Draws an antialiased line between them of the
// color.
//
export function rasterizeAntialiasLine(board, point1, point2, color){

    // Extra Credit: Implement me!
    // Remember to cite any sources you reference.
    var x0 = point1[0];
    var y0 = point1[1];
    var x1 = point2[0];
    var y1 = point2[1];
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;
    let tmp1, tmp2;
    while(true) {
        tmp1 = 0;
        tmp2 = 0;
        board.writePixel(x0, y0, color);
        debugWrite("writePixel(" + x0.toString() + ", " + y0.toString() + ")");
        log.add(new Vector2(x0,y0));
        if ((x0 === x1) && (y0 === y1)) break;
        var e2 = 2*err;
        if (e2 > -dy) { err -= dy; x0  += sx; tmp1 = 1;}
        if (e2 < dx) { err += dx; y0  += sy; tmp2 = 1;}
        if( tmp2 & tmp1 ){
            board.writePixel(x0, y0-sy, new Vector3((color.x+40)%255, (color.y+40)%255, (color.z+40)%255));
            debugWrite("writePixel(" + (x0).toString() + ", " + (y0-sy).toString() + ")");
            board.writePixel(x0-sx, y0, new Vector3((color.x+40)%255, (color.y+40)%255, (color.z+40)%255));
            debugWrite("writePixel(" + (x0-sx).toString() + ", " + (y0).toString() + ")");
        }
    }

}
