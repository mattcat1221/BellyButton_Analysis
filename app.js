d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(({names}) => {

names.forEach(name => {
console.log(name)  
});

})
