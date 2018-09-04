#!/usr/bin/python
import pandas as pd
import numpy as np
import scipy
import math
import os
import matplotlib.pyplot as plt
import seaborn as sns
import requests
import nltk
import gensim
import csv
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter
import math
from nltk import word_tokenize
import gensim.downloader as api
from gensim.models import Word2Vec
from gensim.scripts.glove2word2vec import glove2word2vec
import argparse
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from nltk.corpus import wordnet as wn
import re
from subprocess import check_output
from nltk.metrics import edit_distance
import spacy

from nltk.corpus import stopwords
from nltk.corpus import wordnet
import json

def callMe():
    return 'you called me'

def getAvgRunAvgBen(modelAns, actAns):
    x = run_avg_benchmark(actAns, actAns, model=word2vec)
    y= run_avg_benchmark(modelAns, actAns, model=word2vec)
    z=run_avg_benchmark(modelAns, modelAns, model=word2vec)
    return (2*y)/(x+z)

def getSpacySim(modelAns, actAns):
    doc1 = nlp(modelAns)
    doc2 = nlp(actAns)
    return doc1.similarity(doc2)

def getAdvancedSim(modelAns, actAns):
    act_ans = get_synonims(actAns)
    mod_ans = get_synonims(modelAns)
    return round(float(get_similarity(act_ans,mod_ans)),6)

def getAvgSimilarity(modelAns, actAns):
    sim1 = getAvgRunAvgBen(modelAns, actAns)
    sim2 = 0.5 * getSpacySim(modelAns,actAns)
    sim3 = getAdvancedSim(modelAns, actAns)
    #sim4 = getDiffSentiment(modelAns, actAns)
    #return ((0.7*(sim1+sim2+sim3))+(0.3*sim4))/4
    return (sim1+sim2+sim3)/3

def getDiffSentiment(modelAns, actAns):
    modelSent = findSentiment(modelAns)
    actSent = findSentiment(actAns)
    return (1 - abs(model_sentiment-act_sentiment))/2                

def get_similarity(act_ans,mod_ans):
    count=0
    actual_ans_len =len(act_ans)
    modal_ans_len =len(mod_ans)
    for fw in act_ans:
        if fw in mod_ans:
            count+=1
            mod_ans.remove(fw)
    
    final_mod_ans  = len(mod_ans)
    x = float((count/actual_ans_len)+(count/modal_ans_len))/2
    fresult = x #(x+x1)/2
    
    return fresult

def getRecommendation(json_string):
    easyCount = 0
    mediumCount = 0
    hardCount = 0
    jsonToPython = json.loads(json_string)
    #print(jsonToPython)
    learnerModel = float(jsonToPython["model"])
    
    df = pd.read_csv('C:\\trainingtestingdata(1).csv')
    pp = df.loc[(df["model"]>=(learnerModel)) & (df["model"]<=(learnerModel + 0.10)) , ["EasyQuestions","AvgPerEasyQue","MediumQue","AvgPerMedQue","HardQuestions","AvgPerHardQue","model"]].head(10)
    
    for index, row in pp.iterrows():
        #print(int(jsonToPython["EasyQuestions"])*float(jsonToPython["AvgPerEasyQue"]))
        if(int(row["EasyQuestions"])*float(row["AvgPerEasyQue"]) > int(jsonToPython["EasyQuestions"])*float(jsonToPython["AvgPerEasyQue"])):
            easyCount +=1
        if(int(row["MediumQue"])*float(row["AvgPerMedQue"]) > int(jsonToPython["MediumQue"])*float(jsonToPython["AvgPerMedQue"])):
            mediumCount +=1
        if(int(row["HardQuestions"])*float(row["AvgPerHardQue"]) > int(jsonToPython["HardQuestions"])*float(jsonToPython["AvgPerHardQue"])):
            hardCount +=1

    if((easyCount > mediumCount) & (easyCount > hardCount)):
        print('Easy Test is recomended')
    elif((mediumCount > easyCount) & (mediumCount > hardCount)):
        print('Medium Test is recomended')  
    elif((hardCount > easyCount) & (hardCount > mediumCount)):
        print('Hard Test is recomended') 
    elif((easyCount == mediumCount) or (easyCount == hardCount)):
        print('Easy Test is recomended')
    elif((mediumCount == hardCount) or (easyCount == hardCount)):
        print('Medium Test is recomended')

def get_synonims(text):
    #actual_answer_array = []
    actual_answer_array = [w for w in removestopword(text)]
    #print(actual_answer_array)
    actual_answer_synonim = actual_answer_array
    
    for w in actual_answer_array:
        syns = wordnet.synsets(w)
        for w in syns:
            if w.lemmas()[0].name() not in actual_answer_synonim:
                actual_answer_synonim.append(w.lemmas()[0].name()) 
    return (actual_answer_synonim[:200]) 

def removestopword(text):
    word_tokens = word_tokenize(text.lower())
    stop_words = set(stopwords.words('english'))
    answer_array = [w for w in word_tokens if not w in stop_words]
    return answer_array

#method 1
def run_avg_benchmark(sentences1, sentences2, model=None, use_stoplist=False, doc_freqs=None): 

    if doc_freqs is not None:
        N = doc_freqs["NUM_DOCS"]
    
    sims = []
    for (sent1, sent2) in zip(sentences1, sentences2):
    
        tokens1 = sent1.tokens_without_stop if use_stoplist else sent1
        tokens2 = sent2.tokens_without_stop if use_stoplist else sent2

        tokens1 = [token for token in tokens1 if token in model]
        tokens2 = [token for token in tokens2 if token in model]
        
        if len(tokens1) == 0 or len(tokens2) == 0:
            sims.append(0)
            continue
        
        tokfreqs1 = Counter(tokens1)
        tokfreqs2 = Counter(tokens2)
        
        weights1 = [tokfreqs1[token] * math.log(N/(doc_freqs.get(token, 0)+1)) 
                    for token in tokfreqs1] if doc_freqs else None
        weights2 = [tokfreqs2[token] * math.log(N/(doc_freqs.get(token, 0)+1)) 
                    for token in tokfreqs2] if doc_freqs else None
                
        embedding1 = np.average([model[token] for token in tokfreqs1], axis=0, weights=weights1).reshape(1, -1)
        embedding2 = np.average([model[token] for token in tokfreqs2], axis=0, weights=weights2).reshape(1, -1)

        sim = cosine_similarity(embedding1, embedding2)[0][0]
        sims.append(sim)
    #print (sum(sims) / float(len(sims)))
    # if len(sims) > 0:
    #     return sum(sims) / float(len(sims))
    # else
    #     return len(sims)
    return np.mean(sims)


#method 3
def findSentiment(sentense):
    client = language.LanguageServiceClient()

    document = types.Document(
        content=sentense,
        type=enums.Document.Type.PLAIN_TEXT)
    jsonStr = client.analyze_sentiment(document=document)

    return jsonStr.document_sentiment.score


def download_sick(f): 

    response = requests.get(f).text

    lines = response.split("\n")[1:]
    lines = [l.split("\t") for l in lines if len(l) > 0]
    lines = [l for l in lines if len(l) == 5]

    df = pd.DataFrame(lines, columns=["idx", "sent_1", "sent_2", "sim", "label"])
    df['sim'] = pd.to_numeric(df['sim'])
    return df

def read_tsv(f):
    frequencies = {}
    with open(f) as tsv:
        tsv_reader = csv.reader(tsv, delimiter="\t")
        for row in tsv_reader: 
            frequencies[row[0]] = int(row[1])
        
    return frequencies


def tokenize(q1, q2):
    """
        q1 and q2 are sentences/questions. Function returns a list of tokens for both.
    """
    return word_tokenize(q1), word_tokenize(q2)


def posTag(q1, q2):
    """
        q1 and q2 are lists. Function returns a list of POS tagged tokens for both.
    """
    return nltk.pos_tag(q1), nltk.pos_tag(q2)


def stemmer(tag_q1, tag_q2):
    """
        tag_q = tagged lists. Function returns a stemmed list.
    """

    stem_q1 = []
    stem_q2 = []

    for token in tag_q1:
        stem_q1.append(stem(token))

    for token in tag_q2:
        stem_q2.append(stem(token))

    return stem_q1, stem_q2



def path(set1, set2):
    return wn.path_similarity(set1, set2)


def wup(set1, set2):
    return wn.wup_similarity(set1, set2)


def edit(word1, word2):
    if float(edit_distance(word1, word2)) == 0.0:
        return 0.0
    return 1.0 / float(edit_distance(word1, word2))

def computePath(q1, q2):

    R = np.zeros((len(q1), len(q2)))

    for i in range(len(q1)):
        for j in range(len(q2)):
            if q1[i][1] == None or q2[j][1] == None:
                sim = edit(q1[i][0], q2[j][0])
            else:
                sim = path(wn.synset(q1[i][1]), wn.synset(q2[j][1]))

            if sim == None:
                sim = edit(q1[i][0], q2[j][0])

            R[i, j] = sim

    # print R

    return R

def computeWup(q1, q2):

    R = np.zeros((len(q1), len(q2)))

    for i in range(len(q1)):
        for j in range(len(q2)):
            if q1[i][1] == None or q2[j][1] == None:
                sim = edit(q1[i][0], q2[j][0])
            else:
                sim = wup(wn.synset(q1[i][1]), wn.synset(q2[j][1]))

            if sim == None:
                sim = edit(q1[i][0], q2[j][0])

            R[i, j] = sim

    # print R

    return R


def overallSim(q1, q2, R):

    sum_X = 0.0
    sum_Y = 0.0

    for i in range(len(q1)):
        max_i = 0.0
        for j in range(len(q2)):
            if R[i, j] > max_i:
                max_i = R[i, j]
        sum_X += max_i

    for i in range(len(q1)):
        max_j = 0.0
        for j in range(len(q2)):
            if R[i, j] > max_j:
                max_j = R[i, j]
        sum_Y += max_j
        
    if (float(len(q1)) + float(len(q2))) == 0.0:
        return 0.0
        
    overall = (sum_X + sum_Y) / (2 * (float(len(q1)) + float(len(q2))))

    return overall


def semanticSimilarity(q1, q2):

    tokens_q1, tokens_q2 = tokenize(q1, q2)
    # stem_q1, stem_q2 = stemmer(tokens_q1, tokens_q2)
    tag_q1, tag_q2 = posTag(tokens_q1, tokens_q2)

    sentence = []
    for i, word in enumerate(tag_q1):
        if 'NN' in word[1] or 'JJ' in word[1] or 'VB' in word[1]:
            sentence.append(word[0])

    sense1 = Lesk(sentence)
    sentence1Means = []
    for word in sentence:
        sentence1Means.append(sense1.lesk(word, sentence))

    sentence = []
    for i, word in enumerate(tag_q2):
        if 'NN' in word[1] or 'JJ' in word[1] or 'VB' in word[1]:
            sentence.append(word[0])

    sense2 = Lesk(sentence)
    sentence2Means = []
    for word in sentence:
        sentence2Means.append(sense2.lesk(word, sentence))
    # for i, word in enumerate(sentence1Means):
    #     print sentence1Means[i][0], sentence2Means[i][0]

    R1 = computePath(sentence1Means, sentence2Means)
    R2 = computeWup(sentence1Means, sentence2Means)

    R = (R1 + R2) / 2

    # print R

    return overallSim(sentence1Means, sentence2Means, R)

def clean_sentence(val):
    "remove chars that are not letters or numbers, downcase, then remove stop words"
    regex = re.compile('([^\s\w]|_)+')
    sentence = regex.sub('', val).lower()
    sentence = sentence.split(" ")

    for word in list(sentence):
        if word in STOP_WORDS:
            sentence.remove(word)

    sentence = " ".join(sentence)
    return sentence

class Lesk(object):

    def __init__(self, sentence):
        self.sentence = sentence
        self.meanings = {}
        for word in sentence:
            self.meanings[word] = ''

    def getSenses(self, word):
        # print word
        return wn.synsets(word.lower())

    def getGloss(self, senses):

        gloss = {}

        for sense in senses:
            gloss[sense.name()] = []

        for sense in senses:
            gloss[sense.name()] += word_tokenize(sense.definition())

        return gloss

    def getAll(self, word):
        senses = self.getSenses(word)

        if senses == []:
            return {word.lower(): senses}

        return self.getGloss(senses)

    def Score(self, set1, set2):
        # Base
        overlap = 0

        # Step
        for word in set1:
            if word in set2:
                overlap += 1

        return overlap

    def overlapScore(self, word1, word2):

        gloss_set1 = self.getAll(word1)
        if self.meanings[word2] == '':
            gloss_set2 = self.getAll(word2)
        else:
            # print 'here'
            gloss_set2 = self.getGloss([wn.synset(self.meanings[word2])])

        # print gloss_set2

        score = {}
        for i in gloss_set1.keys():
            score[i] = 0
            for j in gloss_set2.keys():
                score[i] += self.Score(gloss_set1[i], gloss_set2[j])

        bestSense = None
        max_score = 0
        for i in gloss_set1.keys():
            if score[i] > max_score:
                max_score = score[i]
                bestSense = i

        return bestSense, max_score

    def lesk(self, word, sentence):
        maxOverlap = 0
        context = sentence
        word_sense = []
        meaning = {}

        senses = self.getSenses(word)

        for sense in senses:
            meaning[sense.name()] = 0

        for word_context in context:
            if not word == word_context:
                score = self.overlapScore(word, word_context)
                if score[0] == None:
                    continue
                meaning[score[0]] += score[1]

        if senses == []:
            return word, None, None

        self.meanings[word] = max(meaning.keys(), key=lambda x: meaning[x])

        return word, self.meanings[word], wn.synset(self.meanings[word]).definition()



sick_train = download_sick("https://raw.githubusercontent.com/alvations/stasis/master/SICK-data/SICK_train.txt")
sick_dev = download_sick("https://raw.githubusercontent.com/alvations/stasis/master/SICK-data/SICK_trial.txt")
sick_test = download_sick("https://raw.githubusercontent.com/alvations/stasis/master/SICK-data/SICK_test_annotated.txt")
sick_all = sick_train.append(sick_test).append(sick_dev)


PATH_TO_WORD2VEC = os.path.expanduser("/mount/data/GoogleNews-vectors-negative300.bin")
#PATH_TO_GLOVE = os.path.expanduser("D:\\Backup\\nlp-notebooks-master\\data\\sentence_similarity\\glove.840B.300d.txt")

# PATH_TO_FREQUENCIES_FILE = "D:\\Backup\\nlp-notebooks-master\\data\\sentence_similarity\\frequencies.tsv"
# PATH_TO_DOC_FREQUENCIES_FILE = "D:\\Backup\\nlp-notebooks-master\\data\\sentence_similarity\\doc_frequencies.tsv"



word2vec = gensim.models.KeyedVectors.load_word2vec_format(PATH_TO_WORD2VEC, binary=True)


# frequencies = read_tsv(PATH_TO_FREQUENCIES_FILE)
# doc_frequencies = read_tsv(PATH_TO_DOC_FREQUENCIES_FILE)
# doc_frequencies["NUM_DOCS"] = 1288431

word_vectors = api.load("glove-wiki-gigaword-100")

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="/mount/data/astral-shape-187315-e8e3ba35bd82.json"

STOP_WORDS = nltk.download('stopwords')
nlp = spacy.load('en_core_web_sm')
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
