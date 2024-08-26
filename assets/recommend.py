import requests
import json
import re
import numpy as np

from konlpy.tag import Okt
from sklearn.feature_extraction.text import TfidfVectorizer

def collect_contents(url, pttrn, noTag):
    # get JSON from URL after cleansing
    response = requests.get(url, verify=False)
    cleaned_response = re.sub(pttrn, ' ', response.text)
    normalized_response = re.sub(r'\s+', ' ', cleaned_response)
    
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
            eng_res.append(k)
    return eng_res

# korean tokenizer
def kor_prc(c):
    okt = Okt()
    kor_res =[]
    for k in okt.nouns(c):
        if (len(k) > 1) & (k not in stop_words):
            kor_res.append(k)
    return kor_res

def create_corpus(contents):
    keywords_eng = list(map(eng_prc, contents))
    keywords_kor = list(map(kor_prc, contents))
    corpus = [' '.join(e+k) for e, k in zip(keywords_eng, keywords_kor)]
    return corpus

def extract_keywords(corpus, topN=5):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)
    feature_names = vectorizer.get_feature_names_out()
    sum_tfidf_scores = np.array(tfidf_matrix.sum(axis=0)).flatten()

    top_indices = sum_tfidf_scores.argsort()[-topN:][::-1]
    top_keywords = [(feature_names[idx], sum_tfidf_scores[idx]) for idx in top_indices]

    # print
    print(f"Top {topN} keywords for the entire corpus:")
    for keyword, score in top_keywords:
        print(f"    {keyword}: {score:.4f}")

    return top_keywords

def get_stopwords(p, add_words=[]):
    with open(p, "r") as f:
        sw = f.read().splitlines()
    sw += add_words
    return sw

if __name__ == '__main__':
    stop_path = "stopwords.txt"
    stop_words = get_stopwords(stop_path, add_words=['woocosmos', '데이터'])

    url = 'https://woocosmos.github.io/search.json'
    pattern = r'[^\sa-zA-Z0-9\uac00-\ud7af,\-:"\[\]{}./]+'
    exc_tag = '샘플'

    contents = collect_contents(url, pattern, exc_tag) 
    corpus = create_corpus(contents)
    top_keywords = extract_keywords(corpus)