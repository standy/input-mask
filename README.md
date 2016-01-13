Simple and small library for creating input mask.  
Has no external dependencies, but can work as jquery plugin.  
Watch the [demo](http://standy.github.io/input-mask/demo/).


## Usage 
```
inputMask(document.getElementById('input'), options);
$('#input').mask(options);
```

#### Example
```
$('#date').mask({mask: '99.99.9999', placeholder: 'dd.mm.yyyy'});
```


## Options
#### options.mask
Required  
Creates mask for input values using `definitions`, all other symbols treated as separators  


#### options.placeholder
Placeholder. Avoid using same symbols as expected to input, its lead to ambiguity  


#### options.definitions
Set of pairs: mask symbol - regex string
```
definitions: {
  'x': '[ZXC]' 
}
```

Default value: 
```
{
	'9': '[0-9]', //numbers
	'a': '[A-Za-z\u0410-\u044F\u0401\u0451\u00C0-\u00FF\u00B5]', //letters
	'*': '[0-9A-Za-z\u0410-\u044F\u0401\u0451\u00C0-\u00FF\u00B5]' //both
}
```


## Build via gulp & test using karma
`gulp dev` - developers build & watch  
`gulp test` or `karma start` - launch the tests  
`gulp` - just build  


## Downloads

#### jQuery plugin
[jquery.input-mask.min.js](//standy.github.io/input-mask/dist/jquery.input-mask.min.js) - compressed, production version  
[jquery.input-mask.js](//standy.github.io/input-mask/dist/jquery.input-mask.js) - uncompressed, development version  

#### Library without dependencies
[input-mask.min.js](//standy.github.io/input-mask/dist/input-mask.min.js) - compressed, production version  
[input-mask.js](//standy.github.io/input-mask/dist/input-mask.js) - uncompressed, development version  
