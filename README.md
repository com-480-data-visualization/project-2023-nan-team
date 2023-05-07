# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
<<<<<<< HEAD
| | |
| Romane Clerc | 301633 |
| | |
=======
| Romane Clerc | 301633 |
| Benjamin KRIEGER | 300273 |
| Antonio Cosimo Pisanello| 313437 |
>>>>>>> 8e13c759f6d7a3b3d840c1809d2da208c41ed14a

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


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

