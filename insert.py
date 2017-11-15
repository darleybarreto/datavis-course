import pandas as pd
from pymongo import MongoClient,TEXT
from json import loads
from datetime import datetime

client = MongoClient('mongodb://localhost:27017/')
db = client["datavis"]

senate = db["senate"]
chamber = db["chamber"]

def to_mongo(dest, data, idxs=[]):
    dest.drop()

    for chunk in data:
        dest.insert_one(loads(chunk.to_json(orient='records')))
    
    for idx in idxs:
    	dest.create_index(idx)

indexes = [("congressperson_name",TEXT)]

deputies_dtype= {"cnpj_cpf":"np.uint64","document_number":"np.uint64","issue_date":datetime}
df_deputies = pd.read_csv('data/Chamber/reimbursements.xz',compression='xz',chunksize=10000,thousands=",")
to_mongo(chamber,df_deputies,indexes)

df_senate = pd.read_csv("data/Senate/federal-senate-reimbursements.xz",compression='xz',chunksize=10000,thousands=",")
to_mongo(senate,df_senate,indexes)