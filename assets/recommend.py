import os

import requests
import json
import re
import numpy as np
import pickle

from konlpy.tag import Okt
from sklearn.feature_extraction.text import TfidfVectorizer

def collect_contents(url, pttrn, noTag):
    # get JSON from URL after cleansing
    response = requests.get(url, verify=False)
    cleansed_response = re.sub(pttrn, ' ', response.text)
    normalized_response = re.sub(r'\s+', ' ', cleansed_response)
    
    # parse needed contents from the JSON
    json_data = json.loads(normalized_response)
    contents = [post['title'] + ' ' + post['content'] for post in json_data if noTag not in post['tags']]
    return contents

# english tokenizer
def eng_prc(c):
    eng_compiler = re.compile('[a-zA-Z]+')
    eng_res = []
    for k in eng_compiler.findall(c):
        if (len(k) > 1) & (k not in stop_words):
            eng_res.append(k.lower())
    return eng_res

# korean tokenizer
def kor_prc(c):
    okt = Okt()
    kor_res =[]
    for k in okt.nouns(c):
        if (len(k) > 1) & (k not in stop_words):
            f_k = synoyms.get(k, k)
            kor_res.append(f_k)
    return kor_res

def create_corpus(contents):
    keywords_eng = list(map(eng_prc, contents))
    keywords_kor = list(map(kor_prc, contents))
    corpus = [' '.join(e+k) for e, k in zip(keywords_eng, keywords_kor)]
    return corpus

def extract_keywords(corpus, topN=5, asset_dir=None):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)
    feature_names = vectorizer.get_feature_names_out()
    sum_tfidf_scores = np.array(tfidf_matrix.sum(axis=0)).flatten()
    average_tfidf_score = (sum_tfidf_scores.mean()*10).round(2)

    top_indices = sum_tfidf_scores.argsort()[-topN:][::-1]
    top_keywords = [['말뭉치 평균', average_tfidf_score]]
    top_keywords += [[feature_names[idx], round(sum_tfidf_scores[idx]*10, 2)] for idx in top_indices]

    # print
    print(f"Top {topN} keywords for the entire corpus:")
    for keyword, score in top_keywords:
        print(f"    {keyword}: {score}")
    
    if asset_dir:
        root_dir = os.path.dirname(asset_dir)
        save_path = os.path.join(root_dir, "keywords.json") 
        with open(save_path, 'w') as f:
            json.dump(top_keywords, f)
        print('keywords updated')

def get_stopwords(p, add_words=[]):
    with open(p, "r") as f:
        sw = f.read().splitlines()
    sw += add_words
    return sw

def get_synonym(p):
    with open(p, 'rb') as file:
        synoyms = pickle.load(file)
    return synoyms

if __name__ == '__main__':
    
    asset_dir = os.path.dirname(os.path.abspath(__file__))
    stop_path = os.path.join(asset_dir, "stopwords.txt")
    syn_path = os.path.join(asset_dir, "synoyms.pkl") 
    stop_words = get_stopwords(stop_path, add_words=['woocosmos', '데이터', '추가', '실행', '포인트'])
    synoyms = get_synonym(syn_path)

    url = 'https://woocosmos.github.io/search.json'
    pattern = r'[^\sa-zA-Z0-9\uac00-\ud7af,\-:"\[\]{}./]+'
    exc_tag = '샘플'

    contents = collect_contents(url, pattern, exc_tag) 
    corpus = create_corpus(contents)
    extract_keywords(corpus, asset_dir=asset_dir)