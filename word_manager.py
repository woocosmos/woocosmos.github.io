import pickle

my_object = {'파이썬': 'python', 
            '파이토치': 'pytorch', 
            '옵티마이저':'optimizer', 
            '텐서':'tensor', 
            '벡터':'vector', 
            '도커':'docker'}

with open('./assets/synoyms.pkl', 'wb') as file:
    pickle.dump(my_object, file)