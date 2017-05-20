
import "../styles/main.sass"

import * as d3 from "d3"
import axios from "axios"

const URL = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json",
			width = 900,
			height = 700,
			spriteWidth = 16,
			spriteHeight = 11


axios.get(URL) 
		.then((response) => {
 			const nodes = response.data.nodes,
 						links = response.data.links

			var chart = d3.select(".chart")
					.attr("width", width)
					.attr("height", height)

			var tooltip = d3.select(".card").append("div").attr("class", "toolTip")

			var simulation = d3.forceSimulation()
													.nodes(nodes)
													.force("link", d3.forceLink(links)
														.distance(50)
														.strength(0.9))
													.force("charge", d3.forceManyBody()  
														.strength(-60))
													.force("center", d3.forceCenter((width / 2), (height / 2)))
													.force("collide", d3.forceCollide(16).strength(0.7))
													.force("x", d3.forceX(width / 2))
													.force("y", d3.forceY(height / 2))

			var link = chart.append("g")
					.attr("class", "links")
				.selectAll(".line")
				.data(links)
				.enter()
				.append("line")
					.attr("class", "link")
					.style("stroke", "black")
					.style("stroke-width", 1)

			var node = d3.select(".forceBox")
				.append("div")
					.attr("class", "nodes")
					.style("width", width + "px")
				.selectAll(".node")
					.data(nodes)
					.enter()
					.append('img')
						.attr('class', (d) => { return 'flag flag-' + d.code })
						.style("cursor", "pointer")
		        .on("mouseover", (d) => {
		          tooltip
		          	.html(`<p>${d.country}</p>`)
		          	.style("opacity", "0.9")
		          	.style("left", (d3.event.pageX - 35 ) + "px")
		          	.style("top", (d3.event.pageY - 40 ) + "px")
		        })
		        .on("mouseout", () => { tooltip.style("opacity", "0") })
						.call(d3.drag()
							.on("start", dragstarted)
							.on("drag", dragged)
							.on("end", dragended))	

			simulation
				.on("tick", () => {
					
					node
						.style("left", (d) => {
							d.x = Math.max(0, Math.min(width - spriteWidth, d.x));
              return d.x + "px";
						})
						.style("top", (d) => {
                d.y = Math.max(0, Math.min(height - spriteHeight, d.y));
                return d.y + "px";
            });

					link
						.attr("x1", (d) => { return d.source.x + (spriteWidth / 2) })
						.attr("y1", (d) => { return d.source.y + (spriteHeight / 2) })
						.attr("x2", (d) => { return d.target.x + (spriteWidth / 2) })
						.attr("y2", (d) => { return d.target.y + (spriteHeight / 2) })
				
				})

			node.exit().remove();
  		link.exit().remove();

			function dragstarted(d) {
			  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			  d.fx = d.x;
			  d.fy = d.y;
			}

			function dragged(d) {
			  d.fx = d3.event.x;
			  d.fy = d3.event.y;
			}

			function dragended(d) {
			  if (!d3.event.active) simulation.alphaTarget(0);
			  d.fx = null;
			  d.fy = null;
			}

		})
		.catch((error) => {
			console.error(error)
		})
