const width = 800
const height = 500
const margin = {
    top: 10,
    bottom: 40,
    left: 40,
    right: 30
}

// Selecciono y defino el svg
const svg = d3.select("div#chart").append("svg")
            .attr("width", width)
            .attr("height", height)

// Genero un grupo para los elementos gráficos
const elementsGroup = svg.append("g").attr("id", "elementsGroup")
            .attr("transform", `translate(${margin.left} , ${margin.top})`)

// Creo otro grupo para los ejes
const axisGroup = svg.append("g").attr("id", "axisGroup")

// Genero los ejes x, y asociados a axisGroup
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup")
            .attr("transform", `translate(${margin.left} , ${height - margin.bottom})`)

const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup")
            .attr("transform", `translate(${margin.left} , ${margin.top})`)

// Defino las escalas
const scaleX = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.1)
const scaleY = d3.scaleLinear().range([height - margin.top - margin.bottom, 0])

// Defino los ejes x,y
const xAxis = d3.axisBottom().scale(scaleX)
const yAxis = d3.axisLeft().scale(scaleY)
            //.ticks(5)

// Importo el dataset
d3.csv("WorldCup.csv").then(data => {

    // Hay que transformar de str a int los años de cada Mundial
    data.map( d => {
        d.Year = +d.Year
    })
    // Agrupo las victorias por país ("Winner")
    let dataNest = d3.nest().key(d => d.Winner).entries(data)
    console.log(dataNest)

    // Para obtener cuántas veces ganó cada país, selecciono la longitud del campo values
    dataNest.map ( d => {
        d.values = +d.values.length
    })

    // Ordeno los resultados por nº de mundiales ganados
    sortedDataNest = dataNest.slice().sort((b,a) => d3.descending(b.values, a.values))

    // Etiquetas en los ejes x, y:
    const xLabel = elementsGroup.append("text").text("Country")
           .attr("transform", `translate(${width - 97} , ${height - 20})`)
           .attr("class", "axisLabel")

    const yLabel = elementsGroup.append("text").text("#Football World Cups")
            .attr("transform", `translate(${-margin.right + margin.top}, ${160}) rotate(-90)`)
            .attr("class", "axisLabel")

    // Falta definir el dominio de cada escala:
    scaleX.domain(sortedDataNest.map(item => item.key))
    scaleY.domain([0, d3.max(sortedDataNest.map(item => item.values))])

    // Ahora ya podemos pintar los ejes:
    // Y modifico el nº de ticks del eje y, haciéndolo corresponder con el valor max del dominio:
    yAxis.ticks(scaleY.domain()[1])
    xAxisGroup.call(xAxis).selectAll("text")
            .attr("font-size", "13")
            .attr("class", "dataLabel")
    yAxisGroup.call(yAxis).selectAll("text")
            .attr("font-size", "13")
            .attr("class", "dataLabel")

    // Hacemos Data Binding:
    let elements = elementsGroup.selectAll("rect").data(sortedDataNest)
    elements.enter().append("rect")
        .attr("class", "worldCups")
        .attr("x", d => scaleX(d.key) )
        .attr("y", d => scaleY(d.values))
        .attr("width", scaleX.bandwidth())
        .attr("height", d => height - margin.top - margin.bottom - scaleY(d.values))

})

