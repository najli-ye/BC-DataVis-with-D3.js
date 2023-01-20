// Esto es para pintar la línea de edad de Leo
const diCaprioBirthYear = 1974;
const age = function(year) { return year - diCaprioBirthYear}
const today = new Date().getFullYear()
const ageToday = age(today)

// ----------------------------------------------------------

const width = 1000
const height = 750
const margin = {
    top: 20,
    bottom: 45,
    left: 50,
    right: 200
}
// Def de svg
const svg = d3.select("div#chart").append("svg")
            .attr("width", width)
            .attr("height", height)

// Def de grupo de elementos gráficos
const elementGroup = svg.append("g").attr("id", "elementGroup")
            .attr("transform", `translate (${margin.left} ${margin.top})`)

// Def de grupo para los ejes            
const axisGroup = svg.append("g").attr("id", "axisGroup")

// Def de grupo para cada eje
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup")
            .attr("transform", `translate (${margin.left} ${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup")
            .attr("transform", `translate (${margin.left} ${margin.top})`)

// Def de escalas y sus rangos
const scaleX = d3.scaleBand().range([0, width - margin.left - margin.right])
const scaleY = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])

// Def de cada eje y asociación a su escala
const xAxis = d3.axisBottom().scale(scaleX)
const yAxis = d3.axisLeft().scale(scaleY)

// Obtengo datos
d3.csv("data.csv").then(data => {
    console.log(data)

    // Hay que hacer una pequeña transformación de los datos, para pasar str -> int
    data.map(d => {
        d.year = +d.year
        d.age = +d.age
    })

    // Etiquetas en los ejes x, y:
    const xLabel = elementGroup.append("text").text("Dating Year")
        .attr("transform", `translate(${width - margin.right - margin.left} , ${height - 25})`)
        .attr("class", "axisLabel")

    const yLabel = elementGroup.append("text").text("Age")
         .attr("transform", `translate(${-30}, ${50}) rotate(-90)`)
         .attr("class", "axisLabel")
    
    // Etiqueta flotante con info
    const popLabel = elementGroup.append("text").attr("id", "popLabel")

    // Estaba pte definir los dominios de las escalas de ejes. Eje 'x' son los años; eje 'y' son las edades, pero Leo marca el dominio máx
    scaleX.domain(data.map(d => d.year))
    scaleY.domain([0, d3.max(data.map(d => age(d.year)))])

    // Defino el nº de ticks acorde al dominio
    yAxis.ticks(scaleY.domain()[1])

    // Llamada a los ejes
    xAxisGroup.call(xAxis)
        .attr("class", "dataLabel")
    yAxisGroup.call(yAxis)
        .attr("class", "dataLabel")

    // Defino los elementos de las barras : las edades de las novias de Leo
    let barElements = elementGroup.selectAll("rect").data(data)
    barElements.enter().append("rect")
            .attr("class", d => d.name.replace(" ", ""))
            .attr("x", d => scaleX(d.year))
            .attr("y", d => scaleY(d.age))
            .attr("width", scaleX.bandwidth())
            .attr("height", d => height - margin.top - margin.bottom- scaleY(d.age))
            .on("mouseover", showName) 

    // Defino la gráfica de línea : la edad de Leo en cada año
    let line = d3.line().x(d => scaleX(d.year)).y(d => scaleY(age(d.year)))
    elementGroup.datum(data)
            .append("path")        
            .attr("class","line")
            .attr("d", line) 
            .attr("transform", `translate (${scaleX.bandwidth()/2})`) // Desplazamos la línea 1/2 bandwidth para centrarla con el rótulo del año
    
    elementGroup.append("text").text("Leo DiCaprio's Age")
            .attr("class", "dataLabel")
            .attr("transform", `translate (${width/2 - 70} ${margin.top + 60})`)
    
})

// Función que muestra info adicional : nombre de la chica, su edad y la diferencia de edad con respecto a Leo
function showName(d) {
    mousecoords = d3.mouse(this)
    d3.select(popLabel).text(`${d.name}; Age ${d.age}; Age diff. ${age(d.year) - d.age}`)
    .attr("transform", `translate(${mousecoords[0]}, ${mousecoords[1]})`)
    }

