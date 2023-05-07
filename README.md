# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Romane Clerc | 301633 |
| Benjamin KRIEGER | 300273 |
| Antonio Cosimo Pisanello| 313437 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (23rd April, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

We choose the WorldPop dataset which contains the density of population of every kilometer square on the whole planet from 2000 to 2020. This dataset has only 4 features, namely the year, the latitude, the longitude and the density, which makes it quite clean.


### Problematic


With this project we want to come with visualizations of population density. Most population density graphs are divided in 2 categories; those who show a temporal evolution of the density of a place, and those who show the geographical evolution at a defined time. 
With our project we want to merge these two approaches. Our idea is to have a Map that shows the people density per region with colors but also a timeline that can be changed to show how the evolution of the people density was going. We also want to be able to navigate smoothly between different regions or cities.
We hope that these data visualizations can help people see the evolution of urbanization and the migration of people to cities. Most specifically this could help students and demographers to work on demographic analysis
We will start with only Switzerland and we might add more countries.


### Exploratory Data Analysis

We use the WorldPop dataset, which is a dataset containing a map of the density of population from 2000 to 2020. We will mainly focus on the data from Switzerland which contains 68K data per year. 
We firstly had to concatenate datasets from WorldPop as they are divided by country and by year. The dataset in itself is quite clean as there are not many columns, namely the year, the latitude, the longitude and the density. The density goes from 0 to 20021 pop/km^2, the latitude from 5° to 10°, the longitude from 45° to 27°.
Here are some basic graph on this dataset:

<img src="images\image3.png" width= "48%" > <img src="images\image4.png" width= "48%" >


### Related work


We found some papers using the WorldPop dataset. Their use of it was for scientific research:

ModaresiRad, Arash, et al. "Human and infrastructure exposure to large wildfires in the United States." (2022).

Prasertsoong, Nutchapon, and Nattapong Puttanapong. "Regional Wage Differences and Agglomeration Externalities: Micro Evidence from Thai Manufacturing Workers." Economies 10.12 (2022): 319.

The dataset was mostly used as a tool to prove another point but we want to use it as a whole, to show the movements of population in Switzerland.

We got the idea after seeing Terence Fosstodon’s work. We liked how it turned out, this kind of data plotting is efficient for the reader to visualize density.


<!-- ![alt text](images\image1.jpg | width=100) ![alt text](images\image2.jpg)  -->

<img src="images\image1.jpg" width= "45%" > <img src="images\image2.jpg" width= "45%" >


## Milestone 2 (7th May, 5pm)

**10% of the final grade**

### The First MVP:
Our objective is to create a visualization of the global population density that allows users to interact and comprehend demographic changes in Switzerland and around the world. Our minimal viable product will be a map of the Earth that enables users to zoom in on any country and navigate within that country (e.g., zoom in, zoom out, move). Once users are satisfied with their view, they can toggle between various visualizations that aid in understanding the dataset. For this MVP, we opted for a 2D heatmap based on the dataset we found, with the ability for users to adjust two parameters using sliders:

* A slider to change the year
* A slider to adjust the radius of influence of each datapoint

The primary goal of our visualization project is achieved by using the first slider, while the second slider helps to smooth out the graph's noise and understand global behavior.

The primary tools used for this first MVP are:
* Leaflet, an open-source JavaScript library, to create interactive maps.
* D3 API to retrieve JSON data representing the geoJSON layer of countries and to manipulate and visualize the data.
noUiSlider, a slider library used to create the years slider control.
* We also require knowledge of the javascript, interactive, d3, and time series data lectures to execute this MVP effectively.

While this MVP is useful for demographic analysis, it has some limitations. We only used the Switzerland dataset for this part, and users cannot choose another country to zoom in on. Furthermore, the site lacks visual identity, which does not hold users' attention.

### Our Final Product Scheme:
In the final version, we plan to add a 3D grid-based visualization that utilizes the same map view selected on the 2D heatmap. This will make the site more visually appealing to users and potentially highlight other behaviors. Additionally, we need to create a cohesive visual identity for the entire site. We also want to include pop-ups on the map to display more detailed information about a region or city when the user hovers over it.

Here is a visual sketch for this part:


<img src="images\image5.png" width= "45%" > <img src="images\image6.png" width= "45%" >

To implement these new features, we plan to use three.js to create the 3D scene. We will also require knowledge of the Map lecture and the perception of color lecture to enhance the visualization further.

Lastly, we have some more advanced ideas that could be incorporated into this project. For example, we could add additional layers to the map, such as transportation infrastructure or land use, to help users understand how these factors relate to population density. We could also include graphs on the side of the visualization to provide more context and insight into the population density data. Lastly, we could incorporate the 3D terrain into the visualization.

### Demo:
To run the demo, you must first install nodejs, and we have only tested it on nodejs v19.2.0. Once installed, you need to run the server file located in the 'myserver' folder by running this command: node myserver/server. This will create a server that listens on localhost:3000. You can then use your browser to navigate to this address and interact with the demo.


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

