from flask import Flask, request
import matplotlib.pyplot as plt
import numpy as np
from sklearn import datasets, linear_model
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.externals import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from flask_cors import CORS
import lib

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return "Hello World2!"

@app.route('/recommend/<nm>',methods = ['POST', 'GET'])
def recommend(nm):
    if request.method == 'POST':
        content = request.get_json(force=True)
        return lib.getRecommendation(content["model"], content["EasyQuestions"], content["MediumQue"], content["HardQuestions"], content["AvgPerEasyQue"], content["AvgPerMedQue"], content["AvgPerHardQue"])
    else:
        return ''

@app.route('/material/<nm>',methods = ['POST', 'GET'])
def material(nm):
    if request.method == 'POST':
        content = request.get_json(force=True)
        return lib.getRecommendedMaterial(content["model"], content["EasyQuestions"], content["MediumQue"], content["HardQuestions"], content["AvgPerEasyQue"], content["AvgPerMedQue"], content["AvgPerHardQue"], content["referencelink"])
    else:
        return ''


@app.route('/predict/<nm>',methods = ['POST', 'GET'])
def login(nm):
    if request.method == 'POST':
        #content = request.form["name"]
        content = request.get_json(force=True)
        #print('sdasdasdasdasdas')
        return implModel(content)
        #return content['name']
    else:
        user = request.args.get('nm')
        return user

def implModel(content):
	regr=joblib.load('regmodel.pkl')
	df2=pd.DataFrame(content,columns=['subjectid','EasyQuestions','AvgPerEasyQue','MediumQue','AvgPerMedQue','HardQuestions','AvgPerHardQue'])
	y_pred=regr.predict(df2)
	return str(y_pred[0])

@app.route('/sen_sim/<sen>',methods = ['POST', 'GET'])
def sen_sim(sen):
    data = request.get_json(force=True)
    modelAns = data['modelAns']
    actAns = data['actAns']
    modelword2vec = lib.word2vec
    ansss = "0"
    ansKeyword = ""
    response = ""
    model_sentiment = lib.findSentiment(modelAns)
    act_sentiment = lib.findSentiment(actAns)
    if (model_sentiment <= -0.25 and act_sentiment <= -0.25) or (model_sentiment > -0.25 and act_sentiment > -0.25 and model_sentiment <= 0.25 and act_sentiment <= 0.25) or (model_sentiment > 0.25 and act_sentiment > 0.25 and model_sentiment <= 1 and act_sentiment <= 1):
        ansss = str(lib.getAvgSimilarity(modelAns, actAns))
        ansKeyword = str(lib.getColoredText(modelAns, actAns))
        response = ansss + "#" + ansKeyword
        # absvalue = abs(model_sentiment-act_sentiment)
        # if absvalue == 0:
        #     absvalue = 1
        # sentimentvalue = absvalue
        # ansss = str(sentimentvalue)
        # sim1 = lib.run_avg_benchmark(modelAns, actAns, model=lib.word2vec)
        # sim2 = lib.word_vectors.wmdistance(modelAns, actAns)
        # if sim2 == float('Inf'):
        #     sim2 = 1000
        # #sim3 = 0 #lib.semanticSimilarity(modelAns, actAns)
        # #sim3 = sim3*2
        # avgofthreemodels = (sim1 + (1 / sim2))/2
        # answervalue = sentimentvalue*avgofthreemodels
        # ansss = str(answervalue)
    return ansss

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=5001)
