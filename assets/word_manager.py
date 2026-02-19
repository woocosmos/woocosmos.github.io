import pickle


if __name__ == '__main__':
    my_object = {'파이썬': 'python', 
                '파이토치': 'pytorch', 
                '옵티마이저':'optimizer', 
                '텐서':'tensor', 
                '벡터':'vector', 
                '도커':'docker',
                '윈도우':'windows'}

    with open('./synoyms.pkl', 'wb') as file:
        pickle.dump(my_object, file)