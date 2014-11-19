goog.array.extend=function(a,b){
  for(var c=1;c<arguments.length;c++){
    var d=arguments[c],e;
    if(goog.isArray(d) || goog.isArrayLike(d)) {
      for(var g=d.length,h=0;h<g;h++)a.push(d[h]);
    } else
      a.push(d);
  }
};
