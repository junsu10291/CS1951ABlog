from flask import Flask
from flask import request
from flask import render_template
import os
import pandas as pd
import sqlite3
import operator
from random import shuffle
from flask.json import jsonify
import json
import nltk
nltk.download('wordnet')
import pandas as pd
import sqlite3
import operator 
import ast
from nltk.corpus import wordnet


################################################################################################
def recommendation_rc(query):
	final_list = []
	searchwords = query.split()
	df_preclustered = pd.read_csv('preclustered.csv')
	df_term_cluster = pd.read_csv('restaurant_cluster_terms.csv')

	THRESHOLD = 0.9
	TOP_N = 20

	cluster_terms = []
	for cluster in df_term_cluster['terms']:
	    t = ast.literal_eval(cluster)
	    cluster_terms.append(t)
	    
	result = []
	searchwords_list = []
	cluster_terms_list = []

	for word1 in searchwords:
	    if len(wordnet.synsets(word1)) != 0:
	        searchwords_list.append(word1)

	for i in range(len(cluster_terms)):
	    temp = []
	    for word2 in cluster_terms[i]:
	        if len(wordnet.synsets(word2)) != 0:
	            temp.append(word2)
	    cluster_terms_list.append(temp)
	    
	clust = []
	average = []
	for i in range(len(cluster_terms_list)):
	    #temp = []
	    total = 0
	    count = 0
	    result = []
	    for word2 in cluster_terms_list[i]:
	        wordFromList2 = wordnet.synsets(word2)[0]
	        for word1 in searchwords_list:
	            wordFromList1 = wordnet.synsets(word1)[0]
	            s = wordFromList2.wup_similarity(wordFromList1)
	            if s!=None:
	                if s > THRESHOLD:
	                    result.append([word1, word2, s])
	                    total += s
	                    count += 1
	    clust.append(result)
	    if count>0:
	        average.append(total/count)
	    else:
	        average.append([])
	        
	        
	indices = []
	similarity = []

	for i in range(len(average)):
	    if type(average[i]) is float:
	        indices.append(i)
	        similarity.append(average[i])   
	rank = {'similarity': similarity, 'indices': indices}
	df_rank = pd.DataFrame(rank, columns = {'similarity', 'indices'})

	df_rank = df_rank.sort_values(by=['similarity'], ascending=False)
	ranked_similarity = df_rank['similarity'].tolist()
	ranked_indices = df_rank['indices'].tolist()
	same_similarity_value = True

	best_cluster = []
	if len(ranked_similarity)==0:
		message = 'Sorry, we did not understand your query!'
		final_list = []
		conn = sqlite3.connect("yelp2.db")
		business = pd.read_sql_query("select * from business;", conn)
		for i in range(len(business[business['stars']==5]['name'])):
			final_list.append([business[business['stars']==5]['name'].iloc[i],
	                                  business[business['stars']==5]['categories'].iloc[i],
	                                  business[business['stars']==5]['address'].iloc[i]])
		for i in range(len(business[business['stars']==4]['name'])):
			final_list.append([business[business['stars']==4]['name'].iloc[i],
	                                  business[business['stars']==4]['categories'].iloc[i],
	                                  business[business['stars']==4]['address'].iloc[i]])
		shuffle(final_list)
		final_list.append('None')
		final_list.append('Sorry, we did not understand your query!, but here are some general recommendations:')
		final_list.append('NOTFOUND')

		return final_list
	else:
	    best_score = ranked_similarity[0]
	    for i in range(len(ranked_similarity)):
	        if ranked_similarity[i] == best_score:
	            best_cluster.append(ranked_indices[i])
	        else:
	            break
	               
	    print('Your Query: ', searchwords)
	    for cluster in best_cluster:
	        print('Best Cluster (based on your query): ', cluster)
	        print('Topics: ', cluster_terms[cluster])

	    conn = sqlite3.connect("yelp2.db")
	    business = pd.read_sql_query("select * from business;", conn)

	    result = []
	    sorted_result = []
	    for cluster in best_cluster:
	        restaurants_stars = []
	        restaruants_bestcluster = df_preclustered[df_preclustered['restaurant_cluster']==cluster]['business_id'].tolist()
	        for el in set(restaruants_bestcluster):
	            restaurants_stars.append([el, business[business['business_id']==el]['stars'].iloc[0]])
	        sorted_result.append(sorted(restaurants_stars, key = lambda x: x[1]))

	    final_restaurantids = []
	    for cluster in sorted_result:
	        if len(cluster)<TOP_N:
	            TOP_N = len(cluster)
	        for i in range(1, TOP_N+1):
	            final_restaurantids.append(cluster[-i][0])

	    final_list.append(searchwords)
	    final_list.append(best_cluster)
	    final_list.append(cluster_terms)
	    for restaurant in final_restaurantids:
	        final_list.append([business[business['business_id'] == restaurant]['name'].iloc[0], 
	                       business[business['business_id'] == restaurant]['categories'].iloc[0], 
	                       business[business['business_id'] == restaurant]['address'].iloc[0]])


	return final_list

##########################################################################################################

def recommendation_uc(uid):
	current_user = uid
	TOP_N = 20

	df_preclustered = pd.read_csv('preclustered.csv')

	if len(df_preclustered[df_preclustered['user_id']==current_user])!=0:
	    current_cluster = df_preclustered[df_preclustered['user_id']==current_user]['user_cluster'].iloc[0]
	    users_in_current_cluster = df_preclustered[df_preclustered['user_cluster']==current_cluster]['user_id']
	    users_in_current_cluster = set(users_in_current_cluster)
	    users_in_current_cluster = list(users_in_current_cluster)

	    recommended_restaurants = {}
	    for user in users_in_current_cluster:
	        r_list = list(set(df_preclustered[df_preclustered['user_id']==user][df_preclustered['stars']==5]['business_id']))
	        for el in r_list:
	            if el in recommended_restaurants:
	                recommended_restaurants[el] += 1
	            else:
	                recommended_restaurants[el] = 1

	    sorted_x = sorted(recommended_restaurants.items(), key=operator.itemgetter(1))
	    sorted_x.reverse()

	    final_restaurantids = []

	    if len(sorted_x) < TOP_N:
	        TOP_N = len(sorted_x)

	    for i in range(TOP_N):
	        final_restaurantids.append(sorted_x[i][0])

	    conn = sqlite3.connect("yelp2.db")
	    business = pd.read_sql_query("select * from business;", conn)
	    final_list = []
	    
	    for restaurant in final_restaurantids:
	        final_list.append([business[business['business_id'] == restaurant]['name'].iloc[0], 
	                           business[business['business_id'] == restaurant]['categories'].iloc[0], 
	                           business[business['business_id'] == restaurant]['address'].iloc[0]])

	    final_list.append(str(current_cluster))
	    final_list.append(current_user)
	    final_list.append('FOUND')
	    
	else:
	    print('Sorry, we did not recognize your user_id!')
	    print()
	    print('General Recommendations:')
	    final_list = []
	   
	    conn = sqlite3.connect("yelp2.db")
	    business = pd.read_sql_query("select * from business;", conn)
	    for i in range(len(business[business['stars']==5]['name'])):
	        final_list.append([business[business['stars']==5]['name'].iloc[i],
	                                  business[business['stars']==5]['categories'].iloc[i],
	                                  business[business['stars']==5]['address'].iloc[i]])
	    for i in range(len(business[business['stars']==4]['name'])):
	        final_list.append([business[business['stars']==4]['name'].iloc[i],
	                                  business[business['stars']==4]['categories'].iloc[i],
	                                  business[business['stars']==4]['address'].iloc[i]])
	    shuffle(final_list)
	    final_list.append('None')
	    final_list.append('Sorry, we did not recognize your user_id, but here are some general recommendations:')

	return final_list #make this into json format
    


##########################################################################################################



app = Flask(__name__)

@app.route('/')
def my_form():
	return render_template("index.html")

@app.route('/', methods=['POST'])
def my_form_post1():
    if request.form['submit'] == 'Search by Keywords':
    	query = request.form['text_rc']
    	result = recommendation_rc(query)

    	if result[-1] != 'NOTFOUND':
    		dict_result = {'query': [], 'best_cluster': [], 'associated_terms': [], 'name': [], 'category' :[], 'address' :[]}
    		for el in result[0]:
    			dict_result['query'].append(el)
    		for el in result[1]:
    			dict_result['best_cluster'].append(str(el))
    			dict_result['associated_terms'].append(result[2][el])
    		for i in range(3,len(result)):
    			dict_result['name'].append(result[i][0])
    			dict_result['category'].append(result[i][1])
    			dict_result['address'].append(result[i][2])
    		recommendations = json.dumps(dict_result)
    		recommendations = json.loads(recommendations)
    	else:
    		dict_result = {'query': [], 'best_cluster': [], 'associated_terms': [], 'name': [], 'category' :[], 'address' :[]}
    		dict_result['query'] = result[-2]
    		dict_result['best_cluster'] = result[-3]
    		dict_result['associated_terms'] = result[-3]
    		for i in range(3,len(result)):
    			dict_result['name'].append(result[i][0])
    			dict_result['category'].append(result[i][1])
    			dict_result['address'].append(result[i][2])
    		recommendations = json.dumps(dict_result)
    		recommendations = json.loads(recommendations)

    	return render_template('rc_recommendation.html',  recommendations=recommendations)



    elif request.form['submit'] == 'Search by UserID':
    	user_id = request.form['text_uc']
    	result = recommendation_uc(user_id)
    	if result[-1] == 'FOUND':
    		print(result[-3])
    		dict_result = {'user_id': [], 'best_cluster': [], 'name': [], 'category' :[], 'address' :[]}
	    	dict_result['user_id'].append(result[-2])
	    	dict_result['best_cluster'].append(result[-3])
	    	for i in range(len(result)-3):
	    		dict_result['name'].append(result[i][0])
	    		dict_result['category'].append(result[i][1])
	    		dict_result['address'].append(result[i][2])
	    	recommendations = json.dumps(dict_result)
    		recommendations = json.loads(recommendations)


    	else:
	    	dict_result = {'user_id': [], 'best_cluster': [], 'name': [], 'category' :[], 'address' :[]}
	    	dict_result['user_id'].append(result[-1])
	    	dict_result['best_cluster'].append(result[-2])

	    	for i in range(len(result)-2):
	    		dict_result['name'].append(result[i][0])
	    		dict_result['category'].append(result[i][1])
	    		dict_result['address'].append(result[i][2])
    		recommendations = json.dumps(dict_result)
    		recommendations = json.loads(recommendations)
    	return render_template('uc_recommendation.html',  recommendations=recommendations)

    else:
    	print('error')
    	pass


@app.route('/rc_recommendation')
def rc_recommendation():
	return render_template("rc_recommendation.html")



@app.route('/uc_recommendation')
def uc_recommendation():
	return render_template("uc_recommendation.html")


if __name__ == '__main__':
    app.run()

