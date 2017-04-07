# 4/06/2017 (Thursday) Blog Post II

### Previosuly...
In blog post I and midterm report, we briefly analyzed which words(tokens) were most influential/frequent in 5-star and 1-star ratings. We explored other factors such as relationship between weather (sunny / runny) and number of reviews. Since it rarely rained on Las Vegas, we decided to dive deeper into reviews and ratings (which has far more applications as well) to see whether reviews could acutally predict rating of a store.

### Process
1. After converting JSON data, we realized that each rating had different number of reviews.
2. In order to equally compare each rating, we first found ratings with least number. 2 was the least rated number with 358550. 
3. Then we got first 358550 ratings of each stars.
4. Using the TfidfVectorizer, we counted 



# 3/08/2017 (Wednesday) Blog Post I

### Data provided by Yelp
yelp_academic_dataset_business.json (size: 114.5 MB, records: 144,073)  
yelp_academic_dataset_checkin.json (size: 46.2 MB, records: 125,533)  
yelp_academic_dataset_review.json (size: 3.46 GB, records: 4,153,151)  
yelp_academic_dataset_tip.json (size: 182.2 MB, records: 946,601)  
yelp_academic_dataset_user.json (size: 1.18 GB, records: 1,029,433)  

### Overview

Due to large dataset, we decided to specifically focus on restaurants and parlors in Nevada, mostly in Las Vegas.
In order to get a clear picture of how the restaurants and stores were distribtued across Nevada, we ran several basic data explorations in various angles, toggling with zip codes, city, and county, map visualization, and word by word analysis of the reviews. 

### Data Exploration
<img src="NV_cities.png" alt="top20onestar" width="600" height="400">

This bar graph intuitively shows that our data is mostly concentrated in greater Las Vegas area (more than 90%, including Henderson, North Las Vegas).

<img src="NV_zipcode.png" alt="top20fivestar" width="600" height="400">

Next, we allocated stores by their zip codes, and as expected, even inside Las Vegas, we can see that
majority of them are located in Downton Las Vegas including the Strip area (89109, 89118, 89119). 

<img src="NV_star_valuecount.png" alt="top20onestar" width="600" height="400">

Here, we see a basic distribution of ratigs over the stores in Las Vegas region. The mean seems to be low 4, which indicates that most of the stores are viewed favorably and creates a cycle where already well-reviewed restaurants garner more reviews and higher ratings. While badly reviewd stores are shunned ans have fewer ratings. 

<img src="NV_neighborhood.png" alt="top20fivestar" width="600" height="400">

Here, we allocated the stores in terms of their county inside Las Vegas. 

<img src="top10words_onestar.png" alt="top20onestar" width="600" height="400">
<img src="top10words_fivestar.png" alt="top20fivestar" width="600" height="400">

We wanted to find out which words are accounted the most for reviews with two extreme star values, 1 and 5.
For the text analysis, we used sklearn.feature_extraction.text.CountVectorizer to fit and transform text data into a matrix of token counts. By fitting the model using Multinomial Naive Bayes classifier, we were able to get two interesting results for each case.

Top 10 one-star tokens: 1) ontrac, 2) frechheit, 3) rudent, 4) discriminates, 5) unprofessionally, 6) telemarketing, 7) unprofessional, 8) insinuating, 9) discusting, 10) transcripts

Top 10 five-star tokens: 1) delivioso, 2) smoothest, 3) foodgasm, 4) deelish, 5) eloff, 6) yummmmmm, 7) wac, 8) addicting, 9) uuu, 10) gluch

### Map Visualization
<img src="heatmap1.png" alt="heatmap1" width="600" height="400">
<img src="heatmap2.png" alt="heatmap1" width="600" height="400">
<img src="scatter1.png" alt="scatter1" width="600" height="400">
<img src="scatter2.png" alt="scatter2" width="600" height="400">

Libraries used: [gmplot](https://github.com/vgm64/gmplot), [geoplotlib](https://github.com/andrea-cuttone/geoplotlib)

In order to get a feel for where most of the data points (businesses) are located within the state of Nevada, we decided to plot the points on a map. There are two scatterplots and two heatmaps with varying zoom levels. As expected, we see that most of the datapoints within Nevada are in Las Vegas -- more specifically, the heatmap is more emphasized towards the The Strip (South Las Vegas Boulevard)

### Next Steps

We hope that by analyzing the review, we can spot the pattern of reviews and whether this can predict subsequent year's rating, review counts, and possibly whether that restaurant will prosper or close in the future. In the yelp data, there is no data which exactly show the sales or revenues of the restaurant, which can accurately represent the success of the business. So, we requested additional dataset about restaurant sales to CHD-experts. If we acquire data, we should find a way to combine and clean both datasets, and hope there are more patterns we can spot. In addition to that, we should finish up learning machine learning to find pattern and visualization on multiple parameters. Furthermore, we are trying to look into users, how each user influences subsequent reviews, who the power-reviewer is, and how they rate stores. 
